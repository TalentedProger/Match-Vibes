import { create } from 'zustand'
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
  clearGame: () => void
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

// No persistence - fresh state each session to avoid bugs
export const useGameStore = create<GameState>()((set, get) => ({
  ...initialState,

  initGame: (roomId, categoryId, questions) => {
    console.log('initGame called with:', {
      roomId,
      categoryId,
      questionsCount: questions.length,
    })

    // Always start fresh when initializing a game
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
    const { currentQuestionIndex, questions, responses } = get()
    const nextIndex = currentQuestionIndex + 1

    console.log('nextQuestion called:', {
      currentIndex: currentQuestionIndex,
      nextIndex,
      totalQuestions: questions.length,
      responsesCount: responses.length,
    })

    // Only mark as completed when we've answered ALL questions
    if (nextIndex >= questions.length) {
      // Verify all questions have been answered
      if (responses.length >= questions.length) {
        console.log('Game completed! All questions answered.')
        set({ isCompleted: true })
      } else {
        console.log('Reached end but not all questions answered yet')
        // Stay on last question
      }
    } else {
      set({
        currentQuestionIndex: nextIndex,
        timeRemaining: 20,
      })
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
    const { responses, questions, currentQuestionIndex } = get()

    console.log('submitResponse called:', {
      questionId,
      answer,
      currentIndex: currentQuestionIndex,
      totalQuestions: questions.length,
      currentResponsesCount: responses.length,
    })

    const newResponse: GameResponse = {
      question_id: questionId,
      answer,
      timestamp: Date.now(),
    }

    // Remove previous response for same question if exists
    const filteredResponses = responses.filter(
      r => r.question_id !== questionId
    )

    const updatedResponses = [...filteredResponses, newResponse]

    set({
      responses: updatedResponses,
    })

    // Check if this was the last question
    const isLastQuestion = currentQuestionIndex >= questions.length - 1
    const allAnswered = updatedResponses.length >= questions.length

    console.log('After submit:', {
      isLastQuestion,
      allAnswered,
      responsesCount: updatedResponses.length,
    })

    if (isLastQuestion && allAnswered) {
      // Game completed
      console.log('Game completed after last answer!')
      set({ isCompleted: true })
    } else if (!isLastQuestion) {
      // Move to next question
      get().nextQuestion()
    }
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

  clearGame: () => {
    console.log('Clearing game state')
    set(initialState)
  },

  setError: error => {
    set({ error })
  },

  setLoading: loading => {
    set({ isLoading: loading })
  },
}))
