'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsOverviewProps {
  gamesPlayed: number
  matches: number
  friends: number
  avgCompatibility: number
  gamesThisWeek: number
  gamesThisMonth: number
  bestMatchPercentage: number
  likeRatio: number
}

export function StatsOverview({
  gamesPlayed,
  matches,
  friends,
  avgCompatibility,
  gamesThisWeek,
  gamesThisMonth,
  bestMatchPercentage,
  likeRatio,
}: StatsOverviewProps) {
  const statCards = [
    {
      label: 'Игр сыграно',
      value: gamesPlayed,
      icon: '🎮',
      color: 'from-blue-500 to-blue-600',
      subValue: `${gamesThisWeek} за неделю`,
    },
    {
      label: 'Совпадений',
      value: matches,
      icon: '✨',
      color: 'from-purple-500 to-purple-600',
      subValue: null,
    },
    {
      label: 'Друзей',
      value: friends,
      icon: '👥',
      color: 'from-green-500 to-green-600',
      subValue: null,
    },
    {
      label: 'Средняя совместимость',
      value: `${avgCompatibility}%`,
      icon: '💫',
      color: 'from-pink-500 to-pink-600',
      subValue: `Лучшая: ${bestMatchPercentage}%`,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            {stat.subValue && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subValue}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Like ratio card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Соотношение лайков</p>
            <p className="text-xl font-bold text-foreground">{likeRatio}%</p>
          </div>
          <div className="flex items-center gap-2">
            {likeRatio >= 60 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : likeRatio <= 40 ? (
              <TrendingDown className="w-5 h-5 text-red-500" />
            ) : (
              <Minus className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"
                style={{ width: `${likeRatio}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-4 shadow-sm"
      >
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Активность
        </h4>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{gamesThisWeek}</p>
            <p className="text-xs text-muted-foreground">за неделю</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {gamesThisMonth}
            </p>
            <p className="text-xs text-muted-foreground">за месяц</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">всего</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
