'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GameResultDisplay } from '@/components/game/game-result'
import { useMatchResult } from '@/hooks/use-match-result'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useGameRealtime } from '@/hooks/use-game-realtime'
import { motion } from 'framer-motion'
import { WaitingForPartnerScreen } from '@/components/game/waiting-for-partner'
import { useGameReadiness } from '@/hooks/use-game-readiness'

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { user } = useAuth()

  const { result, isLoading, error, calculateMatch, fetchResult } =
    useMatchResult(roomId)
  const [categoryName, setCategoryName] = useState<string>('Категория')
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationAttempted, setCalculationAttempted] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [waitingForPartner, setWaitingForPartner] = useState(true) // START with waiting - safer
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 10 // Maximum retry attempts
  const RETRY_INTERVAL = 5000 // 5 seconds between retries

  // Real-time partner tracking
  const { partnerProgress, isPartnerActive } = useGameRealtime(
    roomId,
    user?.id || ''
  )

  // Game readiness tracking - ALWAYS enabled to check readiness first
  const {
    ready: bothPlayersReady,
    progress,
    isLoading: readinessLoading,
    refetch: refetchReadiness,
  } = useGameReadiness(roomId, {
    enabled: !result && !isCalculating, // Stop polling when calculating or result exists
    pollInterval: 5000, // Check every 5 seconds to reduce load
    onReady: () => {
      console.log('useGameReadiness onReady callback - both players ready!')
      // Logic is handled in main useEffect, don't duplicate here
    },
  })

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

      if (data) {
        setCategoryName(data.name)
      }
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
      setTotalQuestions(questions?.length || 0)
    }
    if (roomId) {
      fetchQuestionCount()
    }
  }, [roomId])

  // SIMPLIFIED LOGIC: Avoid infinite loops with memoized callbacks
  const handleCalculationAttempt = useCallback(async () => {
    if (calculationAttempted || isCalculating) return

    console.log('Attempting calculation')
    setCalculationAttempted(true)
    setWaitingForPartner(false)
    setIsCalculating(true)

    try {
      await calculateMatch()
      console.log('Calculation successful!')
      setRetryCount(0)
    } catch (err: any) {
      console.error('Calculation failed:', err)
      setWaitingForPartner(true)
      setCalculationAttempted(false)
    } finally {
      setIsCalculating(false)
    }
  }, [calculationAttempted, isCalculating, calculateMatch])

  // Main decision logic - runs only when key states change
  useEffect(() => {
    // Skip if still loading
    if (isLoading || readinessLoading) {
      return
    }

    // If we already have result, don't do anything
    if (result) {
      console.log('Result exists, showing it')
      setWaitingForPartner(false)
      return
    }

    console.log('Decision logic:', {
      bothPlayersReady,
      waitingForPartner,
      calculationAttempted,
      progressReady: progress?.ready,
    })

    // If not ready, ensure we're in waiting state
    if (!bothPlayersReady && !waitingForPartner) {
      console.log('Setting waiting for partner')
      setWaitingForPartner(true)
      setCalculationAttempted(false)
      return
    }

    // If ready and not waiting and not attempted - calculate
    if (bothPlayersReady && !calculationAttempted && !isCalculating) {
      console.log('Both ready, triggering calculation')
      handleCalculationAttempt()
      return
    }
  }, [
    isLoading,
    result,
    readinessLoading,
    bothPlayersReady,
    waitingForPartner,
    calculationAttempted,
    isCalculating,
    handleCalculationAttempt,
  ])

  const handlePlayAgain = useCallback(() => {
    router.push('/categories')
  }, [router])

  const handleRetry = useCallback(async () => {
    console.log('Manual retry triggered')
    setWaitingForPartner(true)
    setCalculationAttempted(false)
    setRetryCount(0)
    setIsCalculating(false)

    // Force refresh readiness check
    await refetchReadiness()
  }, [refetchReadiness])

  // Loading state - also include readiness loading
  if (isLoading || isCalculating || readinessLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Подсчитываем результаты...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Анализируем ваши ответы
        </p>
      </div>
    )
  }

  // Waiting for partner state - PRIORITY: Show this instead of errors
  if (waitingForPartner && !result) {
    // Use progress from readiness API if available, fallback to realtime
    const currentProgress =
      progress?.total > 0
        ? user?.id === progress.room?.hostId
          ? progress.guest?.count || 0
          : progress.host?.count || 0
        : partnerProgress

    const currentTotal = progress?.total > 0 ? progress.total : totalQuestions

    console.log('Showing waiting screen:', {
      currentProgress,
      currentTotal,
      isPartnerActive,
    })

    return (
      <WaitingForPartnerScreen
        partnerProgress={currentProgress}
        totalQuestions={currentTotal}
        isPartnerActive={isPartnerActive}
      />
    )
  }

  // Error state - ONLY show if NOT waiting (waiting takes priority)
  if (error && !result && !waitingForPartner && !readinessLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {error}
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

  // Success state
  if (result) {
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
      <p className="text-muted-foreground">Загрузка результатов...</p>
    </div>
  )
}
