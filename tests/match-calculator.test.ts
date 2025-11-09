import { describe, it, expect } from 'vitest'
import {
  calculateMatch,
  validateResponses,
} from '@/lib/algorithms/match-calculator'
import type { Response, Question } from '@/types/game'

// Mock questions
const mockQuestions: Question[] = [
  {
    id: 'q1',
    category_id: 'cat1',
    text: 'Пицца',
    image_url: 'https://example.com/pizza.jpg',
    order_index: 0,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q2',
    category_id: 'cat1',
    text: 'Суши',
    image_url: 'https://example.com/sushi.jpg',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q3',
    category_id: 'cat1',
    text: 'Бургеры',
    image_url: 'https://example.com/burger.jpg',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'q4',
    category_id: 'cat1',
    text: 'Паста',
    image_url: 'https://example.com/pasta.jpg',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

describe('Match Calculator Algorithm', () => {
  describe('calculateMatch', () => {
    it('should calculate 100% match when all answers are identical', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r3',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q3',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r4',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q4',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r7',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q3',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r8',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q4',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions,
      })

      expect(result.matchPercentage).toBe(100)
      expect(result.matchedQuestions).toBe(4)
      expect(result.totalQuestions).toBe(4)
      expect(result.sharedItem).toBe('Пицца') // First shared like
    })

    it('should calculate 50% match with half matching answers', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r3',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q3',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r4',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q4',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r7',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q3',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r8',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q4',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions,
      })

      expect(result.matchPercentage).toBe(50)
      expect(result.matchedQuestions).toBe(2)
      expect(result.totalQuestions).toBe(4)
    })

    it('should calculate 0% match with completely opposite answers', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions.slice(0, 2),
      })

      expect(result.matchPercentage).toBe(0)
      expect(result.matchedQuestions).toBe(0)
    })

    it('should find shared item when both players like the same thing', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions.slice(0, 2),
      })

      expect(result.sharedItem).toBe('Суши')
    })

    it('should handle case when no shared likes exist', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions.slice(0, 2),
      })

      expect(result.sharedItem).not.toBeNull()
      expect(result.sharedItem).toContain('предпочтения')
    })

    it('should identify correct favorites for each player', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q2',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r5',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 0,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'r6',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q2',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const result = calculateMatch({
        hostResponses,
        guestResponses,
        questions: mockQuestions.slice(0, 2),
      })

      expect(result.hostFavorite).toBe('Пицца')
      expect(result.guestFavorite).toBe('Суши')
    })

    it('should throw error when no responses provided', () => {
      expect(() =>
        calculateMatch({
          hostResponses: [],
          guestResponses: [],
          questions: mockQuestions,
        })
      ).toThrow('Both players must have responses')
    })

    it('should throw error when no questions provided', () => {
      const hostResponses: Response[] = [
        {
          id: 'r1',
          room_id: 'room1',
          user_id: 'host',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      const guestResponses: Response[] = [
        {
          id: 'r2',
          room_id: 'room1',
          user_id: 'guest',
          question_id: 'q1',
          answer: 1,
          timestamp: new Date().toISOString(),
        },
      ]

      expect(() =>
        calculateMatch({
          hostResponses,
          guestResponses,
          questions: [],
        })
      ).toThrow('Questions are required')
    })
  })

  describe('validateResponses', () => {
    it('should validate complete responses', () => {
      const hostResponses: Response[] = Array.from({ length: 12 }, (_, i) => ({
        id: `r${i}`,
        room_id: 'room1',
        user_id: 'host',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const guestResponses: Response[] = Array.from({ length: 12 }, (_, i) => ({
        id: `r${i + 12}`,
        room_id: 'room1',
        user_id: 'guest',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const result = validateResponses(hostResponses, guestResponses, 12)

      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should detect incomplete host responses', () => {
      const hostResponses: Response[] = Array.from({ length: 8 }, (_, i) => ({
        id: `r${i}`,
        room_id: 'room1',
        user_id: 'host',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const guestResponses: Response[] = Array.from({ length: 12 }, (_, i) => ({
        id: `r${i + 12}`,
        room_id: 'room1',
        user_id: 'guest',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const result = validateResponses(hostResponses, guestResponses, 12)

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Host has incomplete responses')
    })

    it('should detect incomplete guest responses', () => {
      const hostResponses: Response[] = Array.from({ length: 12 }, (_, i) => ({
        id: `r${i}`,
        room_id: 'room1',
        user_id: 'host',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const guestResponses: Response[] = Array.from({ length: 5 }, (_, i) => ({
        id: `r${i + 12}`,
        room_id: 'room1',
        user_id: 'guest',
        question_id: `q${i}`,
        answer: 1,
        timestamp: new Date().toISOString(),
      }))

      const result = validateResponses(hostResponses, guestResponses, 12)

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Guest has incomplete responses')
    })
  })
})
