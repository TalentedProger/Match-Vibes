'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/use-room'
import { X, Loader2 } from 'lucide-react'

interface RoomCreatorProps {
  isOpen: boolean
  onClose: () => void
  categoryId: string
  subcategoryId?: string
}

export function RoomCreator({
  isOpen,
  onClose,
  categoryId,
  subcategoryId,
}: RoomCreatorProps) {
  const router = useRouter()
  const { createRoom, isLoading } = useRoom()
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCreate = async () => {
    setError(null)

    try {
      const room = await createRoom(categoryId)
      // Navigate to waiting room
      router.push(`/game/${room.id}/waiting`)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create room'
      setError(message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Создать комнату</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Вы создадите комнату и получите ссылку-приглашение для отправки
            партнёру.
          </p>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-muted text-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Создаём...
                </>
              ) : (
                'Создать'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
