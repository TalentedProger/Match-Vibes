import { create } from 'zustand'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes (categories rarely change)

interface CategoriesState {
  categories: Category[]
  isLoading: boolean
  error: string | null
  lastFetchedAt: number | null

  // Actions
  fetchCategories: (force?: boolean) => Promise<void>
  invalidateCache: () => void
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchCategories: async (force = false) => {
    const state = get()
    const now = Date.now()

    // Check cache - if data is fresh, skip
    if (
      !force &&
      state.categories.length > 0 &&
      state.lastFetchedAt &&
      now - state.lastFetchedAt < CACHE_DURATION
    ) {
      return
    }

    // If already loading, don't start another request
    if (state.isLoading) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/categories')

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      set({
        categories: data.categories || [],
        isLoading: false,
        lastFetchedAt: Date.now(),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      set({ error: message, isLoading: false })
      console.error('Error fetching categories:', err)
    }
  },

  invalidateCache: () => {
    set({ lastFetchedAt: null })
  },
}))
