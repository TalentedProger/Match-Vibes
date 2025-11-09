'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import type { Question } from '@/types/game'

interface GameCardProps {
  question: Question
  onSwipe: (direction: 'left' | 'right') => void
  disabled?: boolean
}

const SWIPE_THRESHOLD = 100
const ROTATION_FACTOR = 0.1
const VELOCITY_THRESHOLD = 500

export function GameCard({
  question,
  onSwipe,
  disabled = false,
}: GameCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Calculate swipe indicators opacity
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false)

    const offsetX = info.offset.x
    const velocityX = info.velocity.x

    // Determine if swipe is strong enough
    if (
      Math.abs(offsetX) > SWIPE_THRESHOLD ||
      Math.abs(velocityX) > VELOCITY_THRESHOLD
    ) {
      if (offsetX > 0) {
        onSwipe('right') // Like
      } else {
        onSwipe('left') // Dislike
      }
    } else {
      // Snap back to center
      x.set(0)
    }
  }

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      style={{
        x,
        rotate,
        opacity,
        cursor: disabled ? 'default' : 'grab',
      }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      dragTransition={{
        bounceStiffness: 600,
        bounceDamping: 20,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Card */}
      <div className="relative aspect-[3/4] bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        {/* Image */}
        <div className="relative h-3/5 bg-gradient-to-br from-primary/10 to-secondary/10">
          {question.image_url ? (
            <img
              src={question.image_url}
              alt={question.text}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {question.text.charAt(0)}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="h-2/5 p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center">{question.text}</h2>
        </div>

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            {/* Like Indicator */}
            <motion.div
              className="absolute top-8 right-8 pointer-events-none"
              style={{ opacity: likeOpacity }}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/90 border-4 border-white shadow-lg">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
            </motion.div>

            {/* Dislike Indicator */}
            <motion.div
              className="absolute top-8 left-8 pointer-events-none"
              style={{ opacity: dislikeOpacity }}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/90 border-4 border-white shadow-lg">
                <X className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Swipe Hints (when not dragging) */}
      {!isDragging && !disabled && (
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4" />
            <span>Не нравится</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Нравится</span>
            <Heart className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
