'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GameResultDisplay } from '@/components/game/game-result'
import { useMatchResult } from '@/hooks/use-match-result'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const { result, isLoading, error, calculateMatch, fetchResult } =
    useMatchResult(roomId)
  const [categoryName, setCategoryName] = useState<string>('Категория')
  const [isCalculating, setIsCalculating] = useState(false)

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

  // Auto-calculate if no result exists
  useEffect(() => {
    async function autoCalculate() {
      if (!isLoading && !result && !error && !isCalculating) {
        setIsCalculating(true)
        await calculateMatch()
        setIsCalculating(false)
      }
    }

    autoCalculate()
  }, [isLoading, result, error, calculateMatch, isCalculating])

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

  // Error state
  if (error && !result) {
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
