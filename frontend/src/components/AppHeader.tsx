import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { C, F } from '../theme'

interface AppHeaderProps {
  showBack?: boolean
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_LINKS = [
  { to: '/',          label: 'The Hunt'   },
  { to: '/treasures', label: 'Treasures'  },
  { to: '/journey',   label: 'My Journey' },
  { to: '/profile',   label: 'Profile'    },
]

export function AppHeader({ showBack = false }: AppHeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()

  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  const avatarInitial = user ? user.displayName[0].toUpperCase() : null

  return (
    <header style={{
      background: C.primary,
      flexShrink: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 12,
      }}>
        {/* Left — back or brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0', cursor: 'pointer', display: 'flex', flexShrink: 0 }}
            >
              <BackIcon />
            </button>
          )}
          <h1 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: 'white',
            fontFamily: F.headline,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            Mozart's Trail
          </h1>
        </div>

        {/* Center — desktop nav links */}
        <nav className="top-nav-links" style={{ alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.65)',
                  borderBottom: active ? `2px solid ${C.secondary}` : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right — avatar / profile link */}
        <Link
          to="/profile"
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          {avatarInitial ? (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: C.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 800,
                fontFamily: F.body,
                color: C.textDark,
              }}
            >
              {avatarInitial}
            </div>
          ) : (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: isGuest ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
