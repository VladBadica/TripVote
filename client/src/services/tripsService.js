import { supabase } from './supabaseClient'

export function subscribeToTrip(tripId, callback) {
  return supabase
    .channel(`trip:${tripId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'activities', filter: `trip_id=eq.${tripId}` },
      (payload) => callback(payload)
    )
    .subscribe()
}

export function unsubscribeFromTrip(channel) {
  supabase.removeChannel(channel)
}
