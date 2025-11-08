'use client'

import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useRoom } from '@/hooks/use-room'
import { useAuth } from '@/hooks/use-auth'
import { Gamepad2 } from 'lucide-react'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { user } = useAuth()
  const { currentRoom } = useRoom()

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-xl">
            <Gamepad2 className="h-12 w-12 text-white" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Игровая комната
            </h1>
            <p className="text-muted-foreground">
              Скоро здесь начнётся игра со свайпами карточек
            </p>
          </div>

          {/* Room Info */}
          {currentRoom && (
            <div className="bg-card rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-foreground mb-3">
                Информация о комнате:
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">ID:</span>{' '}
                  {currentRoom.id}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Статус:</span>{' '}
                  {currentRoom.status}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Категория:
                  </span>{' '}
                  {currentRoom.category_id}
                </p>
              </div>
            </div>
          )}

          {/* Placeholder Message */}
          <div className="bg-muted/50 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">
              💡 Stage 5: Interactive Card Game будет реализован следующим
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </AuthGuard>
  )
}
