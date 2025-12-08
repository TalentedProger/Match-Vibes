'use client'

import { motion } from 'framer-motion'
import type { PartnerStats } from '@/types/stats'

interface TopPartnersListProps {
  partners: PartnerStats[]
}

export function TopPartnersList({ partners }: TopPartnersListProps) {
  if (partners.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Топ партнёров
        </h3>
        <p className="text-muted-foreground text-center py-4">
          Пока нет данных о партнёрах
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Топ партнёров по совместимости
      </h3>

      <div className="space-y-3">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
          >
            {/* Rank */}
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${
                index === 0
                  ? 'bg-yellow-500 text-yellow-950'
                  : index === 1
                    ? 'bg-gray-300 text-gray-700'
                    : index === 2
                      ? 'bg-amber-600 text-amber-100'
                      : 'bg-muted text-muted-foreground'
              }
            `}
            >
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
              {partner.avatarUrl ? (
                <img
                  src={partner.avatarUrl}
                  alt={partner.firstName || 'Partner'}
                  className="w-full h-full object-cover"
                />
              ) : (
                (
                  partner.firstName?.[0] ||
                  partner.username?.[0] ||
                  '?'
                ).toUpperCase()
              )}
            </div>

            {/* Name & Games */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {partner.firstName || partner.username || 'Аноним'}
              </p>
              <p className="text-xs text-muted-foreground">
                {partner.gamesPlayed} {getGamesWord(partner.gamesPlayed)}
              </p>
            </div>

            {/* Compatibility */}
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {partner.avgCompatibility}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
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
