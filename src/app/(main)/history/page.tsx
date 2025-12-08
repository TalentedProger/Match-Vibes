'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { useGameHistory } from '@/hooks/use-game-history'
import { motion } from 'framer-motion'
import { ChevronLeft, RefreshCw, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { GameHistoryItem } from '@/types/stats'

export default function HistoryPage() {
  const { user } = useAuth()
  const { history, isLoading, error, hasMore, total, loadMore, refetch } =
    useGameHistory(user?.id || null)
  const router = useRouter()

  const handleGameClick = (game: GameHistoryItem) => {
    router.push(`/game/${game.roomId}/result`)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  История игр
                </h1>
                {total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {total} {getGamesWord(total)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-6">
          {isLoading && history.length === 0 ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : history.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {/* Games List */}
              <div className="space-y-3">
                {history.map((game, index) => (
                  <motion.button
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleGameClick(game)}
                    className="w-full bg-card rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Match Percentage Circle */}
                      <div
                        className={`
                        w-16 h-16 rounded-full flex flex-col items-center justify-center
                        ${getMatchBgColor(game.matchPercentage)}
                      `}
                      >
                        <span className="text-xl font-bold text-white">
                          {game.matchPercentage}%
                        </span>
                      </div>

                      {/* Game Info */}
                      <div className="flex-1 min-w-0">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{game.categoryIcon}</span>
                          <span className="font-semibold text-foreground">
                            {game.categoryName}
                          </span>
                        </div>

                        {/* Partner */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Users className="w-4 h-4" />
                          <span>
                            с{' '}
                            {game.partnerFirstName ||
                              game.partnerUsername ||
                              'партнёром'}
                          </span>
                        </div>

                        {/* Shared Item */}
                        {game.sharedItem && (
                          <p className="text-sm text-primary truncate">
                            💫 Общее: {game.sharedItem}
                          </p>
                        )}

                        {/* Date */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatFullDate(game.playedAt)}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-muted-foreground">
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full py-3 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-40 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">😕</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Не удалось загрузить историю
      </h2>
      <p className="text-muted-foreground mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Попробовать снова
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🎮</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        История пуста
      </h2>
      <p className="text-muted-foreground mb-6">
        Сыграйте первую игру, чтобы увидеть историю
      </p>
      <Link
        href="/categories"
        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Начать игру
      </Link>
    </div>
  )
}

function getMatchBgColor(percentage: number): string {
  if (percentage >= 70) return 'bg-gradient-to-br from-green-400 to-green-600'
  if (percentage >= 50) return 'bg-gradient-to-br from-amber-400 to-amber-600'
  return 'bg-gradient-to-br from-red-400 to-red-600'
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getGamesWord(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'игр'
  }

  if (lastDigit === 1) {
    return 'игра'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'игры'
  }

  return 'игр'
}
