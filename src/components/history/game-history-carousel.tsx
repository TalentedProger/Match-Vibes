'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { GameHistoryItem } from '@/types/stats'

interface GameHistoryCarouselProps {
  games: GameHistoryItem[]
  isLoading?: boolean
}

export function GameHistoryCarousel({
  games,
  isLoading,
}: GameHistoryCarouselProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground px-1">
          Недавние игры
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] h-[100px] bg-card rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return null
  }

  const handleGameClick = (game: GameHistoryItem) => {
    router.push(`/game/${game.roomId}/result`)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground px-1">
        Недавние игры
      </h3>

      <div
        className="flex gap-3 overflow-x-auto overflow-y-hidden -mx-4 px-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleGameClick(game)}
            className="flex-shrink-0 w-[160px] bg-card rounded-xl p-3 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            {/* Category Icon & Name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{game.categoryIcon}</span>
              <span className="text-xs text-muted-foreground truncate flex-1">
                {game.categoryName}
              </span>
            </div>

            {/* Match Percentage */}
            <div
              className={`text-2xl font-bold mb-1 ${getMatchColor(game.matchPercentage)}`}
            >
              {game.matchPercentage}%
            </div>

            {/* Partner */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] text-white font-bold overflow-hidden">
                {game.partnerAvatarUrl ? (
                  <img
                    src={game.partnerAvatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (
                    game.partnerFirstName?.[0] ||
                    game.partnerUsername?.[0] ||
                    '?'
                  ).toUpperCase()
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {game.partnerFirstName || game.partnerUsername || 'Партнёр'}
              </span>
            </div>

            {/* Date */}
            <p className="text-[10px] text-muted-foreground mt-1">
              {formatDate(game.playedAt)}
            </p>
          </motion.button>
        ))}

        {/* View All Button */}
        {games.length >= 5 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/history')}
            className="flex-shrink-0 w-[100px] bg-muted/50 rounded-xl p-3 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <span className="text-2xl mb-1">→</span>
            <span className="text-xs">Все игры</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}

function getMatchColor(percentage: number): string {
  if (percentage >= 70) return 'text-green-500'
  if (percentage >= 50) return 'text-yellow-500'
  return 'text-orange-500'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Сегодня'
  } else if (diffDays === 1) {
    return 'Вчера'
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`
  } else {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }
}
