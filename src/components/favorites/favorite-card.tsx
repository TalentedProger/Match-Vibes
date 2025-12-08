'use client'

import { motion } from 'framer-motion'
import { Heart, X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { Favorite } from '@/types/favorites'

interface FavoriteCardProps {
  favorite: Favorite
  onRemove: (id: string) => void
  isRemoving?: boolean
}

export function FavoriteCard({
  favorite,
  onRemove,
  isRemoving,
}: FavoriteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square">
          {favorite.imageUrl ? (
            <Image
              src={favorite.imageUrl}
              alt={favorite.itemName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs text-white">
              {favorite.categoryIcon} {favorite.categoryName}
            </span>
          </div>

          {/* Remove Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(favorite.id)}
            disabled={isRemoving}
            className="absolute top-2 right-2 w-8 h-8 bg-destructive/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            {isRemoving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <X className="h-4 w-4 text-white" />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-foreground text-sm line-clamp-2">
            {favorite.itemName}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(favorite.addedAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Compact version for lists
interface FavoriteListItemProps {
  favorite: Favorite
  onRemove: (id: string) => void
  isRemoving?: boolean
}

export function FavoriteListItem({
  favorite,
  onRemove,
  isRemoving,
}: FavoriteListItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-sm"
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        {favorite.imageUrl ? (
          <Image
            src={favorite.imageUrl}
            alt={favorite.itemName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground text-sm truncate">
          {favorite.itemName}
        </h3>
        <p className="text-xs text-muted-foreground">
          {favorite.categoryIcon} {favorite.categoryName}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(favorite.id)}
        disabled={isRemoving}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
      >
        {isRemoving ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </motion.div>
  )
}
