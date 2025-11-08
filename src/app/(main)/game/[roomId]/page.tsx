'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useRoom } from '@/hooks/use-room'
import { useAuth } from '@/hooks/use-auth'
import { useGameStore } from '@/stores/game-store'
import { useTimer } from '@/hooks/use-timer'
import { useGameRealtime } from '@/hooks/use-game-realtime'
import { GameCard } from '@/components/game/game-card'
import { Timer } from '@/components/game/timer'
import { ProgressBar } from '@/components/game/progress-bar'
import { PartnerProgress } from '@/components/game/partner-progress'
import { Loader2 } from 'lucide-react'
import type { Question } from '@/types/game'
import { motion, AnimatePresence } from 'framer-motion'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { user } = useAuth()
  const { currentRoom } = useRoom()

  const {
    questions,
    currentQuestionIndex,
    responses,
    isLoading,
    error,
    isCompleted,
    initGame,
    submitResponse,
    setLoading,
    setError,
    nextQuestion,
  } = useGameStore()

  const [questionsData, setQuestionsData] = useState<Question[]>([])

  // Real-time partner tracking
  const { partnerProgress, isPartnerActive, roomStatus } = useGameRealtime(
    roomId,
    user?.id || ''
  )

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!currentRoom?.category_id) {
        setError('Category ID not found')
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/categories/${currentRoom.category_id}/questions`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }

        const data = await response.json()
        setQuestionsData(data.questions)
        initGame(roomId, currentRoom.category_id, data.questions)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Не удалось загрузить вопросы')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [currentRoom, roomId, initGame, setLoading, setError])

  // Timer hook
  const { timeRemaining, resetTimer } = useTimer({
    initialTime: 20,
    onTimeEnd: () => {
      // Auto-submit dislike when time runs out
      if (questions[currentQuestionIndex]) {
        handleSwipe('left')
      }
    },
  })

  // Handle swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    // Haptic feedback (Telegram)
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
    }

    const answer = direction === 'right' ? 1 : 0

    // Submit response to game store
    submitResponse(currentQuestion.id, answer)

    // Submit to backend
    submitResponseToBackend(currentQuestion.id, answer)

    // Reset timer for next question
    resetTimer(20)
  }

  // Submit response to backend
  const submitResponseToBackend = async (questionId: string, answer: 0 | 1) => {
    try {
      const response = await fetch(`/api/game/${roomId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answer,
          user_id: user?.id,
        }),
      })

      if (!response.ok) {
        console.error('Failed to submit response')
      }
    } catch (err) {
      console.error('Error submitting response:', err)
    }
  }

  // Redirect to results when game is complete
  useEffect(() => {
    if (isCompleted && responses.length === questions.length) {
      router.push(`/game/${roomId}/result`)
    }
  }, [isCompleted, responses.length, questions.length, roomId, router])

  // Loading state
  if (isLoading || !questionsData.length) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Загрузка вопросов...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // Error state
  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header with Progress and Timer */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-4 space-y-3">
            {/* User Progress and Timer */}
            <div className="flex items-center justify-between">
              {/* Progress Bar */}
              <ProgressBar
                current={currentQuestionIndex}
                total={questions.length}
                className="flex-1 mr-4"
              />

              {/* Timer */}
              <Timer timeRemaining={timeRemaining} totalTime={20} />
            </div>

            {/* Partner Progress */}
            {currentRoom?.guest_id && (
              <PartnerProgress
                progress={partnerProgress}
                total={questions.length}
                isActive={isPartnerActive}
              />
            )}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <AnimatePresence mode="wait">
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full"
              >
                <GameCard
                  question={currentQuestion}
                  onSwipe={handleSwipe}
                  disabled={isCompleted}
                />
              </motion.div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Нет доступных вопросов</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Question Counter */}
        <div className="fixed bottom-8 left-0 right-0 text-center">
          <p className="text-sm text-muted-foreground">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
