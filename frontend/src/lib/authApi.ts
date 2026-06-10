/**
 * Local-only auth — all user data lives in localStorage.
 * No backend or database required.
 */

const USERS_KEY = 'mozart-users'
const SESSION_KEY = 'mozart-session'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  createdAt: string
}

interface StoredUser extends AuthUser {
  passwordHash: string
}

// Simple non-cryptographic hash (good enough for local storage demo)
function hashPassword(password: string): string {
  let h = 5381
  for (let i = 0; i < password.length; i++) {
    h = ((h << 5) + h) ^ password.charCodeAt(i)
  }
  return (h >>> 0).toString(16)
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function localRegister(
  email: string,
  displayName: string,
  password: string,
): AuthUser {
  const users = readUsers()
  const normalizedEmail = email.toLowerCase().trim()

  if (users.find((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const user: StoredUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    displayName: displayName.trim(),
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
  }
  writeUsers([...users, user])

  const { passwordHash: _, ...publicUser } = user
  return publicUser
}

export function localLogin(email: string, password: string): AuthUser {
  const users = readUsers()
  const user = users.find((u) => u.email === email.toLowerCase().trim())

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Invalid email or password')
  }

  const { passwordHash: _, ...publicUser } = user
  return publicUser
}

export function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
