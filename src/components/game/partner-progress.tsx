'use client'

import { motion } from 'framer-motion'
import { User, Circle } from 'lucide-react'

interface PartnerProgressProps {
  progress: number
  total: number
  isActive: boolean
  className?: string
}

export function PartnerProgress({
  progress,
  total,
  isActive,
  className = '',
}: PartnerProgressProps) {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Avatar with status indicator */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        {/* Activity indicator */}
        <motion.div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
            isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
          animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Progress info */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground">Партнёр</span>
          <span className="text-xs text-muted-foreground">
            {progress}/{total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
