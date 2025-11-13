'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { InvitationLink } from '@/components/room/invitation-link'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useRoom } from '@/hooks/use-room'
import { useAuth } from '@/hooks/use-auth'
import { Users, X } from 'lucide-react'

export default function WaitingRoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string
  const { user } = useAuth()
  const {
    currentRoom,
    isHost,
    isLoading,
    isReady,
    isPlaying,
    refreshRoom,
    leaveRoom,
  } = useRoom()

  // Refresh room on mount
  useEffect(() => {
    if (roomId && !currentRoom) {
      refreshRoom(roomId)
    }
  }, [roomId, currentRoom, refreshRoom])

  // Redirect when room becomes ready
  useEffect(() => {
    if (isReady || isPlaying) {
      // Both players ready - start game
      router.push(`/game/${roomId}`)
    }
  }, [isReady, isPlaying, roomId, router])

  const handleLeave = () => {
    leaveRoom()
    router.push('/')
  }

  if (isLoading || !currentRoom) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {isHost ? 'Ждём партнёра' : 'Подключаемся...'}
          </h1>
          <button
            onClick={handleLeave}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Выйти"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          {/* Animation */}
          <div className="relative">
            {/* Animated circles */}
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {isHost ? 'Комната создана!' : 'Присоединились к комнате'}
            </h2>
            <p className="text-muted-foreground">
              {isHost
                ? 'Отправьте приглашение партнёру'
                : 'Ожидание начала игры...'}
            </p>
          </div>

          {/* Invitation Section (only for host) */}
          {isHost && currentRoom?.invitation_code && (
            <div className="w-full max-w-md">
              <InvitationLink invitationCode={currentRoom.invitation_code} />
            </div>
          )}

          {/* Players Status */}
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Игроки
            </h3>
            <div className="space-y-3">
              {/* Host */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Хост {isHost && '(Вы)'}
                  </p>
                  <p className="text-sm text-green-500">✓ Готов</p>
                </div>
              </div>

              {/* Guest */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    Партнёр {!isHost && '(Вы)'}
                  </p>
                  {currentRoom.guest_id ? (
                    <p className="text-sm text-green-500">✓ Готов</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Ожидание...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Button */}
          <button
            onClick={handleLeave}
            className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
          >
            Отменить
          </button>
        </div>
      </div>
    </AuthGuard>
  )
}
