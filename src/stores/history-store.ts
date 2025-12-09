import { create } from 'zustand'
import type { GameHistoryItem } from '@/types/stats'

interface HistoryState {
  history: GameHistoryItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  total: number
  offset: number
  lastFetchedUserId: string | null
  lastFetchedAt: number | null

  // Actions
  setHistory: (history: GameHistoryItem[]) => void
  appendHistory: (items: GameHistoryItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setHasMore: (hasMore: boolean) => void
  setTotal: (total: number) => void
  setOffset: (offset: number) => void
  fetchHistory: (userId: string, reset?: boolean) => Promise<void>
  loadMore: (userId: string) => Promise<void>
  refetch: (userId: string) => Promise<void>
  reset: () => void
}

const ITEMS_PER_PAGE = 10
const CACHE_DURATION = 60000 // 1 minute cache

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  error: null,
  hasMore: false,
  total: 0,
  offset: 0,
  lastFetchedUserId: null,
  lastFetchedAt: null,

  setHistory: history => set({ history }),
  appendHistory: items =>
    set(state => ({ history: [...state.history, ...items] })),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
  setHasMore: hasMore => set({ hasMore }),
  setTotal: total => set({ total }),
  setOffset: offset => set({ offset }),

  fetchHistory: async (userId: string, reset: boolean = false) => {
    const state = get()

    // Проверяем кэш - если данные свежие и для того же пользователя, пропускаем
    const now = Date.now()
    if (
      !reset &&
      state.lastFetchedUserId === userId &&
      state.lastFetchedAt &&
      now - state.lastFetchedAt < CACHE_DURATION &&
      state.history.length > 0
    ) {
      return
    }

    const currentOffset = reset ? 0 : state.offset
    set({ isLoading: true, error: null })

    try {
      const response = await fetch(
        `/api/history?userId=${userId}&limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }

      const data = await response.json()

      if (reset) {
        set({
          history: data.history,
          offset: ITEMS_PER_PAGE,
          total: data.total,
          hasMore: data.hasMore,
          isLoading: false,
          lastFetchedUserId: userId,
          lastFetchedAt: Date.now(),
        })
      } else {
        set(state => ({
          history: [...state.history, ...data.history],
          offset: state.offset + ITEMS_PER_PAGE,
          total: data.total,
          hasMore: data.hasMore,
          isLoading: false,
          lastFetchedUserId: userId,
          lastFetchedAt: Date.now(),
        }))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      set({ error: message, isLoading: false })
      console.error('Error fetching history:', err)
    }
  },

  loadMore: async (userId: string) => {
    const state = get()
    if (!state.isLoading && state.hasMore) {
      await state.fetchHistory(userId, false)
    }
  },

  refetch: async (userId: string) => {
    set({ offset: 0 })
    await get().fetchHistory(userId, true)
  },

  reset: () =>
    set({
      history: [],
      isLoading: false,
      error: null,
      hasMore: false,
      total: 0,
      offset: 0,
      lastFetchedUserId: null,
      lastFetchedAt: null,
    }),
}))
