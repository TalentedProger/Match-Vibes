'use client'

import type { TelegramWebApp, TelegramThemeParams } from '@/types/telegram'

/**
 * Applies Telegram theme colors to CSS variables
 */
export function applyTelegramTheme(webApp: TelegramWebApp | null) {
  if (!webApp || typeof window === 'undefined') {
    return
  }

  const theme = webApp.themeParams
  const root = document.documentElement

  if (theme.bg_color) {
    root.style.setProperty('--tg-theme-bg-color', theme.bg_color)
  }
  if (theme.text_color) {
    root.style.setProperty('--tg-theme-text-color', theme.text_color)
  }
  if (theme.hint_color) {
    root.style.setProperty('--tg-theme-hint-color', theme.hint_color)
  }
  if (theme.link_color) {
    root.style.setProperty('--tg-theme-link-color', theme.link_color)
  }
  if (theme.button_color) {
    root.style.setProperty('--tg-theme-button-color', theme.button_color)
  }
  if (theme.button_text_color) {
    root.style.setProperty(
      '--tg-theme-button-text-color',
      theme.button_text_color
    )
  }
  if (theme.secondary_bg_color) {
    root.style.setProperty(
      '--tg-theme-secondary-bg-color',
      theme.secondary_bg_color
    )
  }

  // Set color scheme class
  if (webApp.colorScheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Get current theme params
 */
export function getThemeParams(
  webApp: TelegramWebApp | null
): TelegramThemeParams | null {
  return webApp?.themeParams || null
}

/**
 * Check if dark mode is enabled
 */
export function isDarkMode(webApp: TelegramWebApp | null): boolean {
  return webApp?.colorScheme === 'dark'
}
