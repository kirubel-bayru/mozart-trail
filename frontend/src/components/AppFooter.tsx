import { Link } from 'react-router-dom'
import { C, F } from '../theme'

const FOOTER_MAX_WIDTH = 1200

const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/hunt', label: 'The Hunt' },
  { to: '/treasures', label: 'Treasures' },
  { to: '/journey', label: 'My Journey' },
] as const

function FooterNoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
  )
}

export function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div
        className="app-footer-inner"
        style={{ maxWidth: FOOTER_MAX_WIDTH }}
      >
        <div className="app-footer-brand">
          <Link to="/" className="app-footer-logo">
            <span className="app-footer-logo-icon">
              <FooterNoteIcon />
            </span>
            <span style={{ fontFamily: F.headline, fontSize: 17, fontWeight: 700, color: 'white' }}>
              Mozart's Trail
            </span>
          </Link>
          <p className="app-footer-tagline">
            An interactive journey through Mozart's Salzburg — explore, learn, and collect treasures along the way.
          </p>
        </div>

        <nav className="app-footer-nav" aria-label="Footer">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="app-footer-link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="app-footer-meta">
          <p className="app-footer-location">Salzburg, Austria</p>
          <p className="app-footer-copy">
            © {year} Mozart's Trail · Educational project
          </p>
        </div>
      </div>
    </footer>
  )
}
