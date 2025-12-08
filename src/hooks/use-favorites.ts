'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FavoritesResponse, Favorite } from '@/types/favorites'

export function useFavorites(userId: string | null) {
  const [data, setData] = useState<FavoritesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setData(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const addFavorite = useCallback(
    async (
      itemName: string,
      categoryId: string,
      imageUrl?: string
    ): Promise<boolean> => {
      if (!userId) return false

      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, itemName, categoryId, imageUrl }),
        })

        if (!response.ok) {
          throw new Error('Failed to add favorite')
        }

        // Обновляем локальное состояние
        await fetchFavorites()
        return true
      } catch (err) {
        console.error('Error adding favorite:', err)
        return false
      }
    },
    [userId, fetchFavorites]
  )

  const removeFavorite = useCallback(
    async (favoriteId: string): Promise<boolean> => {
      if (!userId) return false

      try {
        const response = await fetch(
          `/api/favorites?id=${favoriteId}&userId=${userId}`,
          {
            method: 'DELETE',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to remove favorite')
        }

        // Обновляем локальное состояние
        setData(prev => {
          if (!prev) return prev

          const updatedFavorites = prev.favorites.filter(
            f => f.id !== favoriteId
          )
          const updatedByCategory = prev.byCategory
            .map(cat => ({
              ...cat,
              items: cat.items.filter(item => item.id !== favoriteId),
            }))
            .filter(cat => cat.items.length > 0)

          return {
            ...prev,
            favorites: updatedFavorites,
            totalCount: updatedFavorites.length,
            byCategory: updatedByCategory,
          }
        })

        return true
      } catch (err) {
        console.error('Error removing favorite:', err)
        return false
      }
    },
    [userId]
  )

  const isFavorite = useCallback(
    (itemName: string, categoryId: string): boolean => {
      if (!data) return false
      return data.favorites.some(
        f => f.itemName === itemName && f.categoryId === categoryId
      )
    },
    [data]
  )

  const getFavoriteByItem = useCallback(
    (itemName: string, categoryId: string): Favorite | undefined => {
      if (!data) return undefined
      return data.favorites.find(
        f => f.itemName === itemName && f.categoryId === categoryId
      )
    },
    [data]
  )

  return {
    favorites: data?.favorites || [],
    byCategory: data?.byCategory || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch: fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByItem,
  }
}
