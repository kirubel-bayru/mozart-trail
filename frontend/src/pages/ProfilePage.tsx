import { useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { localLogin, localRegister } from '../lib/authApi'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { TOTAL_LOCATIONS } from '../data/locations'
import { C, F } from '../theme'

type Tab = 'login' | 'register'

function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontFamily: F.body,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: C.textMuted,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '13px 14px',
          fontFamily: F.body,
          fontSize: 14,
          border: `1.5px solid ${C.neutralDark}`,
          borderRadius: 12,
          background: 'white',
          color: C.textDark,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function AuthForm() {
  const { setAuth, enterGuestMode } = useAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setEmail('')
    setDisplayName('')
    setPassword('')
    setError(null)
  }

  const handleSubmit = () => {
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    if (tab === 'register' && !displayName.trim()) {
      setError('Please enter your name')
      return
    }
    setLoading(true)
    try {
      const user =
        tab === 'register'
          ? localRegister(email.trim(), displayName.trim(), password)
          : localLogin(email.trim(), password)
      setAuth(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 14px',
            boxShadow: '0 6px 20px rgba(139,0,0,0.2)',
          }}
        >
          🎼
        </div>
        <h2
          style={{
            margin: '0 0 6px',
            fontFamily: F.headline,
            fontSize: 24,
            fontWeight: 700,
            color: C.textDark,
          }}
        >
          Save Your Progress
        </h2>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, lineHeight: 1.6, color: C.textMuted }}>
          Create a local account to keep your name and progress, or continue as a guest.
        </p>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          background: 'white',
          borderRadius: 12,
          border: `1px solid ${C.neutralDark}`,
        }}
      >
        {(['login', 'register'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); reset() }}
            style={{
              flex: 1,
              padding: '9px 0',
              border: 'none',
              borderRadius: 9,
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: tab === t ? C.primary : 'transparent',
              color: tab === t ? 'white' : C.textMuted,
              transition: 'background 0.15s ease',
            }}
          >
            {t === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onKeyDown={handleKeyDown}>
        {tab === 'register' && (
          <Input
            label="Your Name"
            type="text"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Wolfgang A. Mozart"
          />
        )}
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'}
        />
      </div>

      {error && (
        <p
          style={{
            margin: 0,
            padding: '10px 14px',
            background: 'rgba(139,0,0,0.08)',
            border: `1px solid rgba(139,0,0,0.2)`,
            borderRadius: 10,
            fontFamily: F.body,
            fontSize: 13,
            color: C.primary,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px 0',
          background: C.primary,
          border: 'none',
          borderRadius: 14,
          fontFamily: F.body,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(139,0,0,0.28)',
        }}
      >
        {tab === 'login' ? 'Log In' : 'Create Account'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
        <span style={{ fontFamily: F.body, fontSize: 11, color: C.textMuted }}>or</span>
        <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
      </div>

      <button
        type="button"
        onClick={enterGuestMode}
        style={{
          width: '100%',
          padding: '13px 0',
          background: 'transparent',
          border: `2px solid ${C.neutralDark}`,
          borderRadius: 14,
          fontFamily: F.body,
          fontSize: 13,
          fontWeight: 600,
          color: C.textMuted,
          cursor: 'pointer',
        }}
      >
        Continue as Guest
      </button>

      <p style={{ margin: 0, textAlign: 'center', fontFamily: F.body, fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
        Your account and progress are saved on this device only.
      </p>
    </div>
  )
}

function UserProfile() {
  const { user, logout } = useAuth()

  const quizResults = getAllQuizResults()
  const visitedCount = quizResults.length
  const quizPoints = getTotalPointsEarned()
  const musicPoints = getTotalMusicPoints()
  const totalPoints = quizPoints + musicPoints
  const ciphersSolved = getMusicCipherSolvedCount()
  const pct = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)

  const initial = (user?.displayName ?? '?')[0].toUpperCase()
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 800,
            fontFamily: F.body,
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(139,0,0,0.25)',
          }}
        >
          {initial}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: F.headline, fontSize: 20, fontWeight: 700, color: C.textDark }}>
            {user?.displayName}
          </p>
          <p style={{ margin: '3px 0 0', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            {user?.email}
          </p>
          {joinedDate && (
            <p style={{ margin: '2px 0 0', fontFamily: F.body, fontSize: 11, color: C.tertiaryLight }}>
              Joined {joinedDate}
            </p>
          )}
        </div>
      </div>

      {/* Progress summary */}
      <div
        style={{
          background: '#FEFAF2',
          borderRadius: 16,
          border: `1px solid ${C.neutralDark}`,
          padding: '16px 18px',
          boxShadow: '0 2px 10px rgba(93,64,55,0.08)',
        }}
      >
        <p
          style={{
            margin: '0 0 10px',
            fontFamily: F.body,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.secondaryDark,
          }}
        >
          Trail Progress
        </p>

        <div style={{ display: 'flex', marginBottom: 14 }}>
          {[
            { val: `${visitedCount}/${TOTAL_LOCATIONS}`, label: 'Stops' },
            { val: totalPoints, label: 'Points' },
            { val: ciphersSolved, label: 'Ciphers' },
          ].map(({ val, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${C.neutralDark}` : 'none',
                paddingRight: i < 2 ? 8 : 0,
                paddingLeft: i > 0 ? 8 : 0,
              }}
            >
              <p style={{ margin: 0, fontFamily: F.headline, fontSize: 22, fontWeight: 700, color: C.primary, lineHeight: 1 }}>
                {val}
              </p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <div style={{ height: 5, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <p style={{ margin: '6px 0 0', fontFamily: F.body, fontSize: 11, color: C.textMuted, textAlign: 'right' }}>
          {pct}% complete
        </p>
      </div>

      {/* Points breakdown */}
      <div
        style={{
          background: 'white',
          borderRadius: 14,
          border: `1px solid ${C.neutralDark}`,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondaryDark }}>
          Points Breakdown
        </p>
        {[
          { label: 'Quiz points', value: quizPoints },
          { label: 'Music listen', value: musicPoints - ciphersSolved * 15 },
          { label: 'Cipher bonuses', value: ciphersSolved * 15 },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.body, fontSize: 13, color: C.textMuted }}>{label}</span>
            <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.textDark }}>{value} pts</span>
          </div>
        ))}
        <div style={{ height: 1, background: C.neutralDark }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.textDark }}>Total</span>
          <span style={{ fontFamily: F.headline, fontSize: 18, fontWeight: 700, color: C.primary }}>{totalPoints} pts</span>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        style={{
          width: '100%',
          padding: '13px 0',
          background: 'transparent',
          border: `2px solid ${C.neutralDark}`,
          borderRadius: 14,
          fontFamily: F.body,
          fontSize: 13,
          fontWeight: 600,
          color: C.textMuted,
          cursor: 'pointer',
        }}
      >
        Log Out
      </button>
    </div>
  )
}

function GuestProfile() {
  const { logout } = useAuth()

  const visitedCount = getAllQuizResults().length
  const totalPoints = getTotalPointsEarned() + getTotalMusicPoints()
  const ciphersSolved = getMusicCipherSolvedCount()
  const pct = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: C.neutralDark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          👤
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: F.headline, fontSize: 20, fontWeight: 700, color: C.textDark }}>
            Browsing as Guest
          </p>
          <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            Progress saved on this device only
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#FEFAF2',
          borderRadius: 16,
          border: `1px solid ${C.neutralDark}`,
          padding: '16px 18px',
        }}
      >
        <div style={{ display: 'flex', marginBottom: 14 }}>
          {[
            { val: `${visitedCount}/${TOTAL_LOCATIONS}`, label: 'Stops' },
            { val: totalPoints, label: 'Points' },
            { val: ciphersSolved, label: 'Ciphers' },
          ].map(({ val, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${C.neutralDark}` : 'none',
                paddingRight: i < 2 ? 8 : 0,
                paddingLeft: i > 0 ? 8 : 0,
              }}
            >
              <p style={{ margin: 0, fontFamily: F.headline, fontSize: 22, fontWeight: 700, color: C.primary, lineHeight: 1 }}>{val}</p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 5, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, borderRadius: 4 }} />
        </div>
      </div>

      <div
        style={{
          padding: '16px 18px',
          background: 'rgba(212,175,55,0.08)',
          borderRadius: 14,
          border: `1px solid rgba(212,175,55,0.25)`,
        }}
      >
        <p style={{ margin: '0 0 6px', fontFamily: F.body, fontSize: 12, fontWeight: 700, color: C.secondaryDark }}>
          Want to save your name?
        </p>
        <p style={{ margin: '0 0 12px', fontFamily: F.body, fontSize: 13, lineHeight: 1.55, color: C.textMuted }}>
          Create a local account to personalise your profile. Your progress is already saved here.
        </p>
        <button
          type="button"
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px 0',
            background: C.primary,
            border: 'none',
            borderRadius: 12,
            fontFamily: F.body,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139,0,0,0.25)',
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user, isGuest, loading } = useAuth()

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral, overflow: 'hidden' }}>
      <AppHeader />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 28px' }}>
        <p
          style={{
            margin: '0 0 6px',
            fontFamily: F.body,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.secondary,
          }}
        >
          Account
        </p>
        <h2
          style={{
            margin: '0 0 22px',
            fontFamily: F.headline,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.15,
            color: C.textDark,
          }}
        >
          Profile
        </h2>

        {loading ? (
          <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMuted }}>Loading…</p>
        ) : user ? (
          <UserProfile />
        ) : isGuest ? (
          <GuestProfile />
        ) : (
          <AuthForm />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
