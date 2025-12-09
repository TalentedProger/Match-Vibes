'use client'

import { useEffect, useState } from 'react'

/**
 * TelegramNavigation Component
 * Container for Telegram's native navigation buttons
 * Creates proper spacing and layout consideration for the buttons
 */
export function TelegramNavigation() {
  const [buttonHeight, setButtonHeight] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return

    // Function to calculate button container height
    const updateButtonHeight = () => {
      // Check if we have Telegram navigation buttons visible
      const hasBackButton = webApp.BackButton?.isVisible || false
      const hasMainButton = webApp.MainButton?.isVisible || false
      const hasSecondaryButton = webApp.SecondaryButton?.isVisible || false

      // Calculate the height needed for the button container
      let height = 0

      if (hasBackButton || hasMainButton || hasSecondaryButton) {
        // Standard Telegram button height + top padding + bottom margin
        height = 60 // Button height (44px) + top padding (8px) + bottom margin (8px)
      }

      setButtonHeight(height)

      // Update CSS variable for other components to use
      document.documentElement.style.setProperty(
        '--tg-nav-height',
        `${height}px`
      )

      console.log('Telegram navigation updated:', {
        hasBackButton,
        hasMainButton,
        hasSecondaryButton,
        height: `${height}px`,
      })
    }

    // Initial update
    updateButtonHeight()

    // Monitor button changes
    const checkButtons = () => {
      updateButtonHeight()
    }

    // Check periodically for button changes
    const interval = setInterval(checkButtons, 500)

    // Listen for events if available
    if (typeof webApp.onEvent === 'function') {
      webApp.onEvent('backButtonClicked', updateButtonHeight)
      webApp.onEvent('mainButtonClicked', updateButtonHeight)
    }

    return () => {
      clearInterval(interval)
      if (typeof webApp.offEvent === 'function') {
        webApp.offEvent('backButtonClicked', updateButtonHeight)
        webApp.offEvent('mainButtonClicked', updateButtonHeight)
      }
    }
  }, [])

  // Only render container if we have navigation buttons
  if (buttonHeight === 0) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ height: `${buttonHeight}px` }}
    >
      {/* This is a placeholder container for Telegram's navigation buttons */}
      {/* The actual buttons are rendered by Telegram WebApp SDK */}
      <div className="w-full h-full bg-transparent" />
    </div>
  )
}
