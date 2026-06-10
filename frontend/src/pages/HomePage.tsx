import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { TOTAL_LOCATIONS } from '../data/locations'
import heroBg from '../assets/salzburg-bg.png'

const FEATURES = [
  {
    icon: '🗺',
    title: 'Explore the city',
    text: `${TOTAL_LOCATIONS} historic stops across Salzburg, from birthplace to final residence.`,
  },
  {
    icon: '🏆',
    title: 'Collect treasures',
    text: 'Read each story, solve quizzes, and unlock digital artifacts along the way.',
  },
  {
    icon: '🎵',
    title: 'Track your journey',
    text: 'See your progress, earn points, and follow the trail at your own pace.',
  },
] as const

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
  return (
    <div className="home-page">
      <AppHeader />

      <main className="home-main">
        <div className="home-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="home-overlay" />

        <div className="home-content">
          <p className="home-eyebrow">Mozart's Trail · Salzburg</p>

          <h1 className="home-title">
            Walk where
            <br />
            <em>genius</em> began
          </h1>

          <p className="home-lead">
            An interactive treasure hunt through the streets, homes, and concert halls
            that shaped Wolfgang Amadeus Mozart.
          </p>

          <Link to="/hunt" className="home-cta">
            <MapArrowIcon />
            Open the Map
          </Link>

          <div className="home-features">
            {FEATURES.map(({ icon, title, text }) => (
              <div key={title} className="home-feature">
                <span className="home-feature-icon" aria-hidden>{icon}</span>
                <div>
                  <p className="home-feature-title">{title}</p>
                  <p className="home-feature-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
