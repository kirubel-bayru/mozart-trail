import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  loadSession,
  saveSession,
  clearSession,
  fetchMe,
  type AuthUser,
  type AuthSession,
} from '../lib/authApi'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  setAuth: (session: AuthSession) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const saved = loadSession()
      if (saved?.token) {
        try {
          const freshUser = await fetchMe(saved.token)
          if (cancelled) return
          saveSession({ token: saved.token, user: freshUser })
          setUser(freshUser)
        } catch {
          if (!cancelled) clearSession()
        }
      }

      if (!cancelled) setLoading(false)
    }

    init()
    return () => { cancelled = true }
  }, [])

  const setAuth = useCallback(async (session: AuthSession) => {
    saveSession(session)
    setUser(session.user)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
