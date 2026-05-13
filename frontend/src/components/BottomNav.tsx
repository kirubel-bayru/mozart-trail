import { Link, useLocation } from 'react-router-dom'
import { C, F } from '../theme'

function MapIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 4v13M15 7v13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function TrophyIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M7 4H4v4a5 5 0 005 5h6a5 5 0 005-5V4h-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 4h10v5a5 5 0 01-10 0V4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function JourneyIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M3 9h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 21V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="15.5" cy="14.5" r="1.5" fill={color}/>
    </svg>
  )
}

const TABS = [
  { to: '/',          label: 'The Hunt',   Icon: MapIcon },
  { to: '/treasures', label: 'Treasures',  Icon: TrophyIcon },
  { to: '/journey',   label: 'My Journey', Icon: JourneyIcon },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      background: C.neutral,
      height: 76,
      flexShrink: 0,
      borderTop: `1px solid ${C.neutralDark}`,
      boxShadow: '0 -2px 14px rgba(93,64,55,0.1)',
    }}>
      {TABS.map(({ to, label, Icon }) => {
        const active = isActive(to)
        return (
          <Link key={to} to={to} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            textDecoration: 'none',
            paddingBottom: 4,
          }}>
            <div style={{
              background: active ? C.primary : 'transparent',
              borderRadius: 22,
              padding: active ? '7px 20px' : '7px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease, padding 0.2s ease',
            }}>
              <Icon color={active ? C.white : C.tertiaryLight} />
            </div>
            <span style={{
              fontFamily: F.body,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: active ? C.primary : C.tertiaryLight,
            }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
