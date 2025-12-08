import { useState, useEffect, useCallback } from 'react'
import type { GameHistoryItem } from '@/types/stats'

interface UseGameHistoryResult {
  history: GameHistoryItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  total: number
  loadMore: () => Promise<void>
  refetch: () => Promise<void>
}

const ITEMS_PER_PAGE = 10

export function useGameHistory(userId: string | null): UseGameHistoryResult {
  const [history, setHistory] = useState<GameHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)

  const fetchHistory = useCallback(
    async (reset: boolean = false) => {
      if (!userId) return

      const currentOffset = reset ? 0 : offset
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/history?userId=${userId}&limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch history')
        }

        const data = await response.json()

        if (reset) {
          setHistory(data.history)
          setOffset(ITEMS_PER_PAGE)
        } else {
          setHistory(prev => [...prev, ...data.history])
          setOffset(prev => prev + ITEMS_PER_PAGE)
        }

        setTotal(data.total)
        setHasMore(data.hasMore)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching history:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [userId, offset]
  )

  useEffect(() => {
    if (userId) {
      fetchHistory(true)
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchHistory(false)
    }
  }, [fetchHistory, isLoading, hasMore])

  const refetch = useCallback(async () => {
    setOffset(0)
    await fetchHistory(true)
  }, [fetchHistory])

  return {
    history,
    isLoading,
    error,
    hasMore,
    total,
    loadMore,
    refetch,
  }
}
