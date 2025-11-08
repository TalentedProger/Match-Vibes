import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question } from '@/types/game'

export interface GameResponse {
  question_id: string
  answer: 0 | 1 // 0 = dislike, 1 = like
  timestamp: number
}

interface GameState {
  // Current game session
  roomId: string | null
  categoryId: string | null
  questions: Question[]
  currentQuestionIndex: number
  responses: GameResponse[]

  // Timer state
  timeRemaining: number
  isPaused: boolean

  // UI state
  isLoading: boolean
  error: string | null
  isCompleted: boolean

  // Actions
  initGame: (roomId: string, categoryId: string, questions: Question[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitResponse: (questionId: string, answer: 0 | 1) => void
  setTimeRemaining: (time: number) => void
  pauseTimer: () => void
  resumeTimer: () => void
  completeGame: () => void
  resetGame: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

const initialState = {
  roomId: null,
  categoryId: null,
  questions: [],
  currentQuestionIndex: 0,
  responses: [],
  timeRemaining: 20,
  isPaused: false,
  isLoading: false,
  error: null,
  isCompleted: false,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initGame: (roomId, categoryId, questions) => {
        set({
          roomId,
          categoryId,
          questions,
          currentQuestionIndex: 0,
          responses: [],
          timeRemaining: 20,
          isPaused: false,
          isLoading: false,
          error: null,
          isCompleted: false,
        })
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get()
        if (currentQuestionIndex < questions.length - 1) {
          set({
            currentQuestionIndex: currentQuestionIndex + 1,
            timeRemaining: 20,
          })
        } else {
          // Game completed
          set({ isCompleted: true })
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({
            currentQuestionIndex: currentQuestionIndex - 1,
            timeRemaining: 20,
          })
        }
      },

      submitResponse: (questionId, answer) => {
        const { responses } = get()
        const newResponse: GameResponse = {
          question_id: questionId,
          answer,
          timestamp: Date.now(),
        }

        // Remove previous response for same question if exists
        const filteredResponses = responses.filter(
          r => r.question_id !== questionId
        )

        set({
          responses: [...filteredResponses, newResponse],
        })

        // Auto-advance to next question after response
        get().nextQuestion()
      },

      setTimeRemaining: time => {
        set({ timeRemaining: time })
      },

      pauseTimer: () => {
        set({ isPaused: true })
      },

      resumeTimer: () => {
        set({ isPaused: false })
      },

      completeGame: () => {
        set({ isCompleted: true })
      },

      resetGame: () => {
        set(initialState)
      },

      setError: error => {
        set({ error })
      },

      setLoading: loading => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'game-storage',
      // Only persist essential data
      partialize: state => ({
        roomId: state.roomId,
        categoryId: state.categoryId,
        currentQuestionIndex: state.currentQuestionIndex,
        responses: state.responses,
      }),
    }
  )
)
