import { useState, useEffect, useCallback } from 'react'
import type { AchievementWithProgress } from '@/types/achievements'

interface AchievementsStats {
  total: number
  unlocked: number
  totalXP: number
  completionPercentage: number
}

interface UseAchievementsResult {
  achievements: AchievementWithProgress[]
  stats: AchievementsStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAchievements(
  userId: string | undefined
): UseAchievementsResult {
  const [achievements, setAchievements] = useState<AchievementWithProgress[]>(
    []
  )
  const [stats, setStats] = useState<AchievementsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/achievements?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch achievements')
      }

      const data = await response.json()
      setAchievements(data.achievements || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('Error fetching achievements:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return {
    achievements,
    stats,
    isLoading,
    error,
    refetch: fetchAchievements,
  }
}
