'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Share2, PlayCircle, Trophy } from 'lucide-react'
import type { GameResult } from '@/types/game'
import { shareResult } from '@/lib/api/results'
import { useRouter } from 'next/navigation'

interface GameResultProps {
  result: GameResult
  categoryName: string
  onPlayAgain?: () => void
}

export function GameResultDisplay({
  result,
  categoryName,
  onPlayAgain,
}: GameResultProps) {
  const router = useRouter()
  const [displayPercentage, setDisplayPercentage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Animate percentage counter
  useEffect(() => {
    const target = result.match_percentage
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayPercentage(target)
        clearInterval(timer)

        // Show confetti for high matches
        if (target >= 70) {
          setShowConfetti(true)
        }
      } else {
        setDisplayPercentage(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [result.match_percentage])

  const handleShare = async () => {
    try {
      await shareResult(result, categoryName)
    } catch (error) {
      console.error('Failed to share result:', error)
    }
  }

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain()
    } else {
      router.push('/categories')
    }
  }

  const getMatchEmoji = (percentage: number) => {
    if (percentage >= 80) return '🔥'
    if (percentage >= 60) return '💫'
    if (percentage >= 40) return '✨'
    return '💭'
  }

  const getMatchMessage = (percentage: number) => {
    if (percentage >= 80) return 'Невероятное совпадение!'
    if (percentage >= 60) return 'Отличная совместимость!'
    if (percentage >= 40) return 'Есть общие интересы'
    return 'Разные вкусы - это интересно!'
  }

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted overflow-hidden">
      {showConfetti && <ConfettiEffect />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Ваши результаты</h1>
          <p className="text-muted-foreground">{categoryName}</p>
        </motion.div>

        {/* Match Percentage Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="text-6xl mb-4"
            >
              {getMatchEmoji(result.match_percentage)}
            </motion.div>
            <div className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              {displayPercentage}%
            </div>
            <p className="text-xl font-semibold text-muted-foreground">
              {getMatchMessage(result.match_percentage)}
            </p>
          </Card>
        </motion.div>

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          {/* Your Favorite */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">👤</div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Ваш выбор</p>
                <p className="font-semibold">{result.host_favorite}</p>
              </div>
            </div>
          </Card>

          {/* Partner's Favorite */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">👥</div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Партнёр выбрал
                </p>
                <p className="font-semibold">{result.guest_favorite}</p>
              </div>
            </div>
          </Card>

          {/* Shared Item */}
          {result.shared_item && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">❤️</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Общий вайб
                    </p>
                    <p className="font-semibold">{result.shared_item}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-3"
        >
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться
          </Button>
          <Button onClick={handlePlayAgain} className="flex-1">
            <PlayCircle className="w-4 h-4 mr-2" />
            Играть снова
          </Button>
        </motion.div>

        {/* View Stats Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/stats')}
            className="text-muted-foreground"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Посмотреть статистику
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

/**
 * Confetti Effect Component
 */
function ConfettiEffect() {
  const particles = Array.from({ length: 50 })

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            backgroundColor: [
              '#FF5078', // primary
              '#6496FF', // secondary
              '#FFC864', // accent
              '#50C878', // success
            ][Math.floor(Math.random() * 4)],
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: 0,
            rotate: Math.random() * 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
