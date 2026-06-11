import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LOCATIONS, TOTAL_LOCATIONS } from '../data/locations'

const VISUALS: Record<string, { gradient: string; icon: string }> = {
  birthplace:       { gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', icon: '🎼' },
  cathedral:        { gradient: 'linear-gradient(135deg, #8B0000 0%, #5A0000 100%)', icon: '⛪' },
  residence:        { gradient: 'linear-gradient(135deg, #5D4037 0%, #8B5E3C 100%)', icon: '🎻' },
  mirabell:         { gradient: 'linear-gradient(135deg, #6B7A3A 0%, #D4AF37 100%)', icon: '🌷' },
  residenz:         { gradient: 'linear-gradient(135deg, #4A0404 0%, #8B0000 100%)', icon: '🏛️' },
  'st-peter':       { gradient: 'linear-gradient(135deg, #3E2723 0%, #6D4C41 100%)', icon: '📿' },
  kollegienkirche:  { gradient: 'linear-gradient(135deg, #D4AF37 0%, #F5F5DC 100%)', icon: '🕊️' },
  mozarteum:        { gradient: 'linear-gradient(135deg, #8B0000 0%, #D4AF37 100%)', icon: '🎹' },
  'st-sebastian':   { gradient: 'linear-gradient(135deg, #5D4037 0%, #7A6A5A 100%)', icon: '🕯️' },
  fortress:         { gradient: 'linear-gradient(135deg, #2C1810 0%, #5D4037 100%)', icon: '🏰' },
  nonnberg:         { gradient: 'linear-gradient(135deg, #B8860B 0%, #E8E5C8 100%)', icon: '🔔' },
  hellbrunn:        { gradient: 'linear-gradient(135deg, #4F6B3A 0%, #D4AF37 100%)', icon: '⛲' },
}

// Hand-picked Wikimedia Commons photos for locations whose Wikipedia page
// has no lead image (so every card always shows a real photo).
const FALLBACK_IMAGES: Record<string, string> = {
  residence:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mozarts_Wohnhaus_Makartplatz_8.jpg/1280px-Mozarts_Wohnhaus_Makartplatz_8.jpg',
  kollegienkirche:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Kollegienkirche%2C_Salzburg_%281%29.jpg/1280px-Kollegienkirche%2C_Salzburg_%281%29.jpg',
  'st-sebastian':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Salzburg_-_Altstadt_-_Sebastianskirche_-_2023_01_04-6.jpg/1280px-Salzburg_-_Altstadt_-_Sebastianskirche_-_2023_01_04-6.jpg',
}

const pad = (n: number) => String(n).padStart(2, '0')

// Splits text into words, each animating in with a staggered delay.
function Words({ text, base = 0, step = 0.05 }: { text: string; base?: number; step?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="loc-word" style={{ animationDelay: `${base + i * step}s` }}>
            {word}
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Fetch a representative image for each location from Wikimedia (Wikipedia pageimages).
function useWikimediaImages() {
  const [images, setImages] = useState<Record<string, string>>(FALLBACK_IMAGES)

  useEffect(() => {
    const controller = new AbortController()
    const titles = LOCATIONS.map((l) => l.wikipediaTitle).join('|')
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1' +
      '&prop=pageimages&piprop=thumbnail&pithumbsize=1000&titles=' +
      encodeURIComponent(titles)

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const query = data?.query ?? {}
        const pages = query.pages ?? {}
        const norm = (s: string) => s.replace(/_/g, ' ').toLowerCase()

        // Map any title alias -> our location id, following the
        // normalization and redirect chains Wikipedia applies.
        const aliasOf: Record<string, string> = {}
        for (const loc of LOCATIONS) aliasOf[norm(loc.wikipediaTitle)] = loc.id
        for (const n of query.normalized ?? []) {
          const id = aliasOf[norm(n.from)]
          if (id) aliasOf[norm(n.to)] = id
        }
        for (const r of query.redirects ?? []) {
          const id = aliasOf[norm(r.from)]
          if (id) aliasOf[norm(r.to)] = id
        }

        const next: Record<string, string> = { ...FALLBACK_IMAGES }
        for (const key of Object.keys(pages)) {
          const page = pages[key]
          const src = page?.thumbnail?.source
          const id = page?.title ? aliasOf[norm(page.title)] : undefined
          if (src && id) next[id] = src
        }
        setImages(next)
      })
      .catch(() => { /* fall back to gradients */ })

    return () => controller.abort()
  }, [])

  return images
}

export function LocationsShowcase() {
  const [active, setActive] = useState(0)
  const images = useWikimediaImages()

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % TOTAL_LOCATIONS)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  const next = () => setActive((a) => (a + 1) % TOTAL_LOCATIONS)
  const prev = () => setActive((a) => (a - 1 + TOTAL_LOCATIONS) % TOTAL_LOCATIONS)

  const location = LOCATIONS[active]
  const visual = VISUALS[location.id]
  const bgImage = images[location.id]

  return (
    <section className="loc-showcase" id="stops">
      <div
        key={location.id}
        className="loc-showcase-bg"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : { background: visual.gradient }}
      >
        {!bgImage && <span className="loc-showcase-bg-icon" aria-hidden>{visual.icon}</span>}
      </div>
      <div className="loc-showcase-overlay" />

      <div className="loc-showcase-inner">
        <div className="loc-showcase-timeline">
          <div className="loc-timeline-line" />
          <div className="loc-timeline-dots">
            {LOCATIONS.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                className={`loc-timeline-dot ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Show ${loc.name}`}
              />
            ))}
          </div>
          <span className="loc-timeline-counter">{pad(active + 1)}/{pad(TOTAL_LOCATIONS)}</span>
        </div>

        <div className="loc-showcase-body">
          <p className="loc-showcase-eyebrow">The 12 Stops · Salzburg</p>

          <div className="loc-showcase-content">
            <div key={`main-${location.id}`} className="loc-showcase-main">
              <div className="loc-showcase-dots">
                {LOCATIONS.map((loc, i) => (
                  <button
                    key={loc.id}
                    type="button"
                    className={i === active ? 'active' : ''}
                    onClick={() => setActive(i)}
                    aria-label={`Show ${loc.name}`}
                  />
                ))}
              </div>
              <span className="loc-showcase-icon-big" aria-hidden>{visual.icon}</span>
              <h3 className="loc-showcase-name">
                <Words text={location.name} base={0.05} step={0.08} />
              </h3>
              <p className="loc-showcase-desc">
                <Words text={location.description} base={0.35} step={0.012} />
              </p>
              <Link to={`/location/${location.id}`} className="loc-showcase-explore">
                Explore <ArrowIcon />
              </Link>
            </div>

            <div className="loc-showcase-cards">
              <div
                className="loc-showcase-track"
                style={{ transform: `translateX(calc(-${active} * (var(--loc-card-w) + var(--loc-card-gap))))` }}
              >
                {LOCATIONS.map((loc, idx) => {
                  const v = VISUALS[loc.id]
                  const img = images[loc.id]
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      className={`loc-card ${idx === active ? 'active' : ''}`}
                      onClick={() => setActive(idx)}
                    >
                      <div className="loc-card-image">
                        <div
                          className="loc-card-photo"
                          style={img ? { backgroundImage: `url(${img})` } : { background: v.gradient }}
                        />
                        {!img && <span className="loc-card-icon" aria-hidden>{v.icon}</span>}
                        <span className="loc-card-points">{loc.points} pts</span>
                      </div>
                      <p className="loc-card-name">{loc.name}</p>
                      <p className="loc-card-sub">{loc.subtitle}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="loc-showcase-footer">
            <span className="loc-showcase-counter">{pad(active + 1)} / {pad(TOTAL_LOCATIONS)}</span>
            <div className="loc-showcase-nav">
              <button type="button" onClick={prev} aria-label="Previous location">
                <ChevronIcon direction="left" />
              </button>
              <button type="button" onClick={next} aria-label="Next location">
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
