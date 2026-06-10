import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HomePage } from './pages/HomePage'
import { HuntPage } from './pages/HuntPage'
import { TreasuresPage } from './pages/TreasuresPage'
import { JourneyPage } from './pages/JourneyPage'
import { LocationDetailPage } from './pages/LocationDetailPage'
import { LocationQuizPage } from './pages/LocationQuizPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hunt" element={<HuntPage />} />
        <Route path="/location/:id" element={<LocationDetailPage />} />
        <Route path="/quiz/:id" element={<LocationQuizPage />} />
        <Route path="/treasures" element={<TreasuresPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
