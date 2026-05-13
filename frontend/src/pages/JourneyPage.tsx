import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { C, F } from '../theme'

export function JourneyPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral }}>
      <AppHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 52 }}>📖</span>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.textDark, fontFamily: F.headline }}>My Journey</p>
        <p style={{ margin: 0, fontSize: 14, color: C.textMuted, fontFamily: F.body }}>Your progress and story chapters</p>
      </div>
      <BottomNav />
    </div>
  )
}
