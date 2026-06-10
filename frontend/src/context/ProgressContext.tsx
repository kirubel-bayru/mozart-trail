import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  EMPTY_PROGRESS,
  fetchUserProgress,
  saveMusicProgressApi,
  saveQuizResultApi,
  unlockLocationApi,
  type MusicProgress,
  type QuizResult,
  type UserProgressData,
} from '../lib/progressApi'

interface ProgressContextValue extends UserProgressData {
  loading: boolean
  refresh: () => Promise<void>
  saveQuizResult: (result: QuizResult) => Promise<void>
  saveMusicProgress: (progress: MusicProgress) => Promise<void>
  unlockLocation: (locationId: string) => Promise<void>
  getQuizResult: (locationId: string) => QuizResult | undefined
  getMusicProgress: (locationId: string) => MusicProgress | undefined
  hasTreasure: (locationId: string) => boolean
  totalQuizPoints: number
  totalMusicPoints: number
  cipherSolvedCount: number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<UserProgressData>(EMPTY_PROGRESS)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setData(EMPTY_PROGRESS)
      return
    }
    setLoading(true)
    try {
      setData(await fetchUserProgress())
    } catch (err) {
      console.error('Failed to load progress:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const saveQuizResult = useCallback(async (result: QuizResult) => {
    const next = await saveQuizResultApi(result)
    setData(next)
  }, [])

  const saveMusicProgress = useCallback(async (progress: MusicProgress) => {
    const next = await saveMusicProgressApi(progress)
    setData(next)
  }, [])

  const unlockLocation = useCallback(async (locationId: string) => {
    if (data.unlockedLocationIds.includes(locationId)) return
    const next = await unlockLocationApi(locationId)
    setData(next)
  }, [data.unlockedLocationIds])

  const value = useMemo<ProgressContextValue>(() => {
    const quizMap = new Map(data.quizResults.map((r) => [r.locationId, r]))
    const musicMap = new Map(data.musicProgress.map((m) => [m.locationId, m]))
    const treasureSet = new Set(data.treasures.map((t) => t.locationId))

    return {
      ...data,
      loading,
      refresh,
      saveQuizResult,
      saveMusicProgress,
      unlockLocation,
      getQuizResult: (id) => quizMap.get(id),
      getMusicProgress: (id) => musicMap.get(id),
      hasTreasure: (id) => treasureSet.has(id),
      totalQuizPoints: data.quizResults.reduce((s, r) => s + r.pointsEarned, 0),
      totalMusicPoints: data.musicProgress.reduce((s, m) => s + m.listenPoints + m.cipherPoints, 0),
      cipherSolvedCount: data.musicProgress.filter((m) => m.cipherSolved).length,
    }
  }, [data, loading, refresh, saveQuizResult, saveMusicProgress, unlockLocation])

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
