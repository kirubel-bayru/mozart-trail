import { Navigate, Route, Routes } from 'react-router-dom'
import { HuntPage } from './pages/HuntPage'
import { TreasuresPage } from './pages/TreasuresPage'
import { JourneyPage } from './pages/JourneyPage'
import { LocationDetailPage } from './pages/LocationDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HuntPage />} />
      <Route path="/location/:id" element={<LocationDetailPage />} />
      <Route path="/treasures" element={<TreasuresPage />} />
      <Route path="/journey" element={<JourneyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
