import { BottomNav } from '../components/BottomNav'

export function JourneyPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#F5F0E6' }}>
      <header style={{
        height: 60,
        background: '#8B0000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'Georgia, serif' }}>
          Mozart's Trail
        </h1>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 52 }}>📖</span>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#2C1810' }}>My Journey</p>
        <p style={{ margin: 0, fontSize: 14, color: '#888' }}>Your progress and story chapters</p>
      </div>
      <BottomNav />
    </div>
  )
}
