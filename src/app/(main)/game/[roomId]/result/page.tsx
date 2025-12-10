'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GameResultDisplay } from '@/components/game/game-result'
import { useMatchResult } from '@/hooks/use-match-result'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useGameRealtime } from '@/hooks/use-game-realtime'
import { WaitingForPartnerScreen } from '@/components/game/waiting-for-partner'

// States for the result page flow
type PageState =
  | 'loading' // Initial loading
  | 'waiting' // Waiting for partner to finish
  | 'calculating' // Both ready, calculating results
  | 'transitioning' // Smooth transition to results
  | 'result' // Showing results
  | 'error' // Error state

interface ReadinessData {
  ready: boolean
  resultExists: boolean
  progress: {
    host: { completed: boolean; count: number; percentage: number }
    guest: { completed: boolean; count: number; percentage: number }
    total: number
  }
  room: {
    status: string
    hostId: string
    guestId: string
  }
}

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { user } = useAuth()

  // Core result hook
  const {
    result,
    isLoading: isResultLoading,
    error: resultError,
    calculateMatch,
    fetchResult,
  } = useMatchResult(roomId)

  // Page state management
  const [pageState, setPageState] = useState<PageState>('loading')
  const [categoryName, setCategoryName] = useState<string>('Категория')
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Readiness state
  const [readiness, setReadiness] = useState<ReadinessData | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const calculationAttemptedRef = useRef(false)
  const isMountedRef = useRef(true)

  // Real-time partner tracking (for progress display)
  const { partnerProgress, isPartnerActive } = useGameRealtime(
    roomId,
    user?.id || ''
  )

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  // Fetch category name
  useEffect(() => {
    async function fetchCategory() {
      if (!result?.category_id) return
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('name')
        .eq('id', result.category_id)
        .single()
      if (data && isMountedRef.current) setCategoryName(data.name)
    }
    fetchCategory()
  }, [result?.category_id])

  // Fetch total questions count
  useEffect(() => {
    async function fetchQuestionCount() {
      const supabase = createClient()
      const { data: room } = await supabase
        .from('rooms')
        .select('category_id, subcategory_id')
        .eq('id', roomId)
        .single()

      if (!room) return

      let questionsQuery
      if (room.subcategory_id) {
        questionsQuery = supabase
          .from('questions')
          .select('id')
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
          .select('id')
          .in('subcategory_id', subcategoryIds)
          .eq('is_active', true)
      }

      const { data: questions } = await questionsQuery
      if (isMountedRef.current) setTotalQuestions(questions?.length || 0)
    }
    if (roomId) fetchQuestionCount()
  }, [roomId])

  // Check readiness function
  const checkReadiness =
    useCallback(async (): Promise<ReadinessData | null> => {
      try {
        const response = await fetch(`/api/game/${roomId}/readiness`)
        if (!response.ok) {
          throw new Error(`Readiness check failed: ${response.status}`)
        }
        const data: ReadinessData = await response.json()
        if (isMountedRef.current) setReadiness(data)
        return data
      } catch (err) {
        console.error('Readiness check error:', err)
        return null
      }
    }, [roomId])

  // Calculate match results with smooth transition
  const performCalculation = useCallback(async () => {
    if (calculationAttemptedRef.current) return
    calculationAttemptedRef.current = true

    if (isMountedRef.current) setPageState('calculating')

    try {
      await calculateMatch()
      if (isMountedRef.current) {
        // Smooth transition to results
        setPageState('transitioning')
        setTimeout(() => {
          if (isMountedRef.current) setPageState('result')
        }, 600)
      }
    } catch (err) {
      console.error('Calculation error:', err)
      if (isMountedRef.current) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Ошибка расчёта результатов'
        )
      }
      // Try to fetch existing result
      await fetchResult()
    }
  }, [calculateMatch, fetchResult])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // Main flow logic
  useEffect(() => {
    if (!roomId) return

    // If we already have result, show it
    if (result) {
      setPageState('result')
      stopPolling()
      return
    }

    // Initial readiness check
    const initCheck = async () => {
      setPageState('loading')
      const data = await checkReadiness()

      if (!data || !isMountedRef.current) {
        setPageState('waiting')
        return
      }

      // If result already exists, fetch it
      if (data.resultExists) {
        await fetchResult()
        if (isMountedRef.current) {
          // Smooth transition to results
          setPageState('transitioning')
          setTimeout(() => {
            if (isMountedRef.current) setPageState('result')
          }, 600)
        }
        return
      }

      // If both ready, calculate
      if (data.ready) {
        await performCalculation()
        return
      }

      // Otherwise, wait and poll
      if (isMountedRef.current) setPageState('waiting')
    }

    initCheck()

    // Start polling for readiness - check every 2.5s (was 1.5s) for less load
    pollIntervalRef.current = setInterval(async () => {
      if (!isMountedRef.current) return
      if (calculationAttemptedRef.current) return

      const data = await checkReadiness()
      if (!data || !isMountedRef.current) return

      // If result exists, fetch it with smooth transition
      if (data.resultExists) {
        stopPolling()
        await fetchResult()
        if (isMountedRef.current) {
          setPageState('transitioning')
          setTimeout(() => {
            if (isMountedRef.current) setPageState('result')
          }, 600)
        }
        return
      }

      // If both ready, calculate with transition
      if (data.ready && !calculationAttemptedRef.current) {
        stopPolling()
        await performCalculation()
      }
    }, 2500)

    return () => {
      stopPolling()
    }
  }, [
    roomId,
    result,
    checkReadiness,
    fetchResult,
    performCalculation,
    stopPolling,
  ])

  // Update state when result loads
  useEffect(() => {
    if (result && pageState !== 'result') {
      setPageState('result')
      stopPolling()
    }
  }, [result, pageState, stopPolling])

  // Handle error from result hook
  useEffect(() => {
    if (resultError && pageState !== 'waiting' && pageState !== 'result') {
      setErrorMessage(resultError)
      if (!readiness?.ready) {
        setPageState('waiting')
      } else {
        setPageState('error')
      }
    }
  }, [resultError, pageState, readiness?.ready])

  const handlePlayAgain = useCallback(() => {
    router.push('/categories')
  }, [router])

  const handleRetry = useCallback(async () => {
    setPageState('loading')
    setErrorMessage(null)
    calculationAttemptedRef.current = false

    const data = await checkReadiness()
    if (data?.resultExists) {
      await fetchResult()
      setPageState('result')
    } else if (data?.ready) {
      await performCalculation()
    } else {
      setPageState('waiting')
    }
  }, [checkReadiness, fetchResult, performCalculation])

  // Calculate partner progress for display
  const getPartnerProgressForDisplay = useCallback(() => {
    if (!readiness || !user?.id) return partnerProgress
    const isHost = readiness.room.hostId === user.id
    return isHost
      ? readiness.progress.guest.count
      : readiness.progress.host.count
  }, [readiness, user?.id, partnerProgress])

  // ========== RENDER BASED ON STATE ==========

  // Loading state
  if (pageState === 'loading' || isResultLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Загружаем результаты...</p>
      </div>
    )
  }

  // Calculating state
  if (pageState === 'calculating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Подсчитываем совместимость...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Анализируем ваши ответы
        </p>
      </div>
    )
  }

  // Transitioning state - smooth fade to results
  if (pageState === 'transitioning') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <p className="text-lg font-medium">Готово!</p>
        <p className="text-sm text-muted-foreground mt-2">
          Показываем результаты...
        </p>
      </div>
    )
  }

  // Waiting for partner state
  if (pageState === 'waiting') {
    const currentProgress = getPartnerProgressForDisplay()
    const currentTotal = readiness?.progress.total || totalQuestions

    return (
      <WaitingForPartnerScreen
        partnerProgress={currentProgress}
        totalQuestions={currentTotal}
        isPartnerActive={isPartnerActive}
      />
    )
  }

  // Error state
  if (pageState === 'error' && errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {errorMessage}
        </p>
        <div className="flex gap-3">
          <Button onClick={handleRetry} variant="default">
            Попробовать снова
          </Button>
          <Button onClick={() => router.push('/')} variant="outline">
            На главную
          </Button>
        </div>
      </div>
    )
  }

  // Success state - show results
  if (pageState === 'result' && result) {
    return (
      <GameResultDisplay
        result={result}
        categoryName={categoryName}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground mt-4">Загрузка...</p>
    </div>
  )
}
