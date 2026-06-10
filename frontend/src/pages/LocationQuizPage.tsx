import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../data/locations'
import { getQuizForLocation } from '../data/quizzes'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { useProgress } from '../context/ProgressContext'

type Phase = 'intro' | 'question' | 'complete'

function QuizProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="quiz-progress-bar">
      <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

function OptionButton({
  label,
  index,
  selected,
  revealed,
  isCorrect,
  disabled,
  onSelect,
}: {
  label: string
  index: number
  selected: boolean
  revealed: boolean
  isCorrect: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const letters = ['A', 'B', 'C', 'D']
  const state = revealed
    ? isCorrect
      ? 'correct'
      : selected
        ? 'wrong'
        : 'muted'
    : selected
      ? 'selected'
      : 'default'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`quiz-option quiz-option--${state}`}
    >
      <span className="quiz-option-letter">
        {revealed && isCorrect ? '✓' : letters[index]}
      </span>
      <span className="quiz-option-label">{label}</span>
    </button>
  )
}

export function LocationQuizPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { saveQuizResult } = useProgress()

  const location = LOCATIONS.find((l) => l.id === id)
  const quiz = id ? getQuizForLocation(id) : undefined

  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  if (!location || !quiz) {
    return (
      <div className="quiz-page">
        <AppHeader showBack />
        <div className="quiz-not-found">
          <p>Quiz not found.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const total = quiz.questions.length
  const current = quiz.questions[questionIndex]
  const isLastQuestion = questionIndex === total - 1

  const handleSelect = (index: number) => {
    if (revealed) return
    setSelectedIndex(index)
    setRevealed(true)
    if (index === current.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      const finalCorrect = correctCount
      const pointsEarned =
        finalCorrect === total
          ? location.points
          : Math.max(10, Math.round((finalCorrect / total) * location.points))

      await saveQuizResult({
        locationId: location.id,
        correct: finalCorrect,
        total,
        pointsEarned,
        completedAt: new Date().toISOString(),
      })
      setPhase('complete')
      return
    }
    setQuestionIndex((i) => i + 1)
    setSelectedIndex(null)
    setRevealed(false)
  }

  const handleStart = () => {
    setPhase('question')
    setQuestionIndex(0)
    setSelectedIndex(null)
    setRevealed(false)
    setCorrectCount(0)
  }

  const pointsEarned =
    correctCount === total
      ? location.points
      : Math.max(10, Math.round((correctCount / total) * location.points))

  return (
    <div className="quiz-page">
      <AppHeader showBack />
      {phase === 'question' && (
        <QuizProgressBar current={questionIndex + (revealed ? 1 : 0)} total={total} />
      )}

      <div className="quiz-scroll">
        <div className="quiz-content">
          <div className="quiz-location-badge">
            <span className="quiz-location-stop">Stop {location.order}</span>
            <span className="quiz-location-name">{location.name}</span>
          </div>

          {phase === 'intro' && (
            <div className="quiz-intro">
              <p className="quiz-eyebrow">Location Quiz</p>
              <h1 className="quiz-title">Test your knowledge</h1>
              <p className="quiz-lead">
                Answer {total} questions about <strong>{location.name}</strong>.
                Earn up to <strong>{location.points} pts</strong> for a perfect score.
              </p>

              <div className="quiz-tips-card">
                {[
                  'Questions are based on the location story',
                  'See explanations after each answer',
                  `Perfect score earns ${location.points} points`,
                ].map((text) => (
                  <div key={text} className="quiz-tip">
                    <span className="quiz-tip-dot" aria-hidden />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleStart} className="quiz-btn quiz-btn--primary">
                Begin Quiz
              </button>
            </div>
          )}

          {phase === 'question' && current && (
            <div className="quiz-question">
              <p className="quiz-question-count">
                Question {questionIndex + 1} of {total}
              </p>
              <h2 className="quiz-question-text">{current.question}</h2>

              <div className="quiz-options">
                {current.options.map((opt, i) => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    index={i}
                    selected={selectedIndex === i}
                    revealed={revealed}
                    isCorrect={i === current.correctIndex}
                    disabled={revealed}
                    onSelect={() => handleSelect(i)}
                  />
                ))}
              </div>

              {revealed && (
                <div
                  className={`quiz-feedback ${
                    selectedIndex === current.correctIndex
                      ? 'quiz-feedback--correct'
                      : 'quiz-feedback--wrong'
                  }`}
                >
                  <p className="quiz-feedback-title">
                    {selectedIndex === current.correctIndex ? 'Correct!' : 'Not quite'}
                  </p>
                  <p className="quiz-feedback-text">{current.explanation}</p>
                </div>
              )}

              {revealed && (
                <button type="button" onClick={handleNext} className="quiz-btn quiz-btn--primary">
                  {isLastQuestion ? 'See Results' : 'Next Question'}
                </button>
              )}
            </div>
          )}

          {phase === 'complete' && (
            <div className="quiz-complete">
              <div className="quiz-complete-icon" aria-hidden>
                {correctCount === total ? '🏆' : correctCount >= total / 2 ? '✨' : '📜'}
              </div>

              <h2 className="quiz-complete-title">
                {correctCount === total ? 'Perfect score!' : 'Quiz complete'}
              </h2>
              <p className="quiz-complete-sub">
                You answered {correctCount} of {total} correctly
              </p>

              <div className="quiz-score-card">
                <p className="quiz-score-label">Points earned</p>
                <p className="quiz-score-value">+{pointsEarned}</p>
                {correctCount < total && (
                  <p className="quiz-score-hint">
                    Perfect score would earn {location.points} pts
                  </p>
                )}
              </div>

              <div className="quiz-actions">
                <button
                  type="button"
                  onClick={() => navigate('/treasures')}
                  className="quiz-btn quiz-btn--gold"
                >
                  View Treasures
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/hunt')}
                  className="quiz-btn quiz-btn--ghost"
                >
                  Back to map
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="quiz-footer-wrap">
          <AppFooter />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
