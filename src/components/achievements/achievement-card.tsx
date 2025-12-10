'use client'

import { motion } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import type { AchievementWithProgress } from '@/types/achievements'
import { RARITY_COLORS, RARITY_NAMES } from '@/types/achievements'

interface AchievementCardProps {
  achievement: AchievementWithProgress
  index?: number
}

export function AchievementCard({
  achievement,
  index = 0,
}: AchievementCardProps) {
  const {
    name,
    description,
    icon,
    rarity,
    requirement,
    progress,
    isUnlocked,
    progressPercentage,
    rewardXP,
  } = achievement

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isUnlocked ? 'bg-card shadow-lg' : 'bg-card/50'
      }`}
      style={{
        border: `${isUnlocked ? '0.5px' : '0.5px'} solid ${
          isUnlocked
            ? rarity === 'legendary'
              ? 'rgba(245, 158, 11, 0.5)'
              : rarity === 'epic'
                ? 'rgba(168, 85, 247, 0.5)'
                : rarity === 'rare'
                  ? 'rgba(59, 130, 246, 0.5)'
                  : 'hsl(var(--border))'
            : 'hsl(var(--border) / 0.3)'
        }`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon container */}
          <div
            className={`relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
              isUnlocked
                ? `bg-gradient-to-br ${RARITY_COLORS[rarity]} shadow-md`
                : 'bg-muted'
            }`}
          >
            {isUnlocked ? (
              <span className="drop-shadow-sm">{icon}</span>
            ) : (
              <Lock className="w-6 h-6 text-muted-foreground" />
            )}

            {/* Unlocked checkmark */}
            {isUnlocked && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-card">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold truncate ${
                  isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {name}
              </h3>
              <span
                className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${RARITY_COLORS[rarity]} text-white`}
              >
                {RARITY_NAMES[rarity]}
              </span>
            </div>

            <p
              className={`text-sm mt-1 ${
                isUnlocked
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/70'
              }`}
            >
              {description}
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  {isUnlocked ? (
                    <span className="text-green-500 font-medium">
                      Выполнено!
                    </span>
                  ) : (
                    `${progress} / ${requirement}`
                  )}
                </span>
                <span className="text-primary font-medium">+{rewardXP} XP</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{
                    delay: index * 0.05 + 0.2,
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    isUnlocked
                      ? 'from-green-400 to-green-500'
                      : RARITY_COLORS[rarity]
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect for unlocked */}
      {isUnlocked && (
        <div
          className={`absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-br ${RARITY_COLORS[rarity]}`}
        />
      )}
    </motion.div>
  )
}
