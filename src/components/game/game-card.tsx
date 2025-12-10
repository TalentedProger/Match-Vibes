'use client'

import { useState, memo } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import type { Question } from '@/types/game'

interface GameCardProps {
  question: Question
  onSwipe: (direction: 'left' | 'right') => void
  disabled?: boolean
}

const SWIPE_THRESHOLD = 80
const VELOCITY_THRESHOLD = 400

export const GameCard = memo(function GameCard({
  question,
  onSwipe,
  disabled = false,
}: GameCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Calculate swipe indicators opacity
  const likeOpacity = useTransform(x, [0, 80], [0, 1])
  const dislikeOpacity = useTransform(x, [-80, 0], [1, 0])

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
    }
  }

  return (
    <motion.div
      className="relative w-full max-w-[360px] mx-auto touch-none"
      style={{
        x,
        rotate,
        opacity,
        cursor: disabled ? 'default' : 'grab',
      }}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragTransition={{
        bounceStiffness: 500,
        bounceDamping: 25,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Card - with aspect ratio 3:4 */}
      <div className="relative w-full aspect-[3/4.2] bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Image - Full Height */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10">
          {question.image_url ? (
            <img
              src={question.image_url}
              alt={question.text}
              className="w-full h-full object-cover"
              draggable={false}
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {question.text.charAt(0)}
            </div>
          )}
        </div>

        {/* Text Container - Semi-transparent overlay */}
        <div className="absolute bottom-0 left-0 right-0 mx-2 mb-2 bg-background/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-border/50">
          <h2 className="text-lg font-bold text-center leading-snug">
            {question.text}
          </h2>
        </div>

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            {/* Like Indicator */}
            <motion.div
              className="absolute top-4 right-4 pointer-events-none"
              style={{ opacity: likeOpacity }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/90 border-2 border-white shadow-lg">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
            </motion.div>

            {/* Dislike Indicator */}
            <motion.div
              className="absolute top-4 left-4 pointer-events-none"
              style={{ opacity: dislikeOpacity }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/90 border-2 border-white shadow-lg">
                <X className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
})
