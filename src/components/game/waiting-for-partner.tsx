'use client'

import { motion } from 'framer-motion'
import { Users, Loader2, Clock, MessageCircleQuestion } from 'lucide-react'

interface WaitingForPartnerScreenProps {
  partnerProgress: number
  totalQuestions: number
  isPartnerActive: boolean
  className?: string
}

export function WaitingForPartnerScreen({
  partnerProgress,
  totalQuestions,
  isPartnerActive,
  className = '',
}: WaitingForPartnerScreenProps) {
  const partnerPercentage =
    totalQuestions > 0
      ? Math.round((partnerProgress / totalQuestions) * 100)
      : 0

  console.log('WaitingForPartnerScreen rendered:', {
    partnerProgress,
    totalQuestions,
    partnerPercentage,
    isPartnerActive,
  })

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-background/50 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="text-center max-w-md w-full"
      >
        {/* Main Icon with Animation - slower and more relaxed */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6 relative"
        >
          <Users className="w-12 h-12 text-primary" />

          {/* Pulsing ring effect - slower */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-full"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Ваш друг еще не закончил
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8 leading-relaxed"
        >
          Подождите немного, пока партнер завершит ответы на все вопросы
        </motion.p>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 mb-8"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Прогресс партнера
              </span>
              {/* Active indicator - slower pulse */}
              {isPartnerActive && (
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircleQuestion className="w-4 h-4" />
              <span>
                {partnerProgress}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Main Progress Bar */}
          <div className="relative">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary via-primary to-primary rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${partnerPercentage}%` }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
              >
                {/* Shimmer effect on progress - slower */}
                {partnerPercentage > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </motion.div>
            </div>

            {/* Percentage display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {partnerPercentage}%
              </div>
            </motion.div>
          </div>

          {/* Status Text */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            {isPartnerActive ? (
              <>
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  Сейчас отвечает
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Может быть неактивен
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Loading Animation - slower and calmer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          <motion.div
            animate={{
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Loader2 className="w-6 h-6 animate-[spin_3s_linear_infinite] text-primary" />
          </motion.div>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-sm font-medium text-muted-foreground"
          >
            Ожидание завершения...
          </motion.span>
        </motion.div>

        {/* Encouraging message */}
        {partnerPercentage > 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 text-xs text-primary font-medium bg-primary/10 rounded-full px-4 py-2"
          >
            Почти готово! 🎉
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
