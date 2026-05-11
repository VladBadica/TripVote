import { supabase } from './supabaseClient'

// ---------- helpers ----------

function normalize(trip) {
  if (!trip) return null
  return {
    id: trip.id,
    name: trip.name,
    destination: trip.destination,
    coverEmoji: trip.cover_emoji,
    status: trip.status,
    startDate: trip.start_date,
    endDate: trip.end_date,
    inviteCode: trip.invite_code,
    memberCount: trip.member_count,
    createdBy: trip.created_by,
  }
}

function normalizeMembers(members) {
  return members.map((m) => ({
    id: m.user_id,
    name: m.profiles?.full_name ?? null,
    avatar: m.profiles?.avatar_emoji ?? '🧑',
    role: m.role,
    joinedAt: m.joined_at,
  }))
}

// ---------- trips ----------

export async function getMyTrips() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('trip_members')
    .select('trip_id, role, trips(*)')
    .eq('user_id', user.id)

  if (error) return { data: null, error }

  return {
    data: data.map((row) => ({ ...normalize(row.trips), userRole: row.role })),
    error: null,
  }
}

export async function getTripById(tripId) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  return { data: normalize(data), error }
}

export async function createTrip({ name, destination, coverEmoji, startDate, endDate, status = 'planning' }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      name,
      destination,
      cover_emoji: coverEmoji,
      start_date: startDate,
      end_date: endDate,
      status,
      created_by: user.id,
    })
    .select()
    .single()

  if (tripError) return { data: null, error: tripError }

  const { error: memberError } = await supabase
    .from('trip_members')
    .insert({ trip_id: trip.id, user_id: user.id, role: 'organizer' })

  if (memberError) return { data: null, error: memberError }

  return { data: normalize(trip), error: null }
}

export async function updateTrip(tripId, updates) {
  const dbUpdates = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.destination !== undefined) dbUpdates.destination = updates.destination
  if (updates.coverEmoji !== undefined) dbUpdates.cover_emoji = updates.coverEmoji
  if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate
  if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate
  if (updates.status !== undefined) dbUpdates.status = updates.status

  const { data, error } = await supabase
    .from('trips')
    .update(dbUpdates)
    .eq('id', tripId)
    .select()
    .single()

  return { data: normalize(data), error }
}

// ---------- members ----------

export async function getTripMembers(tripId) {
  const { data, error } = await supabase
    .from('trip_members')
    .select('user_id, role, joined_at, profiles(full_name, avatar_emoji)')
    .eq('trip_id', tripId)

  if (error) return { data: null, error }
  return { data: normalizeMembers(data), error: null }
}

export async function joinTripByInviteCode(inviteCode) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data: trip, error: findError } = await supabase
    .from('trips')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single()

  if (findError) return { data: null, error: findError }

  const { error: joinError } = await supabase
    .from('trip_members')
    .upsert({ trip_id: trip.id, user_id: user.id, role: 'member' }, { onConflict: 'trip_id,user_id' })

  if (joinError) return { data: null, error: joinError }

  return { data: normalize(trip), error: null }
}

// ---------- polls ----------

export async function getPollsByTrip(tripId) {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      id, trip_id, type, question, created_by, closed, created_at,
      poll_options(id, label, position,
        poll_votes(user_id)
      )
    `)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })

  if (error) return { data: null, error }

  const normalized = data.map((p) => ({
    id: p.id,
    tripId: p.trip_id,
    type: p.type,
    question: p.question,
    createdBy: p.created_by,
    createdAt: p.created_at,
    closed: p.closed,
    options: (p.poll_options ?? [])
      .sort((a, b) => a.position - b.position)
      .map((opt) => ({
        id: opt.id,
        label: opt.label,
        votes: (opt.poll_votes ?? []).map((v) => v.user_id),
      })),
  }))

  return { data: normalized, error: null }
}

export async function castVote(pollId, pollOptionId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  // Delete existing vote first to allow changing vote
  await supabase.from('poll_votes').delete().eq('poll_id', pollId).eq('user_id', user.id)

  const { data, error } = await supabase
    .from('poll_votes')
    .insert({ poll_id: pollId, poll_option_id: pollOptionId, user_id: user.id })
    .select('id')
    .single()

  return { data, error }
}

export async function createPoll(tripId, { question, type, options }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ trip_id: tripId, question, type, created_by: user.id })
    .select('id')
    .single()

  if (pollError) return { data: null, error: pollError }

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(options.map((label, i) => ({ poll_id: poll.id, label, position: i })))

  if (optionsError) return { data: null, error: optionsError }

  return { data: poll, error: null }
}

// ---------- checklist ----------

export async function addChecklistItem(tripId, text) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({ trip_id: tripId, text, created_by: user.id })
    .select('id')
    .single()

  return { data, error }
}

export async function toggleChecklistItem(itemId, done) {
  const { data, error } = await supabase
    .from('checklist_items')
    .update({ done })
    .eq('id', itemId)
    .select('id, done')
    .single()

  return { data, error }
}

export async function deleteChecklistItem(itemId) {
  const { error } = await supabase.from('checklist_items').delete().eq('id', itemId)
  return { data: error ? null : true, error }
}

export async function getChecklistByTrip(tripId) {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('id, trip_id, text, done, assignee_id, due_date, created_at')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })

  if (error) return { data: null, error }

  const normalized = data.map((item) => ({
    id: item.id,
    tripId: item.trip_id,
    text: item.text,
    done: item.done,
    assignee: item.assignee_id,
    dueDate: item.due_date,
  }))

  return { data: normalized, error: null }
}

// ---------- real-time ----------

export function subscribeToTrip(tripId, callback) {
  return supabase
    .channel(`trip:${tripId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` }, callback)
    .subscribe()
}

export function unsubscribeFromTrip(channel) {
  supabase.removeChannel(channel)
}
