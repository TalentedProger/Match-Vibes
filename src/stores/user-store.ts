import { create } from 'zustand'
import type { UserStats } from '@/types/user'

interface UserState {
  stats: UserStats | null
  isLoadingStats: boolean
  
  // Actions
  setStats: (stats: UserStats | null) => void
  setLoadingStats: (loading: boolean) => void
  fetchStats: (userId: string) => Promise<void>
  incrementGamesPlayed: () => void
  incrementMatches: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  stats: null,
  isLoadingStats: false,

  setStats: (stats) => set({ stats }),

  setLoadingStats: (loading) => set({ isLoadingStats: loading }),

  fetchStats: async (userId: string) => {
    set({ isLoadingStats: true })

    try {
      const response = await fetch(`/api/profile/stats?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const stats = await response.json()
      set({ stats, isLoadingStats: false })
    } catch (error) {
      console.error('Error fetching stats:', error)
      set({ isLoadingStats: false })
    }
  },

  incrementGamesPlayed: () => {
    const currentStats = get().stats
    if (currentStats) {
      set({
        stats: {
          ...currentStats,
          gamesPlayed: currentStats.gamesPlayed + 1,
        },
      })
    }
  },

  incrementMatches: () => {
    const currentStats = get().stats
    if (currentStats) {
      set({
        stats: {
          ...currentStats,
          matches: currentStats.matches + 1,
        },
      })
    }
  },
}))
