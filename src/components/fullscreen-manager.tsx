'use client'

import { useEffect, useCallback, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * FullscreenManager Component
 * Handles automatic fullscreen mode for Telegram Mini Apps
 * Provides a toggle button for user control
 */
export function FullscreenManager() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)

  // Initialize fullscreen on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return

    setIsTelegramEnv(true)

    // Request fullscreen on load
    try {
      // Try new fullscreen API first (Telegram 7.7+)
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
        setIsFullscreen(true)
        setShowButton(true)
      } else if (typeof webApp.expand === 'function') {
        // Fallback to expand
        webApp.expand()
        setIsFullscreen(webApp.isExpanded || true)
        // No exit option with expand, so don't show button
        setShowButton(typeof webApp.exitFullscreen === 'function')
      }
    } catch (error) {
      console.warn('Fullscreen initialization failed:', error)
    }

    // Listen for fullscreen changes
    if (typeof webApp.onEvent === 'function') {
      const handleFullscreenChanged = () => {
        setIsFullscreen(webApp.isFullscreen || webApp.isExpanded || false)
      }
      webApp.onEvent('fullscreenChanged', handleFullscreenChanged)
      webApp.onEvent('viewportChanged', handleFullscreenChanged)

      return () => {
        if (typeof webApp.offEvent === 'function') {
          webApp.offEvent('fullscreenChanged', handleFullscreenChanged)
          webApp.offEvent('viewportChanged', handleFullscreenChanged)
        }
      }
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return

    try {
      if (isFullscreen && typeof webApp.exitFullscreen === 'function') {
        webApp.exitFullscreen()
        setIsFullscreen(false)
      } else if (
        !isFullscreen &&
        typeof webApp.requestFullscreen === 'function'
      ) {
        webApp.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch (error) {
      console.warn('Toggle fullscreen failed:', error)
    }
  }, [isFullscreen])

  // Don't render button if not in Telegram or no toggle support
  if (!isTelegramEnv || !showButton) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-[9999]"
      >
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 bg-card/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center shadow-lg"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label={
            isFullscreen
              ? 'Выйти из полноэкранного режима'
              : 'Полноэкранный режим'
          }
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-foreground" />
          ) : (
            <Maximize2 className="h-5 w-5 text-foreground" />
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook to programmatically control fullscreen
 */
export function useFullscreenControl() {
  const enterFullscreen = useCallback(() => {
    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return false

    try {
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
        return true
      } else if (typeof webApp.expand === 'function') {
        webApp.expand()
        return true
      }
    } catch (error) {
      console.warn('Enter fullscreen failed:', error)
    }
    return false
  }, [])

  const exitFullscreen = useCallback(() => {
    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return false

    try {
      if (typeof webApp.exitFullscreen === 'function') {
        webApp.exitFullscreen()
        return true
      }
    } catch (error) {
      console.warn('Exit fullscreen failed:', error)
    }
    return false
  }, [])

  return { enterFullscreen, exitFullscreen }
}
