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
  const [waitingForPartner, setWaitingForPartner] = useState(false)

  // Real-time partner tracking
  const { partnerProgress } = useGameRealtime(roomId, user?.id || '')

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

  // Auto-calculate if no result exists (with delay to ensure both players finished)
  useEffect(() => {
    async function autoCalculate() {
      if (!isLoading && !result && !isCalculating && !calculationAttempted) {
        setCalculationAttempted(true)
        // Add small delay to ensure both players have finished submitting
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsCalculating(true)
        try {
          await calculateMatch()
          setWaitingForPartner(false)
        } catch (err: any) {
          console.error('Calculation failed:', err)
          // Check if error is due to partner not finishing
          if (
            err.message?.includes('Both players must complete all questions')
          ) {
            setWaitingForPartner(true)
            setIsCalculating(false)
            // Retry after a delay
            setTimeout(() => {
              setCalculationAttempted(false)
            }, 3000)
          }
        } finally {
          if (!waitingForPartner) {
            setIsCalculating(false)
          }
        }
      }
    }

    autoCalculate()
  }, [
    isLoading,
    result,
    calculateMatch,
    isCalculating,
    calculationAttempted,
    waitingForPartner,
  ])

  const handlePlayAgain = () => {
    router.push('/categories')
  }

  const handleRetry = async () => {
    setIsCalculating(true)
    await calculateMatch()
    setIsCalculating(false)
  }

  // Loading state
  if (isLoading || isCalculating) {
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

  // Waiting for partner state
  if (waitingForPartner && !result) {
    const partnerPercentage =
      totalQuestions > 0
        ? Math.round((partnerProgress / totalQuestions) * 100)
        : 0

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ждем партнера...</h2>
          <p className="text-muted-foreground mb-8">
            Ваш партнер еще отвечает на вопросы
          </p>

          {/* Progress Bar */}
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Прогресс партнера
              </span>
              <span className="text-sm text-muted-foreground">
                {partnerProgress}/{totalQuestions}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${partnerPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-primary font-semibold mt-2">
              {partnerPercentage}%
            </p>
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error && !result && !waitingForPartner) {
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
