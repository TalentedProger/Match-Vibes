'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Trophy, ArrowLeft, Star, Flame, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useAchievements } from '@/hooks/use-achievements'
import { AchievementCard } from '@/components/achievements/achievement-card'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY_NAMES, type AchievementCategory } from '@/types/achievements'

type FilterType = 'all' | 'unlocked' | 'locked' | AchievementCategory

export default function AchievementsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { achievements, stats, isLoading } = useAchievements(user?.id)
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'all') return true
    if (filter === 'unlocked') return a.isUnlocked
    if (filter === 'locked') return !a.isUnlocked
    return a.category === filter
  })

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'unlocked', label: 'Получено' },
    { value: 'locked', label: 'В процессе' },
    ...Object.entries(CATEGORY_NAMES).map(([key, label]) => ({
      value: key as AchievementCategory,
      label,
    })),
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Достижения</h1>
                {stats && (
                  <p className="text-sm text-muted-foreground">
                    {stats.unlocked} из {stats.total} получено
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{stats?.totalXP || 0}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl p-4 text-center border border-yellow-500/30"
              >
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.unlocked}
                </div>
                <div className="text-xs text-muted-foreground">Получено</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl p-4 text-center border border-purple-500/30"
              >
                <Star className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalXP}
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl p-4 text-center border border-green-500/30"
              >
                <Flame className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.completionPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">Прогресс</div>
              </motion.div>
            </div>
          )}

          {/* Progress Bar */}
          {stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Общий прогресс</span>
                <span className="font-medium">
                  {stats.unlocked}/{stats.total}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionPercentage}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Achievements List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="h-32 bg-card rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {filter === 'unlocked'
                  ? 'Пока нет полученных достижений'
                  : 'Нет достижений в этой категории'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {filteredAchievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
