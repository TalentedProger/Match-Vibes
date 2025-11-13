'use client'

import { useEffect, useState } from 'react'
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

  const {
    ready: bothPlayersReady,
    progress,
    isLoading: readinessLoading,
    refetch: refetchReadiness,
  } = useGameReadiness(roomId, {
    enabled: !result, // Always check if no result yet
    pollInterval: 2000, // Check every 2 seconds
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

  // MAIN LOGIC: Check readiness first, then decide what to show
  useEffect(() => {
    async function handleResultFlow() {
      // Skip if still loading basic data or already have result
      if (isLoading || result) return

      console.log('Result flow check:', {
        readinessLoading,
        bothPlayersReady,
        calculationAttempted,
        isCalculating,
        waitingForPartner,
      })

      // If readiness is still loading, keep waiting
      if (readinessLoading) {
        console.log('Readiness still loading, staying in waiting state')
        setWaitingForPartner(true)
        return
      }

      // If NOT both ready, ALWAYS show waiting screen
      if (!bothPlayersReady) {
        console.log('Not both ready, showing waiting screen')
        setWaitingForPartner(true)
        setCalculationAttempted(false)
        setIsCalculating(false)
        return
      }

      // ONLY if both ready AND not attempted yet - try calculation
      if (bothPlayersReady && !calculationAttempted && !isCalculating) {
        console.log('Both ready, attempting calculation')
        setWaitingForPartner(false)
        setCalculationAttempted(true)
        setIsCalculating(true)

        // Small delay for UI transition
        await new Promise(resolve => setTimeout(resolve, 500))

        try {
          await calculateMatch()
          console.log('Calculation successful!')
          setRetryCount(0)
        } catch (err: any) {
          console.error('Calculation failed:', err)

          // If calculation fails, go back to waiting
          // This covers race conditions and temporary issues
          setWaitingForPartner(true)
          setCalculationAttempted(false)
          setRetryCount(prev => prev + 1)

          // Refresh readiness after delay
          setTimeout(() => {
            console.log('Retrying readiness check after calculation failure')
            refetchReadiness()
          }, 3000)
        } finally {
          setIsCalculating(false)
        }
      }
    }

    handleResultFlow()
  }, [
    isLoading,
    result,
    readinessLoading,
    bothPlayersReady,
    calculationAttempted,
    isCalculating,
    waitingForPartner,
    calculateMatch,
    refetchReadiness,
  ])

  const handlePlayAgain = () => {
    router.push('/categories')
  }

  const handleRetry = async () => {
    console.log('Manual retry triggered')
    setWaitingForPartner(true) // Always start with waiting
    setCalculationAttempted(false)
    setRetryCount(0)
    setIsCalculating(false)

    // Force refresh readiness check
    await refetchReadiness()
  }

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
      progress.total > 0
        ? user?.id === progress.room.hostId
          ? progress.guest.count
          : progress.host.count
        : partnerProgress

    const currentTotal = progress.total > 0 ? progress.total : totalQuestions

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
