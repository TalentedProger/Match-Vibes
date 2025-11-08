'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Sparkles, Users, Heart } from 'lucide-react'

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const handleStartGame = () => {
    if (isAuthenticated) {
      router.push('/categories')
    } else {
      // In production, Telegram Mini App would provide auth automatically
      console.log('Authentication required')
    }
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-xl">
          <Heart className="h-12 w-12 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-foreground">MatchVibe</h1>
          <p className="text-xl text-muted-foreground">
            Найди общий вайб с друзьями
          </p>
        </div>

        {/* Welcome Message */}
        {isAuthenticated && user && (
          <div className="bg-card rounded-2xl p-4 shadow-sm">
            <p className="text-lg text-foreground">
              Привет, <span className="font-semibold">{user.firstName || user.username}</span>! 👋
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
              <h3 className="font-semibold text-foreground">Играй и узнавай</h3>
              <p className="text-sm text-muted-foreground">
                Свайпай карточки и находи совпадения
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Приглашай друзей</h3>
              <p className="text-sm text-muted-foreground">
                Создай комнату и пригласи партнёра
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Найди совпадения</h3>
              <p className="text-sm text-muted-foreground">
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
          className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 active:scale-95 transition-transform touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isLoading ? 'Загрузка...' : 'Погнали! 🚀'}
        </button>

        {/* Status */}
        {!isAuthenticated && !isLoading && (
          <p className="text-sm text-muted-foreground">
            Для начала игры требуется Telegram Mini App
          </p>
        )}
      </div>
    </main>
  )
}
