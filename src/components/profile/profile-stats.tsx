'use client'

import { UserStats } from '@/types/user'
import { Trophy, Users, Target, Award } from 'lucide-react'

interface ProfileStatsProps {
  stats: UserStats | null
  isLoading?: boolean
}

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
            <div className="h-8 w-8 bg-muted rounded-full mb-2" />
            <div className="h-6 bg-muted rounded mb-1" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: 'Игр сыграно',
      value: stats?.gamesPlayed || 0,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Совпадений',
      value: stats?.matches || 0,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Друзей',
      value: stats?.friends || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Достижений',
      value: stats?.achievementsUnlocked || 0,
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 ${item.bgColor} rounded-full mb-2`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          )
        })}
      </div>

      {stats && stats.avgCompatibility > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.avgCompatibility}%
            </div>
            <div className="text-sm text-muted-foreground">
              Средняя совместимость
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
