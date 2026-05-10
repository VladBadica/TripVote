import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — using mock mode')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ── Auth helpers ──────────────────────────────────────────────────────────────

export const signUp = (email, password, fullName) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ── Realtime example ──────────────────────────────────────────────────────────

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
