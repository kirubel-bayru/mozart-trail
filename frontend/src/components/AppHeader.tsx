import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { C, F } from '../theme'

interface AppHeaderProps {
  showBack?: boolean
}

const HEADER_MAX_WIDTH = 1200

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MozartTrailLogo() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'linear-gradient(145deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 100%)',
        border: `1.5px solid rgba(212,175,55,0.55)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <ellipse cx="7.5" cy="18" rx="3" ry="2.4" fill={C.secondary} />
        <rect x="10" y="5" width="2.2" height="13" rx="0.5" fill={C.secondary} />
        <path
          d="M12.2 5c0 0 8 1.4 8 5.8s-8 4.4-8 4.4"
          stroke={C.secondary}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

const NAV_LINKS = [
  { to: '/hunt',      label: 'The Hunt'   },
  { to: '/treasures', label: 'Treasures'  },
  { to: '/journey',   label: 'My Journey' },
]

function isHuntRoute(pathname: string) {
  return pathname === '/hunt' || pathname.startsWith('/location') || pathname.startsWith('/quiz')
}

export function AppHeader({ showBack = false }: AppHeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (to: string) => {
    if (to === '/hunt') return isHuntRoute(pathname)
    return pathname.startsWith(to)
  }

  const profileActive = pathname.startsWith('/profile')

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogin = () => {
    setMenuOpen(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header style={{
      background: `linear-gradient(180deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
      flexShrink: 0,
      zIndex: 100,
      boxShadow: '0 2px 16px rgba(44,24,16,0.18)',
      borderBottom: `1px solid rgba(212,175,55,0.2)`,
    }}>
      <div
        className="header-inner"
        style={{
          maxWidth: HEADER_MAX_WIDTH,
          margin: '0 auto',
          width: '100%',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 32px)',
          gap: 16,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="header-back-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: 8,
                cursor: 'pointer',
                display: 'flex',
                flexShrink: 0,
              }}
            >
              <BackIcon />
            </button>
          )}
          <Link
            to="/"
            className="header-brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            <MozartTrailLogo />
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                margin: 0,
                fontSize: 'clamp(17px, 2.5vw, 20px)',
                fontWeight: 700,
                color: 'white',
                fontFamily: F.headline,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}>
                Mozart's Trail
              </h1>
              <span
                style={{
                  display: 'block',
                  fontFamily: F.body,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.75)',
                  marginTop: 2,
                }}
              >
                Salzburg
              </span>
            </div>
          </Link>
        </div>

        {user && (
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
        )}

        <div className="header-profile-wrap" ref={menuRef}>
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="header-profile-btn"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: profileActive || menuOpen ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${profileActive || menuOpen ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.12)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            <PersonIcon />
          </button>

          {menuOpen && (
            <div className="header-profile-menu" role="menu">
              {user ? (
                <>
                  <Link to="/profile" className="header-profile-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button type="button" className="header-profile-menu-item header-profile-menu-item--danger" role="menuitem" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <button type="button" className="header-profile-menu-item" role="menuitem" onClick={handleLogin}>
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
