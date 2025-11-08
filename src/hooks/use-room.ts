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
    async (categoryId: string) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      return await createRoom(categoryId, user.id)
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    return `${appUrl}/join/${invitationCode}`
  }, [invitationCode])

  const getTelegramShareLink = useCallback(() => {
    if (!invitationCode) return null

    const inviteLink = getInvitationLink()
    const text = encodeURIComponent('Присоединяйся к игре в MatchVibe! 🎮')
    return `https://t.me/share/url?url=${encodeURIComponent(inviteLink!)}&text=${text}`
  }, [invitationCode, getInvitationLink])

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
    isWaiting: currentRoom?.status === 'waiting',
    isReady: currentRoom?.status === 'ready',
    isPlaying: currentRoom?.status === 'playing',
    isCompleted: currentRoom?.status === 'completed',
  }
}
