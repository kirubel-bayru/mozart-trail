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

// ── Full-screen Salzburg night background ─────────────────────────────────────
function SalzburgIllustration() {
  const stars: [number, number, number][] = [
    [45,32,2],[98,52,1.5],[168,24,1.5],[228,64,1],[288,37,2],[158,92,1],
    [78,120,1],[358,17,1.5],[462,47,2],[50,74,1],[272,104,1.5],[418,27,1],
    [166,18,1],[244,84,1.5],[54,150,1],[320,130,1.5],[192,140,1],[406,154,1],
    [130,160,1],[352,77,1],[442,172,1.5],[202,167,1],[320,48,1],[480,95,1.5],
    [22,200,1],[488,220,1],[110,195,1.5],[390,195,1],[260,20,1.5],[440,60,1],
  ]
  return (
    <svg
      viewBox="0 0 500 680"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080102" />
          <stop offset="45%" stopColor="#420000" />
          <stop offset="100%" stopColor="#780000" />
        </linearGradient>
        <radialGradient id="sg-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sg-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A0A04" />
          <stop offset="100%" stopColor="#0E0202" />
        </linearGradient>
        <filter id="sg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="500" height="680" fill="url(#sg-sky)" />

      {/* Moon */}
      <circle cx="390" cy="95" r="78" fill="url(#sg-moon)" />
      <circle cx="390" cy="95" r="40" fill="#FFFDE7" filter="url(#sg-glow)" />
      <circle cx="390" cy="95" r="36" fill="#D4AF37" />
      <circle cx="378" cy="88" r="7"  fill="#C49B25" opacity="0.3" />
      <circle cx="396" cy="106" r="5" fill="#C49B25" opacity="0.22" />

      {/* Stars */}
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#D4AF37"
          opacity={0.4 + (i % 6) * 0.09}
          style={{ animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`, animationDelay: `${(i * 0.3) % 3}s` }}
        />
      ))}

      {/* Mountains far */}
      <path d="M-5 415 L75 300 L145 360 L215 278 L290 335 L368 258 L438 320 L505 272 L505 680 L-5 680Z"
        fill="#1A0404" opacity="0.7" />
      {/* Mountains near */}
      <path d="M-5 470 L52 390 L115 430 L180 365 L250 408 L322 350 L395 395 L458 350 L505 378 L505 680 L-5 680Z"
        fill="#280808" opacity="0.85" />
      {/* Ground */}
      <path d="M-5 522 Q130 502 255 510 Q378 518 505 498 L505 680 L-5 680Z" fill="url(#sg-ground)" />
      {/* River */}
      <path d="M35 558 Q165 540 305 554 Q390 562 475 544 L475 568 Q390 584 305 572 Q165 560 35 576Z"
        fill="#D4AF37" opacity="0.07" />

      {/* Fortress cliff */}
      <path d="M158 522 L168 455 L196 430 L238 422 L272 428 L294 446 L304 522Z" fill="#220707" />
      {/* Fortress body */}
      <rect x="172" y="404" width="118" height="58" fill="#300B05" />
      <rect x="168" y="396" width="126" height="12" fill="#3E1008" />
      {[168,181,194,207,220,233,246,259,272,284].map((x, i) => (
        <rect key={i} x={x} y={382} width={10} height={16} fill="#3E1008" />
      ))}
      {/* Left tower */}
      <rect x="164" y="356" width="32" height="52" fill="#2A0906" />
      <rect x="160" y="348" width="40" height="12" fill="#3E1008" />
      {[160,172,184].map((x,i) => <rect key={i} x={x} y={336} width={9} height={14} fill="#3E1008" />)}
      <polygon points="180,314 160,350 200,350" fill="#501408" />
      {/* Right tower */}
      <rect x="266" y="350" width="32" height="58" fill="#2A0906" />
      <rect x="262" y="342" width="40" height="12" fill="#3E1008" />
      {[262,274,286].map((x,i) => <rect key={i} x={x} y={330} width={9} height={14} fill="#3E1008" />)}
      <polygon points="282,308 262,344 302,344" fill="#501408" />
      {/* Fortress windows */}
      <rect x="210" y="418" width="13" height="18" rx="3" fill="#D4AF37" opacity="0.9" filter="url(#sg-glow)" />
      <rect x="235" y="418" width="13" height="18" rx="3" fill="#D4AF37" opacity="0.8" filter="url(#sg-glow)" />
      <rect x="170" y="370" width="9"  height="12" rx="2" fill="#D4AF37" opacity="0.6" />
      <rect x="280" y="364" width="9"  height="12" rx="2" fill="#D4AF37" opacity="0.6" />

      {/* Cathedral left dome */}
      <rect x="60" y="462" width="30" height="64" fill="#1E0606" />
      <ellipse cx="75" cy="464" rx="22" ry="28" fill="#2C0B07" />
      <rect x="69" y="436" width="12" height="30" fill="#1E0606" />
      <polygon points="75,416 67,438 83,438" fill="#3C1008" />
      <line x1="75" y1="412" x2="75" y2="422" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8" />
      <line x1="70" y1="415" x2="80" y2="415" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8" />
      <circle cx="75" cy="411" r="3" fill="#D4AF37" opacity="0.7" />
      {/* Cathedral right dome */}
      <rect x="102" y="468" width="30" height="58" fill="#1E0606" />
      <ellipse cx="117" cy="470" rx="22" ry="26" fill="#2C0B07" />
      <rect x="111" y="444" width="12" height="28" fill="#1E0606" />
      <polygon points="117,424 109,446 125,446" fill="#3C1008" />
      <line x1="117" y1="420" x2="117" y2="430" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8" />
      <line x1="112" y1="423" x2="122" y2="423" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8" />
      <circle cx="117" cy="419" r="3" fill="#D4AF37" opacity="0.7" />
      <rect x="58" y="510" width="92" height="50" fill="#1A0505" />

      {/* Town */}
      <rect x="18" y="498" width="38" height="72" fill="#180505" />
      <rect x="388" y="488" width="44" height="82" fill="#180505" />
      <rect x="340" y="498" width="46" height="72" fill="#220708" />
      <rect x="432" y="500" width="34" height="70" fill="#160404" />
      {[
        [24,506],[24,520],[36,506],[36,520],
        [394,498],[394,514],[408,498],[408,514],
        [347,508],[362,508],[347,522],[362,522],
        [65,520],[85,520],[105,520],
      ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width={7} height={9} rx={1.5} fill="#D4AF37" opacity={0.4 + (i%4)*0.06} />
      ))}

      {/* Musical notes */}
      <g fill="#D4AF37" opacity="0.22">
        <ellipse cx="446" cy="215" rx="7" ry="5.5" transform="rotate(-25 446 215)" />
        <rect x="452" y="193" width="2.5" height="24" />
        <ellipse cx="48" cy="292" rx="6" ry="4.5" transform="rotate(-25 48 292)" />
        <rect x="54" y="273" width="2" height="20" />
        <ellipse cx="418" cy="325" rx="6" ry="4.5" transform="rotate(-25 418 325)" />
        <rect x="423" y="305" width="2.2" height="21" />
        <ellipse cx="436" cy="319" rx="6" ry="4.5" transform="rotate(-25 436 319)" />
        <rect x="441" y="299" width="2.2" height="21" />
        <rect x="423" y="305" width="20" height="2.5" />
        <rect x="423" y="310" width="20" height="2.5" />
      </g>
    </svg>
  )
}

// ── Shared input ──────────────────────────────────────────────────────────────
function Input({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '13px 16px', fontFamily: F.body, fontSize: 14,
          border: `1.5px solid ${C.neutralDark}`, borderRadius: 12,
          background: 'white', color: C.textDark, outline: 'none',
          width: '100%', boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = C.primary }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = C.neutralDark }}
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
    <div className="auth-page">
      {/* Full-screen background */}
      <div className="auth-bg"><SalzburgIllustration /></div>
      {/* Dark overlay */}
      <div className="auth-overlay" />

      {/* Content */}
      <div className="auth-layout">

        {/* Brand — left side */}
        <div className="auth-brand">
          <p style={{ margin: '0 0 8px', fontFamily: F.body, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: C.secondary }}>
            Mozart's Trail
          </p>
          <h1 style={{ margin: '0 0 16px', fontFamily: F.headline, fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700, color: 'white', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            DISCOVER<br />SALZBURG
          </h1>
          <p style={{ margin: 0, fontFamily: F.body, fontSize: 15, lineHeight: 1.65,
            color: 'rgba(255,255,255,0.72)', maxWidth: 380 }}>
            Walk 12 historic Mozart locations. Collect digital treasures. Solve musical ciphers.
          </p>
        </div>

        {/* Glass card — right side */}
        <div className="auth-card-wrap">
          <div className="auth-card">

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24,
              borderBottom: `2px solid ${C.neutralDark}` }}>
              {(['login', 'register'] as Tab[]).map((t) => (
                <button key={t} type="button" onClick={() => { setTab(t); reset() }}
                  style={{
                    flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                    fontFamily: F.body, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    color: tab === t ? C.primary : C.textMuted,
                    borderBottom: `2px solid ${tab === t ? C.primary : 'transparent'}`,
                    marginBottom: -2, transition: 'color 0.15s, border-color 0.15s',
                  }}>
                  {t === 'login' ? 'Log In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {tab === 'register' && (
                <Input label="Your Name" type="text" value={displayName}
                  onChange={setDisplayName} placeholder="Wolfgang A. Mozart" />
              )}
              <Input label="Email" type="email" value={email}
                onChange={setEmail} placeholder="you@example.com" />
              <Input label="Password" type="password" value={password}
                onChange={setPassword}
                placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'} />
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '10px 14px',
                background: 'rgba(139,0,0,0.07)', border: `1px solid rgba(139,0,0,0.18)`,
                borderRadius: 10, fontFamily: F.body, fontSize: 13, color: C.primary }}>
                {error}
              </div>
            )}

            {/* Primary button */}
            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '15px 0',
                background: loading ? C.neutralDark : C.primary,
                border: 'none', borderRadius: 14,
                fontFamily: F.body, fontSize: 14, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: loading ? C.textMuted : 'white',
                cursor: loading ? 'default' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(139,0,0,0.38)',
                marginBottom: 18,
              }}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
              <span style={{ fontFamily: F.body, fontSize: 11, color: C.textMuted }}>or</span>
              <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
            </div>

            {/* Guest */}
            <button type="button" onClick={enterGuestMode}
              style={{
                width: '100%', padding: '13px 0', background: 'transparent',
                border: `1.5px solid ${C.neutralDark}`, borderRadius: 14,
                fontFamily: F.body, fontSize: 13, fontWeight: 600,
                color: C.textMuted, cursor: 'pointer', marginBottom: 20,
              }}>
              Continue as Guest
            </button>

            {/* Switch link */}
            <p style={{ margin: 0, textAlign: 'center', fontFamily: F.body, fontSize: 13, color: C.textMuted }}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button"
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); reset() }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.primary,
                  textDecoration: 'underline' }}>
                {tab === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>

          </div>
        </div>
      </div>
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
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', background:C.neutral, overflow:'hidden' }}>
      <AppHeader />
      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 28px' }}>
        <p style={{ margin:'0 0 6px', fontFamily:F.body, fontSize:10, fontWeight:800,
          letterSpacing:'0.2em', textTransform:'uppercase', color:C.secondary }}>Account</p>
        <h2 style={{ margin:'0 0 22px', fontFamily:F.headline, fontSize:28, fontWeight:700, lineHeight:1.15, color:C.textDark }}>Profile</h2>
        {loading ? (
          <p style={{ fontFamily:F.body, fontSize:14, color:C.textMuted }}>Loading…</p>
        ) : user ? <UserProfile /> : <GuestProfile />}
      </div>
      <BottomNav />
    </div>
  )
}
