'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { useExtendedStats } from '@/hooks/use-extended-stats'
import {
  StatsOverview,
  CompatibilityChart,
  CategoryStatsChart,
  TopPartnersList,
  FunFactsCard,
} from '@/components/stats'
import { RefreshCw, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function StatsPage() {
  const { user } = useAuth()
  const { stats, isLoading, error, refetch } = useExtendedStats(
    user?.id || null
  )

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-[56px] z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-foreground">Статистика</h1>
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
          {isLoading && !stats ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : stats ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 pb-6"
            >
              {/* Overview Stats */}
              <StatsOverview
                gamesPlayed={stats.gamesPlayed}
                matches={stats.matches}
                friends={stats.friends}
                avgCompatibility={stats.avgCompatibility}
                gamesThisWeek={stats.gamesThisWeek}
                gamesThisMonth={stats.gamesThisMonth}
                bestMatchPercentage={stats.bestMatchPercentage}
                likeRatio={stats.likeRatio}
              />

              {/* Fun Facts */}
              {stats.funFacts.length > 0 && (
                <FunFactsCard facts={stats.funFacts} />
              )}

              {/* Compatibility Distribution */}
              {stats.gamesPlayed > 0 && (
                <CompatibilityChart
                  distribution={stats.compatibilityDistribution}
                  avgCompatibility={stats.avgCompatibility}
                />
              )}

              {/* Category Stats */}
              <CategoryStatsChart categories={stats.categoryStats} />

              {/* Top Partners */}
              <TopPartnersList partners={stats.topPartners} />

              {/* Empty State */}
              {stats.gamesPlayed === 0 && <EmptyState />}
            </motion.div>
          ) : null}
        </div>
      </div>
    </AuthGuard>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-sm">
            <div className="h-4 w-20 bg-muted rounded mb-2" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <div className="h-5 w-48 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-6 bg-muted rounded" />
          ))}
        </div>
      </div>

      {/* Partners skeleton */}
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
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
        Не удалось загрузить статистику
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
    <div className="bg-card rounded-2xl p-8 shadow-sm text-center">
      <div className="text-5xl mb-4">🎮</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Пока нет данных
      </h2>
      <p className="text-muted-foreground mb-6">
        Сыграйте несколько игр, чтобы увидеть вашу статистику
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
