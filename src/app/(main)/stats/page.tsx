'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { useUser } from '@/hooks/use-user'

export default function StatsPage() {
  const { stats, isLoadingStats } = useUser()

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Статистика</h1>

        {isLoadingStats ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка статистики...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Обзор
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Игр сыграно:</span>
                  <span className="text-2xl font-bold text-foreground">
                    {stats?.gamesPlayed || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Совпадений:</span>
                  <span className="text-2xl font-bold text-foreground">
                    {stats?.matches || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Друзей:</span>
                  <span className="text-2xl font-bold text-foreground">
                    {stats?.friends || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Compatibility */}
            {stats && stats.avgCompatibility > 0 && (
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Средняя совместимость
                </h2>
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-2">
                    {stats.avgCompatibility}%
                  </div>
                  <p className="text-muted-foreground">
                    С вашими партнёрами по играм
                  </p>
                </div>
              </div>
            )}

            {/* Placeholder for future features */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Скоро здесь появится больше
              </h2>
              <p className="text-muted-foreground">
                Графики совместимости, забавные факты и детальная аналитика
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
