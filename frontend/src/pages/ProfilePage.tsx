import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { localLogin, localRegister } from '../lib/authApi'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { LOCATIONS, TOTAL_LOCATIONS } from '../data/locations'
import heroBg from '../assets/salzburg-bg.png'

type Tab = 'login' | 'register'

function GlassInput({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="auth-field">
      <label className="auth-field-label">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="auth-field-input"
      />
    </div>
  )
}

function AuthPage() {
  const { setAuth, enterGuestMode } = useAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => { setEmail(''); setDisplayName(''); setPassword(''); setError(null) }

  const handleSubmit = () => {
    setError(null)
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields'); return }
    if (tab === 'register' && !displayName.trim()) { setError('Please enter your name'); return }
    setLoading(true)
    try {
      const user = tab === 'register'
        ? localRegister(email.trim(), displayName.trim(), password)
        : localLogin(email.trim(), password)
      setAuth(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-auth-page">
      <div className="auth-page">
        <div className="auth-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="auth-overlay" />

        <div className="auth-layout">
          <div className="auth-brand">
            <p className="auth-brand-eyebrow">Mozart's Trail</p>
            <h1 className="auth-brand-title">Discover Salzburg</h1>
            <p className="auth-brand-sub">Sign in to personalise your trail, or continue as a guest.</p>
          </div>

          <div className="auth-card-wrap">
            <div className="auth-card">
              <div className="auth-tabs">
                {(['login', 'register'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`auth-tab${tab === t ? ' auth-tab--active' : ''}`}
                    onClick={() => { setTab(t); reset() }}
                  >
                    {t === 'login' ? 'Log In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <div className="auth-fields">
                {tab === 'register' && (
                  <GlassInput label="Your Name" type="text" value={displayName}
                    onChange={setDisplayName} placeholder="Wolfgang A. Mozart" />
                )}
                <GlassInput label="Email" type="email" value={email}
                  onChange={setEmail} placeholder="you@example.com" />
                <GlassInput label="Password" type="password" value={password}
                  onChange={setPassword}
                  placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'} />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="button"
                className="auth-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button type="button" className="auth-guest-btn" onClick={enterGuestMode}>
                Continue as Guest
              </button>

              <p className="auth-switch">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); reset() }}
                >
                  {tab === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-footer-wrap">
        <AppFooter />
      </div>
    </div>
  )
}

function useTrailStats() {
  const visitedIds = new Set(getAllQuizResults().map((r) => r.locationId))
  const visitedCount = visitedIds.size
  const quizPoints = getTotalPointsEarned()
  const musicPoints = getTotalMusicPoints()
  const ciphers = getMusicCipherSolvedCount()
  const totalPoints = quizPoints + musicPoints
  const pct = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)
  const nextStop = LOCATIONS.find((loc) => !visitedIds.has(loc.id)) ?? null

  return { visitedCount, quizPoints, musicPoints, ciphers, totalPoints, pct, nextStop }
}

function ProgressCard({ showBreakdown }: { showBreakdown?: boolean }) {
  const { visitedCount, quizPoints, musicPoints, ciphers, totalPoints, pct } = useTrailStats()
  const listenPoints = musicPoints - ciphers * 15

  return (
    <div className="profile-card profile-card--progress">
      <p className="profile-card-label">Trail Progress</p>
      <div className="profile-stats-row">
        <div className="profile-stat">
          <span className="profile-stat-value">{visitedCount}/{TOTAL_LOCATIONS}</span>
          <span className="profile-stat-label">Stops</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{totalPoints}</span>
          <span className="profile-stat-label">Points</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{visitedCount}</span>
          <span className="profile-stat-label">Treasures</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{ciphers}</span>
          <span className="profile-stat-label">Ciphers</span>
        </div>
      </div>
      <div className="profile-progress-bar">
        <div className="profile-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="profile-progress-pct">{pct}% of the trail complete</p>

      {showBreakdown && (
        <div className="profile-breakdown">
          <div className="profile-breakdown-row">
            <span>Quiz points</span>
            <span>{quizPoints} pts</span>
          </div>
          <div className="profile-breakdown-row">
            <span>Music listen</span>
            <span>{listenPoints} pts</span>
          </div>
          <div className="profile-breakdown-row">
            <span>Cipher bonuses</span>
            <span>{ciphers * 15} pts</span>
          </div>
          <div className="profile-breakdown-total">
            <span>Total</span>
            <span>{totalPoints} pts</span>
          </div>
        </div>
      )}
    </div>
  )
}

function QuickLinks() {
  const { nextStop } = useTrailStats()

  return (
    <div className="profile-card">
      <p className="profile-card-label">Quick Links</p>
      <div className="profile-links">
        <Link to="/hunt" className="profile-link">
          <span className="profile-link-icon">🗺</span>
          <span className="profile-link-text">
            <strong>Open Map</strong>
            <small>Explore Salzburg stops</small>
          </span>
        </Link>
        <Link to="/journey" className="profile-link">
          <span className="profile-link-icon">🎼</span>
          <span className="profile-link-text">
            <strong>My Journey</strong>
            <small>Timeline &amp; milestones</small>
          </span>
        </Link>
        <Link to="/treasures" className="profile-link">
          <span className="profile-link-icon">🏆</span>
          <span className="profile-link-text">
            <strong>Treasures</strong>
            <small>Collected rewards</small>
          </span>
        </Link>
      </div>
      {nextStop && (
        <Link to={`/location/${nextStop.id}`} className="profile-next-stop">
          <span className="profile-next-stop-label">Suggested next stop</span>
          <span className="profile-next-stop-name">{nextStop.name}</span>
        </Link>
      )}
    </div>
  )
}

function UserProfile() {
  const { user, logout } = useAuth()
  const initial = (user?.displayName ?? '?')[0].toUpperCase()
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="profile-body">
      <div className="profile-hero">
        <div className="profile-avatar profile-avatar--user">{initial}</div>
        <div className="profile-hero-text">
          <h2 className="profile-name">{user?.displayName}</h2>
          <p className="profile-email">{user?.email}</p>
          {joined && <p className="profile-meta">Trail member since {joined}</p>}
        </div>
      </div>

      <ProgressCard showBreakdown />
      <QuickLinks />

      <button type="button" className="profile-logout-btn" onClick={logout}>
        Log Out
      </button>
    </div>
  )
}

function GuestProfile() {
  const { logout } = useAuth()

  return (
    <div className="profile-body">
      <div className="profile-hero">
        <div className="profile-avatar profile-avatar--guest">👤</div>
        <div className="profile-hero-text">
          <h2 className="profile-name">Browsing as Guest</h2>
          <p className="profile-email">Progress is saved on this device</p>
        </div>
      </div>

      <ProgressCard />
      <QuickLinks />

      <div className="profile-upgrade">
        <p className="profile-upgrade-title">Save your name on the trail</p>
        <p className="profile-upgrade-text">
          Create a free local account to personalise your profile. Your quiz scores and treasures stay right here.
        </p>
        <button type="button" className="profile-upgrade-btn" onClick={logout}>
          Create Account
        </button>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user, isGuest, loading } = useAuth()

  if (!loading && !user && !isGuest) return <AuthPage />

  return (
    <div className="profile-page">
      <AppHeader />
      <div className="profile-scroll">
        <div className="profile-content">
          <header className="profile-header">
            <p className="profile-eyebrow">Account</p>
            <h1 className="profile-title">Your Profile</h1>
            <p className="profile-intro">
              Track your progress, revisit treasures, and pick up where you left off.
            </p>
          </header>

          {loading ? (
            <p className="profile-loading">Loading…</p>
          ) : user ? (
            <UserProfile />
          ) : (
            <GuestProfile />
          )}
        </div>

        <div className="profile-footer-wrap">
          <AppFooter />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
