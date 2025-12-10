'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface GameRealtimeState {
  partnerProgress: number
  roomStatus: string
  isPartnerActive: boolean
  isPartnerCompleted: boolean
  lastUpdated: Date
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

export function useGameRealtime(roomId: string, userId: string) {
  const [state, setState] = useState<GameRealtimeState>({
    partnerProgress: 0,
    roomStatus: 'playing',
    isPartnerActive: false,
    isPartnerCompleted: false,
    lastUpdated: new Date(),
  })

  const partnerIdRef = useRef<string | null>(null)
  const totalQuestionsRef = useRef<number>(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const lastProgressRef = useRef<number>(0)
  const isMountedRef = useRef(true)

  // Stable state updater with deduplication
  const updateProgress = useCallback((newProgress: number, isActive = true) => {
    if (!isMountedRef.current) return
    if (newProgress === lastProgressRef.current) return // Skip if same

    lastProgressRef.current = newProgress
    const isCompleted =
      totalQuestionsRef.current > 0 && newProgress >= totalQuestionsRef.current

    setState(prev => ({
      ...prev,
      partnerProgress: newProgress,
      isPartnerActive: isActive,
      isPartnerCompleted: isCompleted,
      lastUpdated: new Date(),
    }))
  }, [])

  // Debounced progress update to prevent rapid re-renders
  const debouncedUpdateProgress = useCallback(
    debounce((progress: number) => updateProgress(progress, true), 300),
    [updateProgress]
  )

  useEffect(() => {
    if (!roomId || !userId) return

    isMountedRef.current = true
    const supabase = createClient()

    const setupRealtime = async () => {
      // Get room info to determine partner and question count
      const { data: room } = await supabase
        .from('rooms')
        .select('host_id, guest_id, status, category_id, subcategory_id')
        .eq('id', roomId)
        .single()

      if (!room || !isMountedRef.current) return

      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      partnerIdRef.current = partnerId

      // Get total questions count
      let questionsQuery
      if (room.subcategory_id) {
        questionsQuery = supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('subcategory_id', room.subcategory_id)
          .eq('is_active', true)
      } else {
        const { data: subcategories } = await supabase
          .from('subcategories')
          .select('id')
          .eq('category_id', room.category_id)
        const subcategoryIds = subcategories?.map(s => s.id) || []
        questionsQuery = supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .in('subcategory_id', subcategoryIds)
          .eq('is_active', true)
      }

      const { count } = await questionsQuery
      totalQuestionsRef.current = count || 0

      // Get initial partner progress
      if (partnerId) {
        const { data: responses } = await supabase
          .from('responses')
          .select('id')
          .eq('room_id', roomId)
          .eq('user_id', partnerId)

        const initialProgress = responses?.length || 0
        lastProgressRef.current = initialProgress

        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            partnerProgress: initialProgress,
            roomStatus: room.status,
            isPartnerCompleted:
              totalQuestionsRef.current > 0 &&
              initialProgress >= totalQuestionsRef.current,
          }))
        }
      }

      // Subscribe to room changes only for status
      channelRef.current = supabase
        .channel(`game-optimized:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`,
          },
          payload => {
            if (!isMountedRef.current) return
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
          payload => {
            if (!isMountedRef.current) return
            // Only update if it's partner's response
            if (
              payload.new &&
              typeof payload.new === 'object' &&
              'user_id' in payload.new
            ) {
              if (payload.new.user_id === partnerIdRef.current) {
                // Increment progress instead of re-fetching
                const newProgress = lastProgressRef.current + 1
                debouncedUpdateProgress(newProgress)
              }
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    // Slower polling fallback - every 5 seconds instead of 3
    const intervalId = setInterval(async () => {
      if (!isMountedRef.current || !partnerIdRef.current) return

      const { data: responses } = await supabase
        .from('responses')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', partnerIdRef.current)

      const currentProgress = responses?.length || 0

      // Only update if different from last known value
      if (currentProgress !== lastProgressRef.current) {
        updateProgress(currentProgress, true)
      }
    }, 5000)

    return () => {
      isMountedRef.current = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      clearInterval(intervalId)
    }
  }, [roomId, userId, updateProgress, debouncedUpdateProgress])

  return state
}
