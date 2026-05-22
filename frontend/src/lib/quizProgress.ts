export interface QuizResult {
  locationId: string
  correct: number
  total: number
  pointsEarned: number
  completedAt: string
}

const STORAGE_KEY = 'mozart-quiz-results'

function readAll(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : []
  } catch {
    return []
  }
}

function writeAll(results: QuizResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
}

export function getQuizResult(locationId: string): QuizResult | undefined {
  return readAll().find((r) => r.locationId === locationId)
}

export function saveQuizResult(result: QuizResult) {
  const rest = readAll().filter((r) => r.locationId !== result.locationId)
  writeAll([...rest, result])
}

export function getTotalPointsEarned(): number {
  return readAll().reduce((sum, r) => sum + r.pointsEarned, 0)
}
