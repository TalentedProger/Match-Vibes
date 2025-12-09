import { useEffect, useCallback } from 'react'
import { useHistoryStore } from '@/stores/history-store'
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

export function useGameHistory(userId: string | null): UseGameHistoryResult {
  const {
    history,
    isLoading,
    error,
    hasMore,
    total,
    fetchHistory,
    loadMore: storeLoadMore,
    refetch: storeRefetch,
  } = useHistoryStore()

  useEffect(() => {
    if (userId) {
      fetchHistory(userId)
    }
  }, [userId, fetchHistory])

  const loadMore = useCallback(async () => {
    if (userId) {
      await storeLoadMore(userId)
    }
  }, [userId, storeLoadMore])

  const refetch = useCallback(async () => {
    if (userId) {
      await storeRefetch(userId)
    }
  }, [userId, storeRefetch])

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
