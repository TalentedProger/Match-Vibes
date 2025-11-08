import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Room } from '@/types/room'

interface RoomState {
  currentRoom: Room | null
  isHost: boolean
  isLoading: boolean
  error: string | null
  invitationCode: string | null
  
  // Actions
  setRoom: (room: Room | null) => void
  setIsHost: (isHost: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInvitationCode: (code: string | null) => void
  createRoom: (categoryId: string, userId: string) => Promise<Room>
  joinRoom: (invitationCode: string, userId: string) => Promise<Room>
  leaveRoom: () => void
  refreshRoom: (roomId: string) => Promise<void>
  clearRoom: () => void
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      currentRoom: null,
      isHost: false,
      isLoading: false,
      error: null,
      invitationCode: null,

      setRoom: (room) => set({ currentRoom: room, error: null }),
      
      setIsHost: (isHost) => set({ isHost }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setInvitationCode: (code) => set({ invitationCode: code }),

      createRoom: async (categoryId: string, userId: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryId, userId }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to create room')
          }

          const { room } = await response.json()
          
          set({
            currentRoom: room,
            isHost: true,
            invitationCode: room.invitation_code,
            isLoading: false,
            error: null,
          })

          return room
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          set({
            currentRoom: null,
            isHost: false,
            isLoading: false,
            error: message,
          })
          throw error
        }
      },

      joinRoom: async (invitationCode: string, userId: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`/api/rooms/${invitationCode}/join`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to join room')
          }

          const { room } = await response.json()
          
          set({
            currentRoom: room,
            isHost: false,
            invitationCode: room.invitation_code,
            isLoading: false,
            error: null,
          })

          return room
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          set({
            currentRoom: null,
            isHost: false,
            isLoading: false,
            error: message,
          })
          throw error
        }
      },

      leaveRoom: () => {
        set({
          currentRoom: null,
          isHost: false,
          invitationCode: null,
          error: null,
        })
      },

      refreshRoom: async (roomId: string) => {
        try {
          const response = await fetch(`/api/rooms/${roomId}`)
          
          if (!response.ok) {
            throw new Error('Failed to refresh room')
          }

          const { room } = await response.json()
          set({ currentRoom: room })
        } catch (error) {
          console.error('Failed to refresh room:', error)
        }
      },

      clearRoom: () => {
        set({
          currentRoom: null,
          isHost: false,
          invitationCode: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'room-storage',
      partialize: (state) => ({
        currentRoom: state.currentRoom,
        isHost: state.isHost,
        invitationCode: state.invitationCode,
      }),
    }
  )
)
