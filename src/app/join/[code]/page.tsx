'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useRoom } from '@/hooks/use-room'
import { AlertCircle, Sparkles, Users, Heart } from 'lucide-react'

// CSS animations for joining page
const joiningStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(5deg); }
    75% { transform: translateY(5px) rotate(-5deg); }
  }
  
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.2; }
    100% { transform: scale(0.8); opacity: 0.5; }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .join-float { animation: float 3s ease-in-out infinite; }
  .join-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
  .join-spin-slow { animation: spin-slow 8s linear infinite; }
  .join-bounce-soft { animation: bounce-soft 1.5s ease-in-out infinite; }
  .join-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
  .join-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,80,120,0.3), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`

export default function JoinPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { joinRoom, isLoading: roomLoading } = useRoom()
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    const handleJoin = async () => {
      // Wait for authentication
      if (authLoading) return

      // Prevent double join attempts
      if (isJoining) return

      if (!code) {
        setError('Неверный код приглашения')
        return
      }

      // For unauthenticated users, show helpful message
      if (!isAuthenticated) {
        setError(
          'Для присоединения к игре требуется аутентификация.\n\n' +
            '👉 Вернитесь в чат с ботом и нажмите кнопку "Присоединиться к игре"'
        )
        return
      }

      setIsJoining(true)
      try {
        const room = await joinRoom(code)
        // Navigate to waiting room
        router.push(`/game/${room.id}/waiting`)
      } catch (err) {
        let message = 'Не удалось присоединиться к комнате'

        if (err instanceof Error) {
          // Handle specific error cases
          if (err.message.includes('User not found')) {
            message =
              'Пользователь не найден в системе.\n\n' +
              '👉 Вернитесь в чат с ботом и попробуйте снова'
          } else if (err.message.includes('Invalid invitation code')) {
            message =
              'Код приглашения недействителен.\n\n' +
              '• Комната не найдена или игра уже началась\n' +
              '• Попросите новое приглашение'
          } else if (err.message.includes('already full')) {
            message = 'Комната уже заполнена'
          } else if (err.message.includes('your own room')) {
            message = 'Нельзя присоединиться к своей комнате'
          } else {
            message = err.message
          }
        }

        setError(message)
        setIsJoining(false)
      }
    }

    handleJoin()
  }, [code, isAuthenticated, authLoading, joinRoom, router, isJoining])

  if (authLoading || roomLoading || isJoining) {
    return (
      <>
        <style>{joiningStyles}</style>
        <div className="h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating hearts */}
            <div
              className="absolute top-[15%] left-[10%] text-4xl opacity-20 join-float"
              style={{ animationDelay: '0s' }}
            >
              💕
            </div>
            <div
              className="absolute top-[25%] right-[15%] text-3xl opacity-15 join-float"
              style={{ animationDelay: '0.5s' }}
            >
              ✨
            </div>
            <div
              className="absolute bottom-[30%] left-[20%] text-3xl opacity-20 join-float"
              style={{ animationDelay: '1s' }}
            >
              💫
            </div>
            <div
              className="absolute bottom-[20%] right-[10%] text-4xl opacity-15 join-float"
              style={{ animationDelay: '1.5s' }}
            >
              🎯
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 join-fade-in-up">
            {/* Animated icon container */}
            <div className="relative mb-8">
              {/* Pulse rings */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 join-pulse-ring" />
              <div
                className="absolute inset-2 w-28 h-28 rounded-full bg-primary/15 join-pulse-ring"
                style={{ animationDelay: '0.3s' }}
              />
              <div
                className="absolute inset-4 w-24 h-24 rounded-full bg-primary/10 join-pulse-ring"
                style={{ animationDelay: '0.6s' }}
              />

              {/* Central icon */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 join-spin-slow" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                  <Users className="w-10 h-10 text-white join-bounce-soft" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Присоединяемся к игре
            </h1>

            {/* Subtitle with shimmer */}
            <div className="relative overflow-hidden rounded-lg px-6 py-2 mb-6">
              <div className="absolute inset-0 join-shimmer" />
              <p className="relative text-muted-foreground">
                Готовим комнату для вас...
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full bg-primary join-bounce-soft"
                style={{ animationDelay: '0s' }}
              />
              <div
                className="w-3 h-3 rounded-full bg-primary/70 join-bounce-soft"
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className="w-3 h-3 rounded-full bg-primary/50 join-bounce-soft"
                style={{ animationDelay: '0.3s' }}
              />
            </div>

            {/* Fun facts */}
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground/70">
              <Sparkles className="w-4 h-4 text-primary/50" />
              <span>Найдите общие интересы вместе!</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <style>{joiningStyles}</style>
        <div className="h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
          <div className="max-w-md w-full bg-card rounded-2xl p-8 text-center space-y-6 shadow-xl join-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Не удалось присоединиться
              </h1>
              <p className="text-muted-foreground whitespace-pre-line">
                {error}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const botUsername =
                    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
                    'VibesMatch_bot'
                  const botUrl = `https://t.me/${botUsername}`
                  window.open(botUrl, '_blank')
                }}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                🤖 Вернуться в бот
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
              >
                На главную страницу
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return null
}
