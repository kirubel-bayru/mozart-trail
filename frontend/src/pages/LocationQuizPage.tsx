import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../data/locations'
import { getQuizForLocation } from '../data/quizzes'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { saveQuizResult } from '../lib/quizProgress'
import { C, F } from '../theme'

type Phase = 'intro' | 'question' | 'complete'

function QuizProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div style={{ height: 4, background: C.neutralDark, flexShrink: 0 }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
          transition: 'width 0.25s ease',
        }}
      />
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
  let border: string = C.neutralDark
  let bg = 'white'
  let color: string = C.textDark

  if (selected && !revealed) {
    border = C.primary
    bg = 'rgba(139,0,0,0.06)'
  }
  if (revealed) {
    if (isCorrect) {
      border = C.secondary
      bg = 'rgba(212,175,55,0.14)'
      color = C.textDark
    } else if (selected && !isCorrect) {
      border = C.primary
      bg = 'rgba(139,0,0,0.1)'
      color = C.primary
    } else if (!selected) {
      color = C.textMuted
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 14,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        fontFamily: F.body,
        transition: 'border-color 0.15s ease, background 0.15s ease',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: 8,
          background: revealed && isCorrect ? C.secondary : selected ? C.primary : C.neutral,
          color: revealed && isCorrect ? C.textDark : selected ? 'white' : C.tertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {revealed && isCorrect ? '✓' : letters[index]}
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.5, fontWeight: selected ? 600 : 500, color }}>
        {label}
      </span>
    </button>
  )
}

export function LocationQuizPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const location = LOCATIONS.find((l) => l.id === id)
  const quiz = id ? getQuizForLocation(id) : undefined

  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  if (!location || !quiz) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral }}>
        <AppHeader showBack />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: F.body, color: C.textMuted }}>Quiz not found.</p>
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

  const handleNext = () => {
    if (isLastQuestion) {
      const finalCorrect = correctCount
      const pointsEarned =
        finalCorrect === total
          ? location.points
          : Math.max(10, Math.round((finalCorrect / total) * location.points))

      saveQuizResult({
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
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: C.neutral,
        overflow: 'hidden',
      }}
    >
      <AppHeader showBack />
      {phase === 'question' && (
        <QuizProgressBar current={questionIndex + (revealed ? 1 : 0)} total={total} />
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 28px' }}>
        {/* Location context */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'white',
            border: `1px solid ${C.neutralDark}`,
            borderRadius: 20,
            padding: '6px 14px',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.secondaryDark,
            }}
          >
            Stop {location.order}
          </span>
          <span style={{ color: C.neutralDark }}>·</span>
          <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, color: C.textMuted }}>
            {location.name}
          </span>
        </div>

        {phase === 'intro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p
                style={{
                  margin: '0 0 8px',
                  fontFamily: F.body,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: C.secondary,
                }}
              >
                Location Quiz
              </p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: F.headline,
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: C.textDark,
                }}
              >
                Test your knowledge
              </h2>
              <p
                style={{
                  margin: '12px 0 0',
                  fontFamily: F.body,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: C.textMuted,
                }}
              >
                Answer {total} questions about <strong style={{ color: C.textDark }}>{location.name}</strong>.
                Earn up to <strong style={{ color: C.secondaryDark }}>{location.points} pts</strong> for a perfect
                score.
              </p>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: 16,
                border: `1px solid ${C.neutralDark}`,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {[
                { icon: '📖', text: 'Questions are based on the location story' },
                { icon: '✓', text: 'See explanations after each answer' },
                { icon: '🏆', text: `Perfect score earns ${location.points} points` },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontFamily: F.body, fontSize: 13, color: C.textMuted }}>{text}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '15px 0',
                background: C.primary,
                border: 'none',
                borderRadius: 14,
                fontFamily: F.body,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(139,0,0,0.3)',
              }}
            >
              Begin Quiz
            </button>
          </div>
        )}

        {phase === 'question' && current && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p
              style={{
                margin: 0,
                fontFamily: F.body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.textMuted,
              }}
            >
              Question {questionIndex + 1} of {total}
            </p>

            <h3
              style={{
                margin: 0,
                fontFamily: F.headline,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.35,
                color: C.textDark,
              }}
            >
              {current.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                style={{
                  padding: '14px 16px',
                  background: selectedIndex === current.correctIndex
                    ? 'rgba(212,175,55,0.12)'
                    : 'rgba(139,0,0,0.08)',
                  border: `1px solid ${selectedIndex === current.correctIndex ? 'rgba(212,175,55,0.35)' : 'rgba(139,0,0,0.2)'}`,
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    margin: '0 0 6px',
                    fontFamily: F.body,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedIndex === current.correctIndex ? C.secondaryDark : C.primary,
                  }}
                >
                  {selectedIndex === current.correctIndex ? 'Correct!' : 'Not quite'}
                </p>
                <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, lineHeight: 1.6, color: C.textMuted }}>
                  {current.explanation}
                </p>
              </div>
            )}

            {revealed && (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: C.primary,
                  border: 'none',
                  borderRadius: 14,
                  fontFamily: F.body,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(139,0,0,0.25)',
                }}
              >
                {isLastQuestion ? 'See Results' : 'Next Question →'}
              </button>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.secondary} 0%, #E8C84A 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                boxShadow: '0 8px 24px rgba(212,175,55,0.35)',
              }}
            >
              {correctCount === total ? '🏆' : correctCount >= total / 2 ? '✨' : '📜'}
            </div>

            <div>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontFamily: F.headline,
                  fontSize: 26,
                  fontWeight: 700,
                  color: C.textDark,
                }}
              >
                {correctCount === total ? 'Perfect score!' : 'Quiz complete'}
              </h2>
              <p style={{ margin: 0, fontFamily: F.body, fontSize: 15, color: C.textMuted }}>
                You answered {correctCount} of {total} correctly
              </p>
            </div>

            <div
              style={{
                width: '100%',
                background: 'white',
                borderRadius: 16,
                border: `1px solid ${C.neutralDark}`,
                padding: '20px',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontFamily: F.body,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: C.secondaryDark,
                }}
              >
                Points earned
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: F.headline,
                  fontSize: 42,
                  fontWeight: 700,
                  color: C.primary,
                  lineHeight: 1,
                }}
              >
                +{pointsEarned}
              </p>
              {correctCount < total && (
                <p style={{ margin: '10px 0 0', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
                  Perfect score would earn {location.points} pts
                </p>
              )}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => navigate('/treasures')}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: C.secondary,
                  border: 'none',
                  borderRadius: 14,
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: C.textDark,
                  cursor: 'pointer',
                }}
              >
                View Treasures
              </button>
              <button
                type="button"
                onClick={() => navigate('/hunt')}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  background: 'transparent',
                  border: `2px solid ${C.neutralDark}`,
                  borderRadius: 14,
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.textMuted,
                  cursor: 'pointer',
                }}
              >
                ← Back to map
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
