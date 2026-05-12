import { supabase } from './supabaseClient'

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_emoji')
    .eq('id', user.id)
    .single()

  return { data, error }
}

export async function updateProfile({ fullName, avatarEmoji }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, full_name: fullName, avatar_emoji: avatarEmoji })

  if (profileError) return { data: null, error: profileError }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName, avatar_emoji: avatarEmoji },
  })

  return { data: true, error: authError ?? null }
}

export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { data: error ? null : true, error }
}
