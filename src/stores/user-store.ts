import { create } from 'zustand'
import type { UserStats } from '@/types/user'

const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

interface UserState {
  stats: UserStats | null
  isLoadingStats: boolean
  lastFetched: number | null
  currentUserId: string | null

  // Actions
  setStats: (stats: UserStats | null) => void
  setLoadingStats: (loading: boolean) => void
  fetchStats: (userId: string, force?: boolean) => Promise<void>
  incrementGamesPlayed: () => void
  incrementMatches: () => void
  invalidateCache: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  stats: null,
  isLoadingStats: false,
  lastFetched: null,
  currentUserId: null,

  setStats: stats => set({ stats }),

  setLoadingStats: loading => set({ isLoadingStats: loading }),

  fetchStats: async (userId: string, force = false) => {
    const state = get()
    const now = Date.now()

    // Check if we have cached data for the same user
    if (
      !force &&
      state.stats &&
      state.currentUserId === userId &&
      state.lastFetched &&
      now - state.lastFetched < CACHE_DURATION
    ) {
      // Return cached data, no re-fetch needed
      return
    }

    // If already loading, don't start another request
    if (state.isLoadingStats) {
      return
    }

    set({ isLoadingStats: true, currentUserId: userId })

    try {
      const response = await fetch(`/api/profile/stats?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const stats = await response.json()
      set({ stats, isLoadingStats: false, lastFetched: Date.now() })
    } catch (error) {
      console.error('Error fetching stats:', error)
      set({ isLoadingStats: false })
    }
  },

  invalidateCache: () => {
    set({ lastFetched: null })
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
