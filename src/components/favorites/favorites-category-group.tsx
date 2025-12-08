'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Heart } from 'lucide-react'
import { FavoriteCard } from './favorite-card'
import type { FavoritesByCategory } from '@/types/favorites'

interface FavoritesCategoryGroupProps {
  category: FavoritesByCategory
  onRemove: (id: string) => void
  removingId?: string | null
  defaultExpanded?: boolean
}

export function FavoritesCategoryGroup({
  category,
  onRemove,
  removingId,
  defaultExpanded = true,
}: FavoritesCategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="space-y-3">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
            {category.categoryIcon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">
              {category.categoryName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {category.items.length} {getItemsWord(category.items.length)}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Items Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-2">
              <AnimatePresence mode="popLayout">
                {category.items.map(favorite => (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={onRemove}
                    isRemoving={removingId === favorite.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

// Empty state component
export function FavoritesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <Heart className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Нет избранного
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Лайкайте карточки во время игры, чтобы сохранить их в избранное
      </p>
    </motion.div>
  )
}
