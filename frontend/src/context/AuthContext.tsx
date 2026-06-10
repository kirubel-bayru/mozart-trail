import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loadSession, saveSession, clearSession, type AuthUser } from '../lib/authApi'

const GUEST_KEY = 'mozart-guest-mode'

interface AuthContextValue {
  user: AuthUser | null
  isGuest: boolean
  loading: boolean
  setAuth: (user: AuthUser) => void
  logout: () => void
  enterGuestMode: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadSession()
    if (saved) {
      setUser(saved)
    } else if (localStorage.getItem(GUEST_KEY) === 'true') {
      setIsGuest(true)
    }
    setLoading(false)
  }, [])

  const setAuth = useCallback((newUser: AuthUser) => {
    saveSession(newUser)
    localStorage.removeItem(GUEST_KEY)
    setUser(newUser)
    setIsGuest(false)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    localStorage.removeItem(GUEST_KEY)
    setUser(null)
    setIsGuest(false)
  }, [])

  const enterGuestMode = useCallback(() => {
    localStorage.setItem(GUEST_KEY, 'true')
    setIsGuest(true)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, setAuth, logout, enterGuestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
