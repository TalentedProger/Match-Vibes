'use client'

import { init, retrieveLaunchParams } from '@telegram-apps/sdk'
import type { TelegramWebApp } from '@/types/telegram'

let webApp: TelegramWebApp | null = null

export function initTelegramSDK() {
  if (typeof window === 'undefined') {
    return null
  }

  // Check if Telegram WebApp is available
  if (!window.Telegram?.WebApp) {
    console.warn('Telegram WebApp not available. Running outside Telegram environment.')
    return null
  }

  try {
    // Only initialize SDK if we're in Telegram environment
    // Check if launch params are available before calling init()
    if (window.Telegram.WebApp.initData) {
      init()
    }

    // Get the WebApp instance
    webApp = window.Telegram.WebApp
    
    // Configure the app
    webApp.ready()
    webApp.expand()
    
    return webApp
  } catch (error) {
    // In development, we might not have valid Telegram environment
    // Just use the WebApp instance directly without SDK initialization
    console.warn('Telegram SDK initialization skipped:', error)
    
    if (window.Telegram?.WebApp) {
      webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()
      return webApp
    }
  }

  return null
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (!webApp && typeof window !== 'undefined') {
    return initTelegramSDK()
  }
  return webApp
}

export function getLaunchParams() {
  // Only try to retrieve launch params if in Telegram environment
  if (!isTelegramEnvironment()) {
    return null
  }

  try {
    return retrieveLaunchParams()
  } catch (error) {
    console.warn('Failed to retrieve launch params:', error)
    return null
  }
}

export function isTelegramEnvironment(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp
}
