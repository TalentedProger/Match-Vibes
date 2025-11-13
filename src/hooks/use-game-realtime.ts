'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface GameRealtimeState {
  partnerProgress: number
  roomStatus: string
  isPartnerActive: boolean
  lastUpdated: Date
}

export function useGameRealtime(roomId: string, userId: string) {
  const [state, setState] = useState<GameRealtimeState>({
    partnerProgress: 0,
    roomStatus: 'playing',
    isPartnerActive: false,
    lastUpdated: new Date(),
  })
  const [partnerId, setPartnerId] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId || !userId) return

    const supabase = createClient()
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      // Get room info to determine partner
      const { data: room } = await supabase
        .from('rooms')
        .select('host_id, guest_id, status')
        .eq('id', roomId)
        .single()

      if (!room) return

      const currentPartnerId =
        room.host_id === userId ? room.guest_id : room.host_id
      setPartnerId(currentPartnerId)

      // Subscribe to room changes
      channel = supabase
        .channel(`game:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`,
          },
          payload => {
            console.log('Room updated:', payload)
            if (
              payload.new &&
              typeof payload.new === 'object' &&
              'status' in payload.new
            ) {
              setState(prev => ({
                ...prev,
                roomStatus: payload.new.status as string,
              }))
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'responses',
            filter: `room_id=eq.${roomId}`,
          },
          async payload => {
            console.log('New response:', payload)
            // Count partner's responses
            const { data: responses } = await supabase
              .from('responses')
              .select('id')
              .eq('room_id', roomId)
              .eq('user_id', partnerId)

            setState(prev => ({
              ...prev,
              partnerProgress: responses?.length || 0,
              isPartnerActive: true,
              lastUpdated: new Date(),
            }))
          }
        )
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState()
          const isActive = Object.keys(presenceState).some(key =>
            presenceState[key]?.some((p: any) => p.user_id === partnerId)
          )
          setState(prev => ({
            ...prev,
            isPartnerActive: isActive,
            lastUpdated: new Date(),
          }))
        })
        .subscribe(async status => {
          if (status === 'SUBSCRIBED') {
            // Track user presence
            await channel.track({
              user_id: userId,
              online_at: new Date().toISOString(),
            })

            // Get initial partner progress
            if (currentPartnerId) {
              const { data: responses } = await supabase
                .from('responses')
                .select('id')
                .eq('room_id', roomId)
                .eq('user_id', currentPartnerId)

              setState(prev => ({
                ...prev,
                partnerProgress: responses?.length || 0,
                lastUpdated: new Date(),
              }))
            }
          }
        })
    }

    setupRealtime()

    // Periodic refresh of partner progress (fallback for missed realtime updates)
    const intervalId = setInterval(async () => {
      if (partnerId) {
        const { data: responses } = await supabase
          .from('responses')
          .select('id')
          .eq('room_id', roomId)
          .eq('user_id', partnerId)

        const currentProgress = responses?.length || 0
        setState(prev => {
          if (prev.partnerProgress !== currentProgress) {
            return {
              ...prev,
              partnerProgress: currentProgress,
              lastUpdated: new Date(),
            }
          }
          return prev
        })
      }
    }, 3000) // Check every 3 seconds

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
      clearInterval(intervalId)
    }
  }, [roomId, userId, partnerId])

  return state
}
