'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/game-store'

interface UseTimerOptions {
  initialTime?: number
  onTimeEnd?: () => void
}

export function useTimer({
  initialTime = 20,
  onTimeEnd,
}: UseTimerOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { timeRemaining, isPaused, setTimeRemaining, pauseTimer, resumeTimer } =
    useGameStore()

  useEffect(() => {
    // Initialize timer
    setTimeRemaining(initialTime)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [initialTime, setTimeRemaining])

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Start countdown
    intervalRef.current = setInterval(() => {
      useGameStore.setState(state => {
        if (state.timeRemaining <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          if (onTimeEnd) {
            setTimeout(onTimeEnd, 0)
          }
          return { timeRemaining: 0 }
        }
        return { timeRemaining: state.timeRemaining - 1 }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused, onTimeEnd])

  const resetTimer = (time: number = initialTime) => {
    setTimeRemaining(time)
  }

  return {
    timeRemaining,
    isPaused,
    pauseTimer,
    resumeTimer,
    resetTimer,
  }
}
