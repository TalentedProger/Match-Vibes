'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useRoom } from '@/hooks/use-room'
import { useAuth } from '@/hooks/use-auth'
import { useGameStore } from '@/stores/game-store'
import { useTimer } from '@/hooks/use-timer'
import { useGameRealtime } from '@/hooks/use-game-realtime'
import { useGameManager } from '@/hooks/use-game-manager'
import { GameCard } from '@/components/game/game-card'
import { PartnerProgress } from '@/components/game/partner-progress'
import { Loader2, MessageCircleQuestion, Clock } from 'lucide-react'
import type { Question } from '@/types/game'
import { motion, AnimatePresence } from 'framer-motion'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { user } = useAuth()
  const { currentRoom } = useRoom()

  // Game state manager (handles cleanup and prevents duplicates)
  useGameManager()

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

      // Prevent re-fetching if we already have questions for this room and category
      if (questions.length > 0 && roomId === currentRoom.id) {
        console.log('Questions already loaded for this room, skipping fetch')
        return
      }

      setLoading(true)
      console.log(
        'Fetching questions for room:',
        roomId,
        'category:',
        currentRoom.category_id
      )

      try {
        // Build URL with optional subcategory filter
        let url = `/api/categories/${currentRoom.category_id}/questions`
        if (currentRoom.subcategory_id) {
          url += `?subcategoryId=${currentRoom.subcategory_id}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }

        const data = await response.json()

        // Check if questions exist
        if (!data.questions || data.questions.length === 0) {
          setError('Нет доступных вопросов для этой категории')
          return
        }

        console.log('Raw questions from API:', data.questions.length)

        // Remove any potential duplicates from questions
        const uniqueQuestions = data.questions.filter(
          (q: Question, index: number, self: Question[]) =>
            index === self.findIndex(t => t.id === q.id)
        )

        console.log('Unique questions after filtering:', uniqueQuestions.length)

        initGame(roomId, currentRoom.category_id, uniqueQuestions)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Не удалось загрузить вопросы')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [
    currentRoom?.category_id,
    currentRoom?.subcategory_id,
    currentRoom?.id,
    roomId,
    questions.length,
    initGame,
    setLoading,
    setError,
  ])

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
  if (isLoading || !questions.length) {
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
        {/* Partner Progress (sticky at top) */}
        {currentRoom?.guest_id && (
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container max-w-2xl mx-auto px-4 py-3">
              <PartnerProgress
                progress={partnerProgress}
                total={questions.length}
                isActive={isPartnerActive}
              />
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2">
          {/* Question Counter and Timer Header */}
          <div className="w-full max-w-sm mx-auto mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold text-foreground">
                Вопрос:{' '}
                <span className="text-primary">{currentQuestionIndex + 1}</span>
                /{questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold text-foreground">
                Время:{' '}
                <span className="text-primary font-bold">
                  {timeRemaining}сек
                </span>
              </span>
            </div>
          </div>
          {/* Card */}
          <AnimatePresence mode="wait">
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="w-full max-w-[340px] mx-auto"
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
      </div>
    </AuthGuard>
  )
}
