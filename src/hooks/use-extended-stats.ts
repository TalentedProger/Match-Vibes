import { useState, useEffect, useCallback } from 'react'
import type { ExtendedStats } from '@/types/stats'

interface UseExtendedStatsResult {
  stats: ExtendedStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useExtendedStats(
  userId: string | null
): UseExtendedStatsResult {
  const [stats, setStats] = useState<ExtendedStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stats/extended?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch extended stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Error fetching extended stats:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchStats()
    }
  }, [userId, fetchStats])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
