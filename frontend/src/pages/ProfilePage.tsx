import { useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { localLogin, localRegister } from '../lib/authApi'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { TOTAL_LOCATIONS } from '../data/locations'
import { C, F } from '../theme'
import heroBg from '../assets/salzburg-bg.png'

type Tab = 'login' | 'register'

// ── Glass input — white text on transparent bg ────────────────────────────────
function GlassInput({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: F.body, fontSize: 10, fontWeight: 800,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.65)',
      }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '13px 16px', fontFamily: F.body, fontSize: 14,
          border: '1.5px solid rgba(255,255,255,0.22)',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.10)',
          color: 'white',
          outline: 'none',
          width: '100%', boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.75)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
        }}
      />
    </div>
  )
}

// ── Auth full-page screen ─────────────────────────────────────────────────────
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
        {/* Full-screen background image */}
        <div className="auth-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        {/* Dark overlay */}
        <div className="auth-overlay" />

        {/* Content — centered vertically & horizontally */}
        <div className="auth-layout">

        {/* Brand */}
        <div className="auth-brand">
          <p style={{
            margin: '0 0 8px', fontFamily: F.body, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: C.secondary,
          }}>
            Mozart's Trail
          </p>
          <h1 style={{
            margin: 0, fontFamily: F.headline,
            fontSize: 'clamp(30px, 7vw, 56px)',
            fontWeight: 700, color: 'white', lineHeight: 1.05,
          }}>
            DISCOVER SALZBURG
          </h1>
        </div>

        {/* Glass card — centered */}
        <div className="auth-card-wrap">
          <div className="auth-card">

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 0, marginBottom: 24,
              borderBottom: '1.5px solid rgba(255,255,255,0.18)',
            }}>
              {(['login', 'register'] as Tab[]).map((t) => (
                <button key={t} type="button" onClick={() => { setTab(t); reset() }}
                  style={{
                    flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                    fontFamily: F.body, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    color: tab === t ? 'white' : 'rgba(255,255,255,0.42)',
                    borderBottom: `2px solid ${tab === t ? C.secondary : 'transparent'}`,
                    marginBottom: -1.5, transition: 'color 0.15s, border-color 0.15s',
                  }}>
                  {t === 'login' ? 'Log In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
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

            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                background: 'rgba(200,30,30,0.25)',
                border: '1px solid rgba(255,100,100,0.3)',
                borderRadius: 10, fontFamily: F.body, fontSize: 13,
                color: '#ffaaaa',
              }}>
                {error}
              </div>
            )}

            {/* Primary button */}
            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '15px 0',
                background: loading
                  ? 'rgba(255,255,255,0.15)'
                  : `linear-gradient(135deg, ${C.primary} 0%, #B22222 100%)`,
                border: 'none', borderRadius: 14,
                fontFamily: F.body, fontSize: 14, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: loading ? 'rgba(255,255,255,0.5)' : 'white',
                cursor: loading ? 'default' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(139,0,0,0.5)',
                marginBottom: 18,
                transition: 'opacity 0.15s',
              }}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontFamily: F.body, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Guest */}
            <button type="button" onClick={enterGuestMode}
              style={{
                width: '100%', padding: '13px 0',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.22)',
                borderRadius: 14,
                fontFamily: F.body, fontSize: 13, fontWeight: 600,
                color: 'rgba(255,255,255,0.72)', cursor: 'pointer', marginBottom: 20,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}>
              Continue as Guest
            </button>

            {/* Switch link */}
            <p style={{
              margin: 0, textAlign: 'center',
              fontFamily: F.body, fontSize: 13, color: 'rgba(255,255,255,0.5)',
            }}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button"
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); reset() }}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.secondary,
                  textDecoration: 'underline',
                }}>
                {tab === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>

          </div>
        </div>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}

// ── Logged-in profile ─────────────────────────────────────────────────────────
function UserProfile() {
  const { user, logout } = useAuth()
  const visitedCount = getAllQuizResults().length
  const quizPoints   = getTotalPointsEarned()
  const musicPoints  = getTotalMusicPoints()
  const totalPoints  = quizPoints + musicPoints
  const ciphers      = getMusicCipherSolvedCount()
  const pct          = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)
  const initial      = (user?.displayName ?? '?')[0].toUpperCase()
  const joined       = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, fontFamily: F.body, color: 'white',
          boxShadow: '0 4px 14px rgba(139,0,0,0.25)',
        }}>{initial}</div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: F.headline, fontSize: 20, fontWeight: 700, color: C.textDark }}>
            {user?.displayName}
          </p>
          <p style={{ margin: '3px 0 0', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>{user?.email}</p>
          {joined && <p style={{ margin: '2px 0 0', fontFamily: F.body, fontSize: 11, color: C.tertiaryLight }}>Joined {joined}</p>}
        </div>
      </div>

      <div style={{ background: '#FEFAF2', borderRadius: 16, border: `1px solid ${C.neutralDark}`,
        padding: '16px 18px', boxShadow: '0 2px 10px rgba(93,64,55,0.08)' }}>
        <p style={{ margin: '0 0 12px', fontFamily: F.body, fontSize: 10, fontWeight: 800,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: C.secondaryDark }}>Trail Progress</p>
        <div style={{ display: 'flex', marginBottom: 14 }}>
          {[{val:`${visitedCount}/${TOTAL_LOCATIONS}`,label:'Stops'},{val:totalPoints,label:'Points'},{val:ciphers,label:'Ciphers'}]
            .map(({val,label},i) => (
            <div key={label} style={{ flex:1, textAlign:'center',
              borderRight: i<2 ? `1px solid ${C.neutralDark}` : 'none',
              paddingRight: i<2 ? 8 : 0, paddingLeft: i>0 ? 8 : 0 }}>
              <p style={{ margin:0, fontFamily:F.headline, fontSize:22, fontWeight:700, color:C.primary, lineHeight:1 }}>{val}</p>
              <p style={{ margin:'4px 0 0', fontFamily:F.body, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ height:5, background:C.neutralDark, borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${C.primary},${C.secondary})`, borderRadius:4, transition:'width 0.4s ease' }} />
        </div>
        <p style={{ margin:'6px 0 0', fontFamily:F.body, fontSize:11, color:C.textMuted, textAlign:'right' }}>{pct}% complete</p>
      </div>

      <div style={{ background:'white', borderRadius:14, border:`1px solid ${C.neutralDark}`,
        padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        <p style={{ margin:0, fontFamily:F.body, fontSize:10, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:C.secondaryDark }}>Points Breakdown</p>
        {[{label:'Quiz points',value:quizPoints},{label:'Music listen',value:musicPoints-ciphers*15},{label:'Cipher bonuses',value:ciphers*15}]
          .map(({label,value}) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:F.body, fontSize:13, color:C.textMuted }}>{label}</span>
            <span style={{ fontFamily:F.body, fontSize:14, fontWeight:700, color:C.textDark }}>{value} pts</span>
          </div>
        ))}
        <div style={{ height:1, background:C.neutralDark }} />
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontFamily:F.body, fontSize:13, fontWeight:700, color:C.textDark }}>Total</span>
          <span style={{ fontFamily:F.headline, fontSize:18, fontWeight:700, color:C.primary }}>{totalPoints} pts</span>
        </div>
      </div>

      <button type="button" onClick={logout} style={{
        width:'100%', padding:'13px 0', background:'transparent',
        border:`2px solid ${C.neutralDark}`, borderRadius:14,
        fontFamily:F.body, fontSize:13, fontWeight:600, color:C.textMuted, cursor:'pointer',
      }}>Log Out</button>
    </div>
  )
}

// ── Guest profile ─────────────────────────────────────────────────────────────
function GuestProfile() {
  const { logout } = useAuth()
  const visitedCount = getAllQuizResults().length
  const totalPoints  = getTotalPointsEarned() + getTotalMusicPoints()
  const ciphers      = getMusicCipherSolvedCount()
  const pct          = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:C.neutralDark,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>👤</div>
        <div>
          <p style={{ margin:0, fontFamily:F.headline, fontSize:20, fontWeight:700, color:C.textDark }}>Browsing as Guest</p>
          <p style={{ margin:'4px 0 0', fontFamily:F.body, fontSize:12, color:C.textMuted }}>Progress saved on this device</p>
        </div>
      </div>

      <div style={{ background:'#FEFAF2', borderRadius:16, border:`1px solid ${C.neutralDark}`, padding:'16px 18px' }}>
        <div style={{ display:'flex', marginBottom:14 }}>
          {[{val:`${visitedCount}/${TOTAL_LOCATIONS}`,label:'Stops'},{val:totalPoints,label:'Points'},{val:ciphers,label:'Ciphers'}]
            .map(({val,label},i) => (
            <div key={label} style={{ flex:1, textAlign:'center',
              borderRight: i<2 ? `1px solid ${C.neutralDark}` : 'none',
              paddingRight: i<2 ? 8 : 0, paddingLeft: i>0 ? 8 : 0 }}>
              <p style={{ margin:0, fontFamily:F.headline, fontSize:22, fontWeight:700, color:C.primary, lineHeight:1 }}>{val}</p>
              <p style={{ margin:'4px 0 0', fontFamily:F.body, fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ height:5, background:C.neutralDark, borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${C.primary},${C.secondary})`, borderRadius:4 }} />
        </div>
      </div>

      <div style={{ padding:'16px 18px', background:'rgba(212,175,55,0.08)', borderRadius:14, border:`1px solid rgba(212,175,55,0.25)` }}>
        <p style={{ margin:'0 0 6px', fontFamily:F.body, fontSize:12, fontWeight:700, color:C.secondaryDark }}>Want to save your name?</p>
        <p style={{ margin:'0 0 12px', fontFamily:F.body, fontSize:13, lineHeight:1.55, color:C.textMuted }}>
          Create a local account to personalise your profile. Your progress is already saved here.
        </p>
        <button type="button" onClick={logout} style={{
          width:'100%', padding:'12px 0', background:C.primary, border:'none', borderRadius:12,
          fontFamily:F.body, fontSize:12, fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase',
          color:'white', cursor:'pointer', boxShadow:'0 4px 14px rgba(139,0,0,0.25)',
        }}>Create Account</button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, isGuest, loading } = useAuth()

  if (!loading && !user && !isGuest) return <AuthPage />

  return (
    <div className="profile-page">
      <AppHeader />
      <div className="profile-content">
        <p style={{ margin:'0 0 6px', fontFamily:F.body, fontSize:10, fontWeight:800,
          letterSpacing:'0.2em', textTransform:'uppercase', color:C.secondary }}>Account</p>
        <h2 style={{ margin:'0 0 22px', fontFamily:F.headline, fontSize:28, fontWeight:700, lineHeight:1.15, color:C.textDark }}>Profile</h2>
        {loading ? (
          <p style={{ fontFamily:F.body, fontSize:14, color:C.textMuted }}>Loading…</p>
        ) : user ? <UserProfile /> : <GuestProfile />}
      </div>
      <AppFooter />
      <BottomNav />
    </div>
  )
}
