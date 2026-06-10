import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LOCATIONS, TOTAL_LOCATIONS } from '../data/locations'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { fetchOpeningHours, formatOsmHours } from '../lib/overpass'
import { MusicListenCard } from '../components/MusicListenCard'
import { C } from '../theme'

function readingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(' ').length / 200))
}

function pullQuote(paragraph: string): string {
  const sentences = paragraph.split(/(?<=\.)\s+/).filter((s) => s.length > 55)
  return sentences[Math.floor(sentences.length / 2)] ?? ''
}

function ChapterDivider({ num, total, year }: { num: number; total: number; year: string }) {
  return (
    <div className="story-chapter-divider">
      <span className="story-chapter-label">
        Chapter {num} of {total} · {year}
      </span>
    </div>
  )
}

function PullQuote({ text }: { text: string }) {
  if (!text) return null
  return (
    <blockquote className="story-pull-quote">
      <p>"{text}"</p>
    </blockquote>
  )
}

function ChapterImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)
  if (err) return null
  return (
    <figure className="story-chapter-figure">
      {!loaded && <div className="story-chapter-figure-shimmer" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        className="story-chapter-figure-img"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <figcaption className="story-chapter-figure-cap">© Wikimedia Commons</figcaption>
    </figure>
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
    <div className="story-reading-bar">
      <div className="story-reading-fill" style={{ width: `${pct}%` }} />
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
          const url: string | null =
            item.original?.source ??
            (Array.isArray(item.srcset) && item.srcset.length
              ? item.srcset[item.srcset.length - 1].src
              : null)
          if (!url) continue
          if (url.endsWith('.svg')) continue
          const title = (item.title ?? '').toLowerCase()
          if (/icon|logo|flag|map|plan|diagram|coat|arms|seal|signature/.test(title)) continue
          imgs.push(url)
          if (imgs.length >= 5) break
        }
        setChapterImages(imgs.slice(1))
      })
      .catch(() => {})
  }, [location?.wikipediaTitle])

  useEffect(() => {
    if (!location) return
    fetchOpeningHours(location.lat, location.lng).then((r) => {
      if (r) setLiveHours(formatOsmHours(r.raw))
    })
  }, [location?.lat, location?.lng])

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
      <div className="story-page">
        <AppHeader showBack />
        <div className="story-not-found">
          <p>Location not found.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const chapters = location.fullStory.split('\n\n').filter(Boolean)
  const mins = readingTime(location.fullStory)
  const hoursLine = (liveHours ?? location.openingHours.schedule).split('·')[0].trim()

  return (
    <div className="story-page">
      <AppHeader showBack />
      <ReadingProgress scrollRef={scrollRef} />

      <div ref={scrollRef} className="story-scroll">
        <header className="story-hero">
          {imageLoading && <div className="story-hero-shimmer" />}
          {heroImage && (
            <img
              src={heroImage}
              alt=""
              onLoad={() => setImageLoading(false)}
              className="story-hero-img"
              style={{ opacity: imageLoading ? 0 : 1 }}
            />
          )}
          {!imageLoading && !heroImage && (
            <div className="story-hero-fallback" aria-hidden>🏛️</div>
          )}
          <div className="story-hero-overlay" />
          <div className="story-hero-content">
            <span className="story-hero-badge">
              Stop {location.order} · {TOTAL_LOCATIONS}
            </span>
            <p className="story-hero-eyebrow">{location.category}</p>
            <h1 className="story-hero-title">{location.name}</h1>
            <p className="story-hero-subtitle">{location.subtitle}</p>
          </div>
        </header>

        <article className="story-article">
          <div className="story-meta">
            <span className="story-meta-chip">{mins} min read</span>
            <span className="story-meta-chip">{chapters.length} chapters</span>
            <span className="story-meta-chip story-meta-chip--points">+{location.points} pts</span>
            <span className="story-meta-chip">{location.year}</span>
          </div>

          <div className="story-info-grid">
            {address && (
              <div className="story-info-item">
                <span className="story-info-label">Address</span>
                <span className="story-info-value">{address}</span>
              </div>
            )}
            <div className="story-info-item">
              <span className="story-info-label">Hours</span>
              <span className="story-info-value">{hoursLine}</span>
            </div>
            {location.openingHours.admission && (
              <div className="story-info-item">
                <span className="story-info-label">Admission</span>
                <span className="story-info-value">{location.openingHours.admission}</span>
              </div>
            )}
          </div>

          <MusicListenCard locationId={location.id} />

          <p className="story-lead">{location.description}</p>

          {chapters.map((para, i) => {
            const quote = i > 0 ? pullQuote(para) : ''
            const img = i > 0 ? chapterImages[i - 1] ?? null : null
            return (
              <section key={i} className="story-chapter">
                <ChapterDivider num={i + 1} total={chapters.length} year={location.year} />
                {img && <ChapterImage src={img} alt={`${location.name} — chapter ${i + 1}`} />}
                <p className="story-chapter-text">
                  {i === 0 ? (
                    <>
                      <span className="story-drop-cap">{para[0]}</span>
                      {para.slice(1)}
                    </>
                  ) : para}
                </p>
                {quote && <PullQuote text={quote} />}
              </section>
            )
          })}

          <div className="story-actions">
            <button
              type="button"
              onClick={() => navigate(`/quiz/${location.id}`)}
              className="story-btn story-btn--primary"
            >
              Start Quiz · {location.points} pts
            </button>
            <button
              type="button"
              onClick={() => navigate('/hunt')}
              className="story-btn story-btn--ghost"
            >
              Back to map
            </button>
          </div>
        </article>

        <div className="story-footer-wrap">
          <AppFooter />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
