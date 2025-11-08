'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  timeRemaining: number
  totalTime?: number
  onTimerEnd?: () => void
  isPaused?: boolean
}

export function Timer({
  timeRemaining,
  totalTime = 20,
  onTimerEnd,
  isPaused = false,
}: TimerProps) {
  const percentage = (timeRemaining / totalTime) * 100
  const isWarning = timeRemaining <= 5
  const isDanger = timeRemaining <= 3

  useEffect(() => {
    if (timeRemaining === 0 && onTimerEnd) {
      onTimerEnd()
    }
  }, [timeRemaining, onTimerEnd])

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-16 h-16 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r="28"
          className="stroke-muted"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          className={`transition-colors duration-300 ${
            isDanger
              ? 'stroke-red-500'
              : isWarning
                ? 'stroke-orange-500'
                : 'stroke-primary'
          }`}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 28}`}
          strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
          initial={false}
          animate={{
            strokeDashoffset: 2 * Math.PI * 28 * (1 - percentage / 100),
          }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </svg>
      {/* Timer text */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${
          isDanger
            ? 'text-red-500'
            : isWarning
              ? 'text-orange-500'
              : 'text-foreground'
        }`}
        animate={isDanger ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, repeat: isDanger ? Infinity : 0 }}
      >
        {timeRemaining}
      </motion.div>
    </div>
  )
}
