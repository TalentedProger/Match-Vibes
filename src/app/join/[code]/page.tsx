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

      if (!isAuthenticated) {
        setError('Требуется аутентификация')
        return
      }

      if (!code) {
        setError('Неверный код приглашения')
        return
      }

      setIsJoining(true)
      try {
        const room = await joinRoom(code)
        // Navigate to waiting room
        router.push(`/game/${room.id}/waiting`)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Не удалось присоединиться к комнате'
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

          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  return null
}
