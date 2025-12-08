'use client'

import { useAuth } from '@/hooks/use-auth'
import { useGameHistory } from '@/hooks/use-game-history'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Users,
  Heart,
  AlertCircle,
  BarChart3,
  Clock,
} from 'lucide-react'
import { GameHistoryCarousel } from '@/components/history'
import Link from 'next/link'

export default function Home() {
  const { user, isAuthenticated, isLoading, isTelegramEnv } = useAuth()
  const { history, isLoading: isLoadingHistory } = useGameHistory(
    user?.id || null
  )
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
    <main className="min-h-screen flex flex-col p-4 sm:p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-6 max-w-md w-full mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 pt-4">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
            <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              MatchVibe
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Найди общий вайб с друзьями
            </p>
          </div>

          {/* Welcome Message */}
          {isAuthenticated && user && (
            <div className="bg-card rounded-2xl p-3 shadow-sm inline-block">
              <p className="text-sm sm:text-base text-foreground">
                Привет,{' '}
                <span className="font-semibold">
                  {user.firstName || user.username}
                </span>
                ! 👋
              </p>
            </div>
          )}
        </div>

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

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {buttonText}
        </button>

        {/* Recent Games Carousel */}
        {isAuthenticated && (
          <GameHistoryCarousel
            games={history.slice(0, 5)}
            isLoading={isLoadingHistory && history.length === 0}
          />
        )}

        {/* Quick Links */}
        {isAuthenticated && (
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/stats"
              className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Статистика
                </p>
                <p className="text-xs text-muted-foreground">Ваши результаты</p>
              </div>
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">История</p>
                <p className="text-xs text-muted-foreground">Все игры</p>
              </div>
            </Link>
          </div>
        )}

        {/* Features - only show when not authenticated */}
        {!isAuthenticated && !isLoading && (
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Играй и узнавай
                </h3>
                <p className="text-xs text-muted-foreground">
                  Свайпай карточки и находи совпадения
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Приглашай друзей
                </h3>
                <p className="text-xs text-muted-foreground">
                  Создай комнату и пригласи партнёра
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Найди совпадения
                </h3>
                <p className="text-xs text-muted-foreground">
                  Узнай, в чём вы похожи
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {!isAuthenticated && !isLoading && isTelegramEnv && (
          <p className="text-xs text-muted-foreground text-center">
            Инициализация...
          </p>
        )}
      </div>
    </main>
  )
}
