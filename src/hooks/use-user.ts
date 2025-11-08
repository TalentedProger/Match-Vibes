import { useEffect } from 'react'
import { useUserStore } from '@/stores/user-store'
import { useAuth } from './use-auth'

export function useUser() {
  const { user } = useAuth()
  const {
    stats,
    isLoadingStats,
    setStats,
    fetchStats,
    incrementGamesPlayed,
    incrementMatches,
  } = useUserStore()

  useEffect(() => {
    // Fetch stats when user is authenticated
    if (user?.id && !stats && !isLoadingStats) {
      fetchStats(user.id)
    }
  }, [user?.id, stats, isLoadingStats, fetchStats])

  return {
    user,
    stats,
    isLoadingStats,
    setStats,
    fetchStats,
    incrementGamesPlayed,
    incrementMatches,
  }
}
