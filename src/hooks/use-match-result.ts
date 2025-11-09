import { useState, useEffect } from 'react'
import type { GameResult } from '@/types/game'

interface UseMatchResultReturn {
  result: GameResult | null
  isLoading: boolean
  error: string | null
  calculateMatch: () => Promise<void>
  fetchResult: () => Promise<void>
}

/**
 * Hook for calculating and fetching match results
 */
export function useMatchResult(roomId: string | null): UseMatchResultReturn {
  const [result, setResult] = useState<GameResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Calculate match for the room
   */
  const calculateMatch = async () => {
    if (!roomId) {
      setError('Room ID is required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/game/${roomId}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate match')
      }

      setResult(data.result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error calculating match:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fetch existing result for the room
   */
  const fetchResult = async () => {
    if (!roomId) {
      setError('Room ID is required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/game/${roomId}/calculate`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch result')
      }

      setResult(data.result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching result:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch result on mount if roomId exists
  useEffect(() => {
    if (roomId) {
      fetchResult()
    }
  }, [roomId])

  return {
    result,
    isLoading,
    error,
    calculateMatch,
    fetchResult,
  }
}
