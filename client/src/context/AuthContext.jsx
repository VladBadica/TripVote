import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signIn, signUp, signOut } from '../services/supabaseClient'
import { mockUser } from '../mock/mockData'

const AuthContext = createContext(null)

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(USE_MOCK ? mockUser : null)
  const [loading, setLoading] = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    if (USE_MOCK) { setUser(mockUser); return { error: null } }
    const { error } = await signIn(email, password)
    return { error }
  }

  async function register(email, password, fullName) {
    if (USE_MOCK) { setUser({ ...mockUser, email, user_metadata: { full_name: fullName } }); return { error: null } }
    const { error } = await signUp(email, password, fullName)
    return { error }
  }

  async function logout() {
    if (USE_MOCK) { setUser(null); return }
    await signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
