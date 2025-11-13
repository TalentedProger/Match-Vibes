import { useEffect } from 'react'
import { useGameStore } from '@/stores/game-store'

/**
 * Hook для управления состоянием игры и предотвращения дублирования
 */
export function useGameManager() {
  const { clearGame, roomId } = useGameStore()

  // Очистить состояние игры при размонтировании компонента или смене роута
  useEffect(() => {
    return () => {
      // Функция очистки вызывается при размонтировании
      console.log('Game component unmounting, clearing game state')
      clearGame()
    }
  }, [clearGame])

  // Очистить состояние при смене roomId (если пользователь переходит в другую комнату)
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unloading, clearing game state')
      clearGame()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Page hidden, game might be ending')
      }
    }

    // Очистка при закрытии/обновлении страницы
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [clearGame])

  return { roomId }
}
