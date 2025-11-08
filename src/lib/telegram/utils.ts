'use client'

import type { TelegramWebApp } from '@/types/telegram'

/**
 * Show alert dialog
 */
export function showAlert(webApp: TelegramWebApp | null, message: string) {
  if (webApp) {
    webApp.showAlert(message)
  } else {
    alert(message)
  }
}

/**
 * Show confirm dialog
 */
export async function showConfirm(
  webApp: TelegramWebApp | null,
  message: string
): Promise<boolean> {
  if (webApp) {
    return webApp.showConfirm(message)
  } else {
    return confirm(message)
  }
}

/**
 * Open external link
 */
export function openLink(webApp: TelegramWebApp | null, url: string) {
  if (webApp) {
    webApp.openLink(url)
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Open Telegram link (internal)
 */
export function openTelegramLink(webApp: TelegramWebApp | null, url: string) {
  if (webApp) {
    webApp.openTelegramLink(url)
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Close the mini app
 */
export function closeApp(webApp: TelegramWebApp | null) {
  if (webApp) {
    webApp.close()
  } else {
    window.close()
  }
}

/**
 * Trigger haptic feedback
 */
export function hapticFeedback(
  webApp: TelegramWebApp | null,
  type: 'impact' | 'notification' | 'selection',
  style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
) {
  if (!webApp?.HapticFeedback) return

  switch (type) {
    case 'impact':
      webApp.HapticFeedback.impactOccurred(style || 'medium')
      break
    case 'notification':
      webApp.HapticFeedback.notificationOccurred('success')
      break
    case 'selection':
      webApp.HapticFeedback.selectionChanged()
      break
  }
}

/**
 * Get platform info
 */
export function getPlatform(webApp: TelegramWebApp | null): string {
  return webApp?.platform || 'unknown'
}

/**
 * Check if running on iOS
 */
export function isIOS(webApp: TelegramWebApp | null): boolean {
  return webApp?.platform === 'ios'
}

/**
 * Check if running on Android
 */
export function isAndroid(webApp: TelegramWebApp | null): boolean {
  return webApp?.platform === 'android'
}
