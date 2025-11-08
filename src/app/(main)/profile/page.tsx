'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileStats } from '@/components/profile/profile-stats'
import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/use-user'
import { Settings, Share2, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useAuth()
  const { stats, isLoadingStats } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        {user && (
          <ProfileHeader user={user} onEdit={() => setIsEditing(true)} />
        )}

        {/* Stats */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Статистика
          </h3>
          <ProfileStats stats={stats} isLoading={isLoadingStats} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Быстрые действия
          </h3>

          <Link
            href="/profile/favorites"
            className="flex items-center gap-3 p-4 bg-card rounded-xl hover:bg-muted transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">Любимчики</div>
              <div className="text-sm text-muted-foreground">
                Ваши любимые элементы
              </div>
            </div>
          </Link>

          <button className="flex items-center gap-3 p-4 bg-card rounded-xl hover:bg-muted transition-colors w-full">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Share2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Поделиться</div>
              <div className="text-sm text-muted-foreground">
                Поделитесь своим профилем
              </div>
            </div>
          </button>

          <Link
            href="/settings"
            className="flex items-center gap-3 p-4 bg-card rounded-xl hover:bg-muted transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-500/10 rounded-full flex items-center justify-center">
              <Settings className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">Настройки</div>
              <div className="text-sm text-muted-foreground">
                Управление аккаунтом
              </div>
            </div>
          </Link>
        </div>

        {/* Edit Modal would go here */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Редактировать профиль
              </h3>
              <p className="text-muted-foreground mb-4">
                Функция редактирования скоро появится
              </p>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
