'use client'

import { useCallback, useEffect, useState } from 'react'

interface GameProgress {
  completed: boolean
  count: number
  percentage: number
}

interface GameReadiness {
  ready: boolean
  resultExists: boolean
  progress: {
    host: GameProgress
    guest: GameProgress
    total: number
  }
  room: {
    status: string
    hostId: string
    guestId: string
  }
}

interface UseGameReadinessReturn extends GameReadiness {
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastChecked: Date | null
}

export function useGameReadiness(
  roomId: string,
  options: {
    enabled?: boolean
    pollInterval?: number
    onReady?: () => void
  } = {}
): UseGameReadinessReturn {
  const {
    enabled = true,
    pollInterval = 3000, // 3 seconds
    onReady,
  } = options

  const [state, setState] = useState<Omit<UseGameReadinessReturn, 'refetch'>>({
    ready: false,
    resultExists: false,
    progress: {
      host: { completed: false, count: 0, percentage: 0 },
      guest: { completed: false, count: 0, percentage: 0 },
      total: 0,
    },
    room: {
      status: 'waiting',
      hostId: '',
      guestId: '',
    },
    isLoading: false,
    error: null,
    lastChecked: null,
  })

  const checkReadiness = useCallback(async (): Promise<void> => {
    if (!roomId || !enabled) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/game/${roomId}/readiness`)

      if (!response.ok) {
        throw new Error(`Failed to check readiness: ${response.status}`)
      }

      const data: GameReadiness = await response.json()

      setState(prev => ({
        ...prev,
        ...data,
        isLoading: false,
        lastChecked: new Date(),
      }))

      // Call onReady callback if both players are ready
      if (data.ready && !state.ready && onReady) {
        onReady()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date(),
      }))
    }
  }, [roomId, enabled, onReady, state.ready])

  // Initial check
  useEffect(() => {
    if (enabled && roomId) {
      checkReadiness()
    }
  }, [roomId, enabled, checkReadiness])

  // Polling
  useEffect(() => {
    if (!enabled || !roomId || pollInterval <= 0) return

    const intervalId = setInterval(() => {
      // Only continue polling if not ready and no result exists
      if (!state.ready && !state.resultExists) {
        checkReadiness()
      }
    }, pollInterval)

    return () => clearInterval(intervalId)
  }, [
    enabled,
    roomId,
    pollInterval,
    state.ready,
    state.resultExists,
    checkReadiness,
  ])

  return {
    ...state,
    refetch: checkReadiness,
  }
}
