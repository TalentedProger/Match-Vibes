'use client'

import { memo, useMemo } from 'react'
import { Users, Clock, MessageCircleQuestion, Sparkles } from 'lucide-react'

interface WaitingForPartnerScreenProps {
  partnerProgress: number
  totalQuestions: number
  isPartnerActive: boolean
  className?: string
}

// Memoized component to prevent unnecessary re-renders
export const WaitingForPartnerScreen = memo(function WaitingForPartnerScreen({
  partnerProgress,
  totalQuestions,
  isPartnerActive,
  className = '',
}: WaitingForPartnerScreenProps) {
  // Memoize percentage calculation
  const partnerPercentage = useMemo(() => {
    if (totalQuestions <= 0) return 0
    return Math.round((partnerProgress / totalQuestions) * 100)
  }, [partnerProgress, totalQuestions])

  const isAlmostDone = partnerPercentage > 75

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5 ${className}`}
    >
      <div className="text-center max-w-md w-full waiting-fade-in">
        {/* Main Icon with CSS Animation */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6 relative waiting-breathe">
          <Users className="w-12 h-12 text-primary" />
          {/* Pulsing ring - CSS only */}
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full waiting-ping-slow" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Ваш друг еще не закончил
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Подождите немного, пока партнер завершит ответы
        </p>

        {/* Progress Section - stable, no motion */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-6 shadow-lg">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Прогресс партнера
              </span>
              {/* Active indicator */}
              {isPartnerActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full waiting-pulse-slow" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircleQuestion className="w-4 h-4" />
              <span className="font-medium tabular-nums">
                {partnerProgress}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress Bar - CSS transitions only */}
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary via-primary to-primary rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(partnerPercentage, 100)}%` }}
            >
              {/* Shimmer effect - CSS only */}
              {partnerPercentage > 0 && (
                <div className="absolute inset-0 waiting-shimmer" />
              )}
            </div>
          </div>

          {/* Percentage badge */}
          <div className="mt-3 flex justify-center">
            <div className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full tabular-nums">
              {partnerPercentage}%
            </div>
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
                  Ожидание активности
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loading indicator - calm CSS animation */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-primary/60 rounded-full waiting-bounce-dot"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-primary/60 rounded-full waiting-bounce-dot"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2 h-2 bg-primary/60 rounded-full waiting-bounce-dot"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <span className="text-sm font-medium">Ожидание завершения</span>
        </div>

        {/* Almost done message */}
        {isAlmostDone && (
          <div className="mt-6 waiting-fade-in">
            <div className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4" />
              <span>Почти готово!</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS animations - using global styles to avoid styled-jsx issues */}
      <style>{`
        @keyframes waiting-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes waiting-ping-slow {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        
        @keyframes waiting-pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes waiting-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes waiting-bounce-dot {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        
        @keyframes waiting-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .waiting-breathe {
          animation: waiting-breathe 4s ease-in-out infinite;
        }
        
        .waiting-ping-slow {
          animation: waiting-ping-slow 3s ease-in-out infinite;
        }
        
        .waiting-pulse-slow {
          animation: waiting-pulse-slow 2s ease-in-out infinite;
        }
        
        .waiting-fade-in {
          animation: waiting-fade-in 0.5s ease-out forwards;
        }
        
        .waiting-bounce-dot {
          animation: waiting-bounce-dot 1.4s ease-in-out infinite;
        }
        
        .waiting-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: waiting-shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
})
