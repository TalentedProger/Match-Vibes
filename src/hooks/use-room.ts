import { useEffect, useCallback } from 'react'
import { useRoomStore } from '@/stores/room-store'
import { useAuth } from './use-auth'

export function useRoom() {
  const { user } = useAuth()
  const {
    currentRoom,
    isHost,
    isLoading,
    error,
    invitationCode,
    setRoom,
    setIsHost,
    setLoading,
    setError,
    createRoom,
    joinRoom,
    leaveRoom,
    refreshRoom,
    clearRoom,
  } = useRoomStore()

  // Auto-refresh room when status changes
  useEffect(() => {
    if (currentRoom && currentRoom.status === 'waiting') {
      const interval = setInterval(() => {
        refreshRoom(currentRoom.id)
      }, 3000) // Refresh every 3 seconds

      return () => clearInterval(interval)
    }
  }, [currentRoom, refreshRoom])

  const handleCreateRoom = useCallback(
    async (categoryId: string, subcategoryId?: string) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      return await createRoom(categoryId, user.id, subcategoryId)
    },
    [user, createRoom]
  )

  const handleJoinRoom = useCallback(
    async (code: string) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      return await joinRoom(code, user.id)
    },
    [user, joinRoom]
  )

  const getInvitationLink = useCallback(() => {
    if (!invitationCode) return null

    // Always use Telegram bot link for maximum compatibility
    const botUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'VibesMatch_bot'
    return `https://t.me/${botUsername}?start=invite_${invitationCode}`
  }, [invitationCode])

  const getTelegramShareLink = useCallback(() => {
    if (!invitationCode) return null

    // Create bot deep link
    const botUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'VibesMatch_bot'
    const botLink = `https://t.me/${botUsername}?start=invite_${invitationCode}`

    const shareText = encodeURIComponent(
      '🎮 Присоединяйся к игре в MatchVibe!\n\n' +
        '✨ Давай узнаем, насколько совпадают наши вкусы!\n\n' +
        '👇 Нажми на ссылку, чтобы присоединиться:'
    )

    return `https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${shareText}`
  }, [invitationCode])

  const getWebFallbackLink = useCallback(() => {
    if (!invitationCode) return null

    // Web fallback for cases where Telegram is not available
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    return `${appUrl}/join/${invitationCode}`
  }, [invitationCode])

  return {
    currentRoom,
    isHost,
    isLoading,
    error,
    invitationCode,
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    leaveRoom,
    refreshRoom,
    clearRoom,
    getInvitationLink,
    getTelegramShareLink,
    getWebFallbackLink,
    isWaiting: currentRoom?.status === 'waiting',
    isReady: currentRoom?.status === 'ready',
    isPlaying: currentRoom?.status === 'playing',
    isCompleted: currentRoom?.status === 'completed',
  }
}
