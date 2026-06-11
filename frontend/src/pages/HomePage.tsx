import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { useAuth } from '../context/AuthContext'
import { LocationsShowcase } from '../components/LocationsShowcase'
import heroBg from '../assets/salzburg-bg.png'

function MapArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4v13M15 7v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function HomePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const handleExplore = () => {
    if (user) navigate('/hunt')
    else navigate('/profile')
  }

  const scrollToStops = (e: MouseEvent) => {
    e.preventDefault()
    document.getElementById('stops')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      <AppHeader overlay />

      <main className="home-main">
        <div className="home-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="home-overlay" />

        <div className="home-content">
          <h1 className="home-title">
            Walk where
            <br />
            <em>genius</em> began
          </h1>

          <p className="home-lead">
            An interactive treasure hunt through the streets, homes, and concert halls
            that shaped Wolfgang Amadeus Mozart.
          </p>

          <div className="home-cta-row">
            <button
              type="button"
              className="home-cta"
              onClick={handleExplore}
              disabled={loading}
            >
              <MapArrowIcon />
              {loading ? 'Loading…' : user ? 'Open the Map' : 'Log in to Explore'}
            </button>
          </div>
        </div>

        <a href="#stops" className="home-scroll-cue" onClick={scrollToStops} aria-label="Scroll to the stops">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </main>

      <LocationsShowcase />
    </div>
  )
}
