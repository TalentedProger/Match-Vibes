import { useEffect, useCallback } from 'react'
import { useCategoriesStore } from '@/stores/categories-store'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

interface UseCategoriesResult {
  categories: Category[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCategories(): UseCategoriesResult {
  const { categories, isLoading, error, fetchCategories, invalidateCache } =
    useCategoriesStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const refetch = useCallback(async () => {
    invalidateCache()
    await fetchCategories(true)
  }, [fetchCategories, invalidateCache])

  return {
    categories,
    isLoading,
    error,
    refetch,
  }
}
