import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { C, F } from '../theme'

export function TreasuresPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral }}>
      <AppHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 52 }}>🏆</span>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.textDark, fontFamily: F.headline }}>Treasures</p>
        <p style={{ margin: 0, fontSize: 14, color: C.textMuted, fontFamily: F.body }}>Collect items by visiting locations</p>
      </div>
      <BottomNav />
    </div>
  )
}
