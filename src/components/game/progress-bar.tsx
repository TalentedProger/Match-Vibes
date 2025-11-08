'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({
  current,
  total,
  className = '',
}: ProgressBarProps) {
  const dots = Array.from({ length: total }, (_, i) => i)

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {dots.map(index => (
        <motion.div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index < current
              ? 'bg-primary w-3'
              : index === current
                ? 'bg-primary/70 w-4'
                : 'bg-muted w-2'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: index === current ? 1.2 : 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        />
      ))}
    </div>
  )
}
