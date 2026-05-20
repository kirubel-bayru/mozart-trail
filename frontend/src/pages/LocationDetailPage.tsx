import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../data/locations'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { fetchOpeningHours, formatOsmHours } from '../lib/overpass'
import { C, F } from '../theme'

function readingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(' ').length / 200))
}

function pullQuote(paragraph: string): string {
  const sentences = paragraph.split(/(?<=\.)\s+/).filter((s) => s.length > 55)
  return sentences[Math.floor(sentences.length / 2)] ?? ''
}

function ChapterDivider({ num, total, year }: { num: number; total: number; year: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '36px 0 24px' }}>
      <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
      <span style={{
        fontFamily: F.body, fontSize: 10, fontWeight: 800,
        letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary,
        whiteSpace: 'nowrap',
      }}>
        Chapter {num} of {total} · {year}
      </span>
      <div style={{ flex: 1, height: 1, background: C.neutralDark }} />
    </div>
  )
}

function PullQuote({ text }: { text: string }) {
  if (!text) return null
  return (
    <blockquote style={{
      margin: '24px 0',
      padding: '18px 20px',
      borderLeft: `4px solid ${C.secondary}`,
      background: `rgba(212,175,55,0.07)`,
      borderRadius: '0 12px 12px 0',
    }}>
      <p style={{
        margin: 0, fontFamily: F.headline, fontSize: 17,
        fontStyle: 'italic', lineHeight: 1.65, color: C.tertiary,
      }}>
        "{text}"
      </p>
    </blockquote>
  )
}

function ChapterImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)
  if (err) return null
  return (
    <div style={{ margin: '24px -20px', position: 'relative', height: 220, background: '#0F1225', overflow: 'hidden' }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,#1a1f3a 25%,#242952 50%,#1a1f3a 75%)',
          backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
        }} />
      )}
      <img
        src={src} alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 0.8 : 0, transition: 'opacity 0.4s ease' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,18,37,0.5) 0%,transparent 60%)' }} />
      <p style={{ position: 'absolute', bottom: 6, right: 10, margin: 0, fontFamily: F.body, fontSize: 9, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
        © Wikimedia Commons
      </p>
    </div>
  )
}

function ReadingProgress({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      setPct(Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100))
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef])
  return (
    <div style={{ height: 3, background: C.neutralDark, flexShrink: 0 }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: `linear-gradient(90deg,${C.primary},${C.secondary})`,
        transition: 'width 0.1s linear',
      }} />
    </div>
  )
}

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  const location = LOCATIONS.find((l) => l.id === id)

  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [chapterImages, setChapterImages] = useState<string[]>([])
  const [address, setAddress] = useState<string | null>(null)
  const [liveHours, setLiveHours] = useState<string | null>(null)

  // Wikipedia summary — hero image
  useEffect(() => {
    if (!location) return
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location.wikipediaTitle)}`,
      { headers: { 'Api-User-Agent': 'MozartsTrailApp/1.0 (educational project)' } },
    )
      .then((r) => r.json())
      .then((d) => setHeroImage(d.originalimage?.source ?? d.thumbnail?.source ?? null))
      .catch(() => {})
      .finally(() => setImageLoading(false))
  }, [location?.wikipediaTitle])

  // Wikipedia media-list — chapter images
  useEffect(() => {
    if (!location) return
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(location.wikipediaTitle)}`,
      { headers: { 'Api-User-Agent': 'MozartsTrailApp/1.0 (educational project)' } },
    )
      .then((r) => { if (!r.ok) throw new Error('failed'); return r.json() })
      .then((d) => {
        const imgs: string[] = []
        for (const item of (d.items ?? [])) {
          if (item.type !== 'image') continue
          // Prefer original, fall back to largest srcset entry
          const url: string | null =
            item.original?.source ??
            (Array.isArray(item.srcset) && item.srcset.length
              ? item.srcset[item.srcset.length - 1].src
              : null)
          if (!url) continue
          if (url.endsWith('.svg')) continue  // skip vector diagrams
          const title = (item.title ?? '').toLowerCase()
          if (/icon|logo|flag|map|plan|diagram|coat|arms|seal|signature/.test(title)) continue
          imgs.push(url)
          if (imgs.length >= 5) break
        }
        // skip index 0 (same as hero); give chapters 2 & 3 their own image
        setChapterImages(imgs.slice(1))
      })
      .catch(() => {})
  }, [location?.wikipediaTitle])

  // Overpass — live opening hours
  useEffect(() => {
    if (!location) return
    fetchOpeningHours(location.lat, location.lng).then((r) => {
      if (r) setLiveHours(formatOsmHours(r.raw))
    })
  }, [location?.lat, location?.lng])

  // Nominatim — street address
  useEffect(() => {
    if (!location) return
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json&accept-language=en`,
      { headers: { 'User-Agent': 'MozartsTrailApp/1.0' } },
    )
      .then((r) => r.json())
      .then((d) => {
        const a = d.address ?? {}
        const parts = [a.road, a.house_number, a.postcode, a.city].filter(Boolean).join(', ')
        if (parts) setAddress(parts)
      })
      .catch(() => {})
  }, [location?.lat, location?.lng])

  if (!location) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <AppHeader showBack />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: F.body, color: C.textMuted }}>Location not found.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const chapters = location.fullStory.split('\n\n').filter(Boolean)
  const mins = readingTime(location.fullStory)

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral, overflow: 'hidden' }}>
      <AppHeader showBack />
      <ReadingProgress scrollRef={scrollRef} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>

        {/* Hero */}
        <div style={{ position: 'relative', height: 300, background: '#0F1225', overflow: 'hidden' }}>
          {imageLoading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,#1a1f3a 25%,#242952 50%,#1a1f3a 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
            }} />
          )}
          {heroImage && (
            <img src={heroImage} alt={location.name} onLoad={() => setImageLoading(false)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: imageLoading ? 0 : 0.55,
                filter: 'grayscale(10%) contrast(1.1)',
                transition: 'opacity 0.5s ease',
              }}
            />
          )}
          {!imageLoading && !heroImage && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 80, opacity: 0.2 }}>🏛️</span>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,12,30,0.97) 0%,rgba(10,12,30,0.35) 55%,transparent 100%)' }} />
          <div style={{ position: 'absolute', top: 14, right: 14, background: C.secondary, borderRadius: 20, padding: '4px 12px', fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.textDark }}>
            Stop {location.order} / 12
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 22px' }}>
            <p style={{ margin: '0 0 4px', fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary }}>
              {location.subtitle}
            </p>
            <h2 style={{ margin: 0, fontFamily: F.headline, fontSize: 24, fontWeight: 700, color: 'white', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {location.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px 40px' }}>

          {/* Category + reading time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: F.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.secondaryDark }}>
              {location.category}
            </span>
            <span style={{ fontFamily: F.body, fontSize: 11, color: C.textMuted }}>
              📖 {mins} min read · {chapters.length} chapters
            </span>
          </div>

          <h1 style={{ margin: '0 0 4px', fontFamily: F.headline, fontSize: 30, fontWeight: 700, lineHeight: 1.15, color: C.textDark }}>
            {location.name}
          </h1>
          <p style={{ margin: '0 0 14px', fontFamily: F.headline, fontSize: 17, fontStyle: 'italic', color: C.primary, fontWeight: 400 }}>
            ({location.subtitle})
          </p>
          <div style={{ width: 48, height: 3, background: `linear-gradient(90deg,${C.secondary},${C.tertiary})`, borderRadius: 2, marginBottom: 20 }} />

          {/* Quick info: address + hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24, padding: '12px 14px', background: 'white', borderRadius: 12, border: `1px solid ${C.neutralDark}` }}>
            {address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 13 }}>📍</span>
                <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>{address}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13 }}>🕐</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
                {(liveHours ?? location.openingHours.schedule).split('·')[0].trim()}
              </span>
            </div>
            {location.openingHours.admission && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 13 }}>🎫</span>
                <span style={{ fontFamily: F.body, fontSize: 12, color: C.secondaryDark, fontWeight: 600 }}>
                  {location.openingHours.admission}
                </span>
              </div>
            )}
          </div>

          {/* Intro */}
          <p style={{
            margin: '0 0 4px', fontFamily: F.body, fontSize: 15, lineHeight: 1.75,
            color: C.textMuted, fontStyle: 'italic',
            borderLeft: `3px solid ${C.secondary}`, paddingLeft: 14,
          }}>
            {location.description}
          </p>

          {/* Chapters */}
          {chapters.map((para, i) => {
            const quote = i > 0 ? pullQuote(para) : ''
            const img = i > 0 ? chapterImages[i - 1] ?? null : null
            return (
              <div key={i}>
                <ChapterDivider num={i + 1} total={chapters.length} year={location.year} />

                {img && <ChapterImage src={img} alt={`${location.name} — chapter ${i + 1}`} />}

                <p style={{ margin: '0 0 8px', fontFamily: F.headline, fontSize: 16, lineHeight: 1.9, color: C.textDark }}>
                  {i === 0 ? (
                    <>
                      <span style={{
                        float: 'left', fontSize: 68, lineHeight: 0.75,
                        marginRight: 6, marginTop: 8,
                        fontFamily: F.headline, fontWeight: 700, color: C.primary,
                      }}>
                        {para[0]}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : para}
                </p>
                {quote && <PullQuote text={quote} />}
              </div>
            )
          })}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 36 }}>
            <button
              onClick={() => navigate(`/quiz/${location.id}`)}
              style={{
                width: '100%', padding: '15px 0', background: C.primary,
                border: 'none', borderRadius: 14, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, fontFamily: F.body, fontSize: 14,
                fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'white', cursor: 'pointer', boxShadow: `0 4px 16px rgba(139,0,0,0.3)`,
              }}
            >
              ✏️ Start Quiz · Earn {location.points} pts
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: '100%', padding: '13px 0', background: 'transparent',
                border: `2px solid ${C.neutralDark}`, borderRadius: 14,
                fontFamily: F.body, fontSize: 13, fontWeight: 600,
                color: C.textMuted, cursor: 'pointer',
              }}
            >
              ← Back to map
            </button>
          </div>

          {/* Desktop-only stats */}
          <div className="desktop-only" style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${C.neutralDark}` }}>
            {[
              { label: 'Category', value: location.category, color: C.textDark },
              { label: 'Year', value: location.year, color: C.textDark },
              { label: 'Points', value: `+${location.points}`, color: C.secondary },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: F.body, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 13, fontWeight: 600, color }}>{value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
      <BottomNav />
    </div>
  )
}
