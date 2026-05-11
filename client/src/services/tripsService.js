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
