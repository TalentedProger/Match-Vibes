'use client'

import { useEffect, useState } from 'react'

// Фиксированная высота для навигационных кнопок Telegram (кнопка закрыть, меню и т.д.)
// Эти кнопки ВСЕГДА присутствуют в верхней части Mini App
const TELEGRAM_HEADER_HEIGHT = 56 // Высота стандартной панели Telegram с кнопками

/**
 * TelegramNavigation Component
 * Creates proper spacing for Telegram's native navigation buttons
 * These buttons (Close, Menu, Options) are ALWAYS present at the top
 */
export function TelegramNavigation() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const webApp = (window as any).Telegram?.WebApp

    // Устанавливаем CSS переменную сразу, даже если WebApp не доступен
    // Кнопки Telegram всегда присутствуют когда приложение открыто в Telegram
    const setNavHeight = () => {
      document.documentElement.style.setProperty(
        '--tg-nav-height',
        `${TELEGRAM_HEADER_HEIGHT}px`
      )
      setIsReady(true)

      console.log('Telegram navigation height set:', {
        height: TELEGRAM_HEADER_HEIGHT,
        isTelegram: !!webApp,
      })
    }

    // Устанавливаем высоту сразу
    setNavHeight()
  }, [])

  // Рендерим невидимый контейнер-распорку для отступа
  // Это создает физическое пространство под кнопками Telegram
  return (
    <div
      className="w-full bg-transparent pointer-events-none"
      style={{
        height: `${TELEGRAM_HEADER_HEIGHT}px`,
        minHeight: `${TELEGRAM_HEADER_HEIGHT}px`,
      }}
      aria-hidden="true"
    />
  )
}
