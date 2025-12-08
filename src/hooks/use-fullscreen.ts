'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface FullscreenState {
  isFullscreen: boolean
  isSupported: boolean
  isTelegramEnv: boolean
}

interface UseFullscreenReturn extends FullscreenState {
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

/**
 * Hook for managing fullscreen mode in Telegram Mini Apps
 * Supports both Telegram's requestFullscreen API and expand() fallback
 */
export function useFullscreen(): UseFullscreenReturn {
  const [state, setState] = useState<FullscreenState>({
    isFullscreen: false,
    isSupported: false,
    isTelegramEnv: false,
  })

  const isInitialized = useRef(false)

  // Initialize on mount
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return
    isInitialized.current = true

    const isTelegram = !!window.Telegram?.WebApp
    const webApp = window.Telegram?.WebApp

    // Check if fullscreen API is supported (Telegram Mini Apps 7.7+)
    const hasFullscreenSupport =
      webApp && typeof webApp.requestFullscreen === 'function'
    const hasExpandSupport = webApp && typeof webApp.expand === 'function'

    setState({
      isFullscreen: webApp?.isExpanded || false,
      isSupported: hasFullscreenSupport || hasExpandSupport,
      isTelegramEnv: isTelegram,
    })

    // Listen for fullscreen changes
    if (webApp) {
      // Telegram 7.7+ fullscreen events
      if (typeof webApp.onEvent === 'function') {
        webApp.onEvent('fullscreenChanged', () => {
          setState(prev => ({
            ...prev,
            isFullscreen: webApp.isFullscreen || webApp.isExpanded || false,
          }))
        })

        webApp.onEvent('fullscreenFailed', (error: { error: string }) => {
          console.warn('Fullscreen failed:', error)
        })
      }

      // Legacy viewport change listener
      if (typeof webApp.onEvent === 'function') {
        webApp.onEvent('viewportChanged', () => {
          setState(prev => ({
            ...prev,
            isFullscreen: webApp.isFullscreen || webApp.isExpanded || false,
          }))
        })
      }
    }
  }, [])

  const enterFullscreen = useCallback(() => {
    const webApp = window.Telegram?.WebApp
    if (!webApp) return

    try {
      // Try new fullscreen API first (Telegram 7.7+)
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
        setState(prev => ({ ...prev, isFullscreen: true }))
        return
      }

      // Fallback to expand
      if (typeof webApp.expand === 'function') {
        webApp.expand()
        setState(prev => ({ ...prev, isFullscreen: true }))
        return
      }
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error)
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    const webApp = window.Telegram?.WebApp
    if (!webApp) return

    try {
      // Try new exitFullscreen API (Telegram 7.7+)
      if (typeof webApp.exitFullscreen === 'function') {
        webApp.exitFullscreen()
        setState(prev => ({ ...prev, isFullscreen: false }))
        return
      }

      // No fallback for exit - expand can't be reversed without fullscreen API
      console.warn('exitFullscreen not supported in this Telegram version')
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (state.isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }, [state.isFullscreen, enterFullscreen, exitFullscreen])

  return {
    ...state,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}

// Type augmentation for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        isExpanded: boolean
        isFullscreen?: boolean
        requestFullscreen?: () => void
        exitFullscreen?: () => void
        onEvent?: (event: string, callback: (data?: any) => void) => void
        offEvent?: (event: string, callback: (data?: any) => void) => void
        enableClosingConfirmation?: () => void
        disableClosingConfirmation?: () => void
        HapticFeedback: {
          impactOccurred: (
            style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
          ) => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        BackButton: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        MainButton: any
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            photo_url?: string
          }
        }
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
      }
    }
  }
}
