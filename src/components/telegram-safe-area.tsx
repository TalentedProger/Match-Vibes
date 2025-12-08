'use client'

import { useEffect } from 'react'

/**
 * TelegramSafeArea Component
 * Handles Telegram Mini App safe area insets and fullscreen mode
 * Sets CSS variables for bottom padding to avoid Telegram's navigation buttons
 */
export function TelegramSafeArea() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return

    // Function to update safe area CSS variables
    const updateSafeAreas = () => {
      const root = document.documentElement

      // Get safe area insets from Telegram
      const safeAreaInset = webApp.safeAreaInset || {}
      const contentSafeAreaInset = webApp.contentSafeAreaInset || {}

      // Bottom inset for Telegram's navigation buttons
      // Default to reasonable values if not available
      const bottomInset = Math.max(
        safeAreaInset.bottom || 0,
        contentSafeAreaInset.bottom || 0,
        // Fallback: if viewport height is less than screen height, calculate difference
        webApp.viewportStableHeight
          ? Math.max(0, window.innerHeight - webApp.viewportStableHeight)
          : 0,
        // Minimum safe padding for Telegram buttons (typically ~80-100px when visible)
        webApp.isExpanded ? 0 : 80
      )

      // Set CSS variables
      root.style.setProperty('--tg-safe-bottom', `${bottomInset}px`)
      root.style.setProperty('--tg-safe-top', `${safeAreaInset.top || 0}px`)

      // Additional padding for when the Telegram bottom bar is visible
      // This is always present in non-fullscreen mode
      const extraPadding = webApp.isFullscreen ? 0 : 16
      root.style.setProperty('--tg-content-padding', `${extraPadding}px`)

      console.log('Telegram safe areas updated:', {
        bottomInset,
        isFullscreen: webApp.isFullscreen,
        isExpanded: webApp.isExpanded,
        viewportHeight: webApp.viewportHeight,
        viewportStableHeight: webApp.viewportStableHeight,
      })
    }

    // Initial update
    updateSafeAreas()

    // Request fullscreen/expand on load (but no user control)
    try {
      if (typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen()
      } else if (typeof webApp.expand === 'function') {
        webApp.expand()
      }
    } catch (error) {
      console.warn('Fullscreen/expand failed:', error)
    }

    // Listen for viewport changes
    if (typeof webApp.onEvent === 'function') {
      webApp.onEvent('viewportChanged', updateSafeAreas)
      webApp.onEvent('fullscreenChanged', updateSafeAreas)
      webApp.onEvent('safeAreaChanged', updateSafeAreas)
      webApp.onEvent('contentSafeAreaChanged', updateSafeAreas)

      return () => {
        if (typeof webApp.offEvent === 'function') {
          webApp.offEvent('viewportChanged', updateSafeAreas)
          webApp.offEvent('fullscreenChanged', updateSafeAreas)
          webApp.offEvent('safeAreaChanged', updateSafeAreas)
          webApp.offEvent('contentSafeAreaChanged', updateSafeAreas)
        }
      }
    }
  }, [])

  // This component only sets CSS variables, renders nothing
  return null
}
