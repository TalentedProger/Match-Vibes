'use client'

import { motion } from 'framer-motion'
import type { CategoryStats } from '@/types/stats'

interface CategoryStatsChartProps {
  categories: CategoryStats[]
}

export function CategoryStatsChart({ categories }: CategoryStatsChartProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Статистика по категориям
        </h3>
        <p className="text-muted-foreground text-center py-4">
          Сыграйте несколько игр, чтобы увидеть статистику
        </p>
      </div>
    )
  }

  const maxGames = Math.max(...categories.map(c => c.gamesPlayed), 1)

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Статистика по категориям
      </h3>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.categoryId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.categoryIcon}</span>
                <span className="font-medium text-foreground">
                  {category.categoryName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {category.gamesPlayed} игр
                </span>
                <span className="font-semibold text-primary">
                  {category.avgCompatibility}%
                </span>
              </div>
            </div>

            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(category.gamesPlayed / maxGames) * 100}%`,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
