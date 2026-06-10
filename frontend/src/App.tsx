import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
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
      <ProgressProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/hunt" element={<RequireAuth><HuntPage /></RequireAuth>} />
          <Route path="/location/:id" element={<RequireAuth><LocationDetailPage /></RequireAuth>} />
          <Route path="/quiz/:id" element={<RequireAuth><LocationQuizPage /></RequireAuth>} />
          <Route path="/treasures" element={<RequireAuth><TreasuresPage /></RequireAuth>} />
          <Route path="/journey" element={<RequireAuth><JourneyPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  )
}

export default App
