'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useRoom } from '@/hooks/use-room'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle } from 'lucide-react'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Присоединяемся к комнате...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Не удалось присоединиться
            </h1>
            <p className="text-muted-foreground">{error}</p>
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
    )
  }

  return null
}
