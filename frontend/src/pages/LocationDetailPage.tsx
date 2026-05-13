import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../data/locations'
import { AppHeader } from '../components/AppHeader'
import { C, F } from '../theme'

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 11l3 3L22 4" stroke={C.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={C.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const location = LOCATIONS.find((l) => l.id === id)

  const [storyExpanded, setStoryExpanded] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)

  // Wikipedia REST API — fetch the hero image for this location
  useEffect(() => {
    if (!location) return
    setImageLoading(true)
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location.wikipediaTitle)}`,
      { headers: { 'Api-User-Agent': 'MozartsTrailApp/1.0 (educational project)' } },
    )
      .then((r) => r.json())
      .then((data) => {
        const url = data.originalimage?.source ?? data.thumbnail?.source ?? null
        setHeroImage(url)
      })
      .catch(() => {})
      .finally(() => setImageLoading(false))
  }, [location?.wikipediaTitle])

  // Nominatim reverse geocoding — get the official street address
  useEffect(() => {
    if (!location) return
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json&accept-language=en`,
      { headers: { 'User-Agent': 'MozartsTrailApp/1.0' } },
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address ?? {}
        const parts = [a.road, a.house_number, a.postcode, a.city]
          .filter(Boolean)
          .join(', ')
        if (parts) setAddress(parts)
      })
      .catch(() => {})
  }, [location?.lat, location?.lng])

  if (!location) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: F.body }}>
        <AppHeader showBack />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Location not found.</p>
        </div>
      </div>
    )
  }

  const storyParagraphs = location.fullStory.split('\n\n')

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral, overflow: 'hidden' }}>
      <AppHeader showBack />

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Hero image section */}
        <div style={{ position: 'relative', height: 280, background: '#0F1225', overflow: 'hidden' }}>
          {imageLoading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #1a1f3a 25%, #242952 50%, #1a1f3a 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.6s infinite',
            }} />
          )}
          {heroImage && (
            <img
              src={heroImage}
              alt={location.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoading ? 0 : 0.52,
                filter: 'grayscale(15%) contrast(1.1)',
                transition: 'opacity 0.4s ease',
              }}
              onLoad={() => setImageLoading(false)}
            />
          )}
          {!imageLoading && !heroImage && (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 72, opacity: 0.25 }}>🏛️</span>
            </div>
          )}

          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,18,37,0.95) 0%, rgba(15,18,37,0.3) 55%, transparent 100%)',
          }} />

          {/* Text overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
            <p style={{
              margin: '0 0 4px',
              fontFamily: F.body,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.secondary,
            }}>
              {location.subtitle}
            </p>
            <h2 style={{
              margin: 0,
              fontFamily: F.headline,
              fontSize: 22,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {location.name}
            </h2>
          </div>

          {/* Order badge */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: C.secondary,
            borderRadius: 20,
            padding: '4px 10px',
            fontFamily: F.body,
            fontSize: 11,
            fontWeight: 700,
            color: C.textDark,
          }}>
            Stop {location.order} / 12
          </div>
        </div>

        {/* Content card */}
        <div style={{ padding: '24px 20px 32px', background: C.neutral }}>

          {/* Category tag */}
          <p style={{
            margin: '0 0 8px',
            fontFamily: F.body,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.secondaryDark,
          }}>
            {location.category}
          </p>

          {/* Main title */}
          <h1 style={{
            margin: '0 0 4px',
            fontFamily: F.headline,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.15,
            color: C.textDark,
          }}>
            {location.name}
          </h1>

          {/* Subtitle */}
          <p style={{
            margin: '0 0 14px',
            fontFamily: F.headline,
            fontSize: 17,
            fontStyle: 'italic',
            color: C.primary,
            fontWeight: 400,
          }}>
            ({location.subtitle})
          </p>

          {/* Gold separator */}
          <div style={{
            width: 44,
            height: 3,
            background: `linear-gradient(90deg, ${C.secondary}, ${C.tertiary})`,
            borderRadius: 2,
            marginBottom: 18,
          }} />

          {/* Address from Nominatim */}
          {address && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              padding: '8px 12px',
              background: `rgba(212,175,55,0.08)`,
              borderRadius: 10,
              border: `1px solid rgba(212,175,55,0.2)`,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.secondary} />
              </svg>
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>{address}</span>
            </div>
          )}

          {/* Description preview */}
          <p style={{
            margin: '0 0 20px',
            fontFamily: F.body,
            fontSize: 15,
            lineHeight: 1.75,
            color: C.textMuted,
          }}>
            {location.description}
          </p>

          {/* Expanded full story */}
          {storyExpanded && (
            <div style={{ marginBottom: 20 }}>
              {storyParagraphs.map((para, i) => (
                <p key={i} style={{
                  margin: '0 0 16px',
                  fontFamily: F.body,
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: C.textMuted,
                }}>
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* READ STORY button */}
          <button
            onClick={() => setStoryExpanded((e) => !e)}
            style={{
              width: '100%',
              padding: '14px 0',
              marginBottom: 12,
              background: storyExpanded ? C.primaryDark : C.primary,
              border: 'none',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              fontFamily: F.body,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'white',
              boxShadow: '0 4px 14px rgba(139,0,0,0.35)',
              transition: 'background 0.2s ease',
            }}
          >
            <BookIcon />
            {storyExpanded ? 'Close Story' : 'Read Story'}
          </button>

          {/* START QUIZ button */}
          <button
            onClick={() => navigate(`/quiz/${location.id}`)}
            style={{
              width: '100%',
              padding: '14px 0',
              background: 'transparent',
              border: `2px solid ${C.tertiary}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              fontFamily: F.body,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: C.tertiary,
              transition: 'background 0.2s ease',
            }}
          >
            <QuizIcon />
            Start Quiz
          </button>

          {/* Info footer — desktop only */}
          <div className="desktop-only" style={{
            display: 'flex',
            gap: 1,
            marginTop: 24,
            padding: '14px 0 0',
            borderTop: `1px solid ${C.neutralDark}`,
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: F.body, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.textDark }}>{location.category}</p>
            </div>
            <div style={{ width: 1, background: C.neutralDark }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: F.body, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Year</p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.textDark }}>{location.year}</p>
            </div>
            <div style={{ width: 1, background: C.neutralDark }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: F.body, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Points</p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.secondary }}>+{location.points}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
