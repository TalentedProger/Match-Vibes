'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Grid, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useFavorites } from '@/hooks/use-favorites'
import { AuthGuard } from '@/components/auth/auth-guard'
import {
  FavoritesCategoryGroup,
  FavoritesEmptyState,
  FavoriteListItem,
} from '@/components/favorites'

export default function ProfileFavoritesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    favorites,
    byCategory,
    totalCount,
    isLoading,
    error,
    removeFavorite,
  } = useFavorites(user?.id || null)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemove = async (id: string) => {
    setRemovingId(id)
    await removeFavorite(id)
    setRemovingId(null)
  }

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col p-4 pb-20">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/profile')}
                className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-sm"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </motion.button>

              <div>
                <h1 className="text-xl font-bold text-foreground">Любимчики</h1>
                <p className="text-sm text-muted-foreground">
                  {totalCount} {getItemsWord(totalCount)}
                </p>
              </div>
            </div>

            {/* View Toggle */}
            {totalCount > 0 && (
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-14 bg-muted animate-pulse rounded-xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square bg-muted animate-pulse rounded-xl" />
                    <div className="aspect-square bg-muted animate-pulse rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && totalCount === 0 && <FavoritesEmptyState />}

          {/* Content */}
          {!isLoading && !error && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {viewMode === 'grid' ? (
                // Grid View - by categories
                byCategory.map(category => (
                  <FavoritesCategoryGroup
                    key={category.categoryId}
                    category={category}
                    onRemove={handleRemove}
                    removingId={removingId}
                  />
                ))
              ) : (
                // List View - flat list
                <div className="space-y-2">
                  {favorites.map(favorite => (
                    <FavoriteListItem
                      key={favorite.id}
                      favorite={favorite}
                      onRemove={handleRemove}
                      isRemoving={removingId === favorite.id}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </AuthGuard>
  )
}

function getItemsWord(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'элементов'
  }

  if (lastDigit === 1) {
    return 'элемент'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'элемента'
  }

  return 'элементов'
}
