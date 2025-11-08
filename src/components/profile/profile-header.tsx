'use client'

import { useState } from 'react'
import { User } from '@/types/user'
import { Pencil } from 'lucide-react'

interface ProfileHeaderProps {
  user: User
  onEdit?: () => void
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const displayName = user.username || user.firstName || 'Пользователь'

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {displayName[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-foreground truncate">
              {displayName}
            </h2>
            {user.premiumStatus && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                Premium
              </span>
            )}
          </div>

          {user.firstName && user.lastName && (
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          )}

          {user.username && (
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          )}
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Редактировать профиль"
          >
            <Pencil className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
