'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Sparkles, Users, Heart, AlertCircle } from 'lucide-react'

export default function Home() {
  const { user, isAuthenticated, isLoading, isTelegramEnv } = useAuth()
  const router = useRouter()

  const handleStartGame = () => {
    if (isAuthenticated || isTelegramEnv) {
      router.push('/categories')
    } else {
      console.log('Please open this app through Telegram Mini App')
    }
  }

  const buttonText = isLoading
    ? 'Загрузка...'
    : !isTelegramEnv
      ? 'Открыть в Telegram'
      : 'Погнали! 🚀'

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="text-center space-y-6 sm:space-y-8 max-w-md w-full">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-xl">
          <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            MatchVibe
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Найди общий вайб с друзьями
          </p>
        </div>

        {/* Welcome Message */}
        {isAuthenticated && user && (
          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <p className="text-base sm:text-lg text-foreground">
              Привет,{' '}
              <span className="font-semibold">
                {user.firstName || user.username}
              </span>
              ! 👋
            </p>
          </div>
        )}

        {/* Warning for non-Telegram environment */}
        {!isTelegramEnv && !isLoading && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground text-left">
              Для полного функционала откройте приложение через Telegram Mini
              App
            </p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Играй и узнавай
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Свайпай карточки и находи совпадения
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Приглашай друзей
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Создай комнату и пригласи партнёра
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Найди совпадения
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Узнай, в чём вы похожи
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {buttonText}
        </button>

        {/* Status */}
        {!isAuthenticated && !isLoading && isTelegramEnv && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Инициализация...
          </p>
        )}
      </div>
    </main>
  )
}
