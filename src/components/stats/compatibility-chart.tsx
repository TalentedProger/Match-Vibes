'use client'

import { motion } from 'framer-motion'
import type { CompatibilityDistribution } from '@/types/stats'

interface CompatibilityChartProps {
  distribution: CompatibilityDistribution[]
  avgCompatibility: number
}

const barColors = [
  'bg-red-400', // 0-20%
  'bg-orange-400', // 21-40%
  'bg-yellow-400', // 41-60%
  'bg-lime-400', // 61-80%
  'bg-green-400', // 81-100%
]

export function CompatibilityChart({
  distribution,
  avgCompatibility,
}: CompatibilityChartProps) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1)

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Распределение совместимости
        </h3>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">
            {avgCompatibility}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {distribution.map((item, index) => (
          <div key={item.range} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.range}</span>
              <span className="text-foreground font-medium">
                {item.count} игр
              </span>
            </div>
            <div className="h-6 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${barColors[index]} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / maxCount) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
