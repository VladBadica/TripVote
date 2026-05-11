-- =============================================================================
-- TripVote – initial schema
-- Auth is handled by Supabase (auth.users). This migration adds all
-- application tables on top of it.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";


-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type trip_status   as enum ('planning', 'confirmed', 'completed');
create type member_role   as enum ('organizer', 'member');
create type poll_type     as enum ('destination', 'transport', 'general');


-- ---------------------------------------------------------------------------
-- profiles
-- One row per auth.users entry; created automatically via trigger.
-- Stores display info beyond what Supabase auth exposes directly.
-- ---------------------------------------------------------------------------
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_emoji text not null default '🧑',
  created_at   timestamptz not null default now()
);

-- Auto-create a profile row whenever a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ---------------------------------------------------------------------------
-- trips
-- ---------------------------------------------------------------------------
create table trips (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  destination  text not null,
  cover_emoji  text not null default '✈️',
  status       trip_status not null default 'planning',
  start_date   date,
  end_date     date,
  invite_code  text not null unique default upper(substring(md5(gen_random_uuid()::text), 1, 8)),
  created_by   uuid not null references auth.users(id),
  member_count int not null default 1,
  created_at   timestamptz not null default now(),

  constraint end_after_start check (end_date is null or end_date >= start_date)
);


-- ---------------------------------------------------------------------------
-- trip_members
-- ---------------------------------------------------------------------------
create table trip_members (
  id        uuid primary key default gen_random_uuid(),
  trip_id   uuid not null references trips(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  role      member_role not null default 'member',
  joined_at timestamptz not null default now(),

  unique (trip_id, user_id)
);

-- Keep trips.member_count in sync
create or replace function sync_member_count()
returns trigger language plpgsql as $$
begin
  update trips
  set member_count = (
    select count(*) from trip_members where trip_id = coalesce(new.trip_id, old.trip_id)
  )
  where id = coalesce(new.trip_id, old.trip_id);
  return null;
end;
$$;

create trigger trg_member_count
  after insert or delete on trip_members
  for each row execute procedure sync_member_count();


-- ---------------------------------------------------------------------------
-- polls
-- ---------------------------------------------------------------------------
create table polls (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  type       poll_type not null default 'general',
  question   text not null,
  created_by uuid not null references auth.users(id),
  closed     boolean not null default false,
  created_at timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- poll_options
-- ---------------------------------------------------------------------------
create table poll_options (
  id       uuid primary key default gen_random_uuid(),
  poll_id  uuid not null references polls(id) on delete cascade,
  label    text not null,
  position smallint not null default 0
);


-- ---------------------------------------------------------------------------
-- poll_votes
-- One vote per user per poll (single-choice). poll_id is denormalised here
-- so the unique constraint can be enforced without a subquery.
-- ---------------------------------------------------------------------------
create table poll_votes (
  id             uuid primary key default gen_random_uuid(),
  poll_id        uuid not null references polls(id) on delete cascade,
  poll_option_id uuid not null references poll_options(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  created_at     timestamptz not null default now(),

  unique (poll_id, user_id)
);


-- ---------------------------------------------------------------------------
-- checklist_items
-- ---------------------------------------------------------------------------
create table checklist_items (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  text        text not null,
  done        boolean not null default false,
  assignee_id uuid references auth.users(id) on delete set null,
  due_date    date,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz not null default now()
);


-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table profiles        enable row level security;
alter table trips           enable row level security;
alter table trip_members    enable row level security;
alter table polls           enable row level security;
alter table poll_options    enable row level security;
alter table poll_votes      enable row level security;
alter table checklist_items enable row level security;

-- Helper: is the current user a member of a trip?
create or replace function is_trip_member(p_trip_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from trip_members
    where trip_id = p_trip_id and user_id = auth.uid()
  );
$$;

-- Helper: is the current user the organizer of a trip?
create or replace function is_trip_organizer(p_trip_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from trip_members
    where trip_id = p_trip_id and user_id = auth.uid() and role = 'organizer'
  );
$$;


-- profiles ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "profiles: read any"
  on profiles for select using (true);

create policy "profiles: update own"
  on profiles for update using (id = auth.uid());


-- trips ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "trips: members can read"
  on trips for select using (is_trip_member(id));

create policy "trips: creator can read own"
  on trips for select using (created_by = auth.uid());

create policy "trips: authenticated can create"
  on trips for insert with check (auth.uid() = created_by);

create policy "trips: organizer can update"
  on trips for update using (is_trip_organizer(id));

create policy "trips: organizer can delete"
  on trips for delete using (is_trip_organizer(id));


-- trip_members ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "trip_members: members can read"
  on trip_members for select using (is_trip_member(trip_id));

create policy "trip_members: join via invite (own row)"
  on trip_members for insert with check (user_id = auth.uid());

create policy "trip_members: organizer can manage"
  on trip_members for delete using (is_trip_organizer(trip_id));


-- polls ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "polls: members can read"
  on polls for select using (is_trip_member(trip_id));

create policy "polls: members can create"
  on polls for insert with check (is_trip_member(trip_id) and auth.uid() = created_by);

create policy "polls: creator can close"
  on polls for update using (created_by = auth.uid());


-- poll_options ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "poll_options: members can read"
  on poll_options for select
  using (is_trip_member((select trip_id from polls where id = poll_id)));

create policy "poll_options: poll creator can manage"
  on poll_options for insert
  with check (
    auth.uid() = (select created_by from polls where id = poll_id)
  );


-- poll_votes ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "poll_votes: members can read"
  on poll_votes for select
  using (is_trip_member((select trip_id from polls where id = poll_id)));

create policy "poll_votes: user can vote"
  on poll_votes for insert
  with check (
    user_id = auth.uid()
    and is_trip_member((select trip_id from polls where id = poll_id))
    and not (select closed from polls where id = poll_id)
  );

create policy "poll_votes: user can change vote"
  on poll_votes for delete using (user_id = auth.uid());


-- checklist_items –––––––––––––––––––––––––––––––––––––––––––––––––––––––––
create policy "checklist: members can read"
  on checklist_items for select using (is_trip_member(trip_id));

create policy "checklist: members can create"
  on checklist_items for insert
  with check (is_trip_member(trip_id) and auth.uid() = created_by);

create policy "checklist: members can update"
  on checklist_items for update using (is_trip_member(trip_id));

create policy "checklist: creator can delete"
  on checklist_items for delete using (created_by = auth.uid());
