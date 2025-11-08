'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { TelegramWebApp } from '@/types/telegram'

interface TelegramContextType {
  webApp: TelegramWebApp | null
  isReady: boolean
  user: any | null
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  isReady: false,
  user: null,
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Dynamically import Telegram SDK to avoid SSR issues
    const initTelegram = async () => {
      try {
        const { initTelegramSDK } = await import('@/lib/telegram/init')
        const { applyTelegramTheme } = await import('@/lib/telegram/theme')
        
        const app = initTelegramSDK()
        if (app) {
          setWebApp(app)
          applyTelegramTheme(app)
        }
        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize Telegram SDK:', error)
        setIsReady(true)
      }
    }

    initTelegram()
  }, [])

  const user = webApp?.initDataUnsafe?.user || null

  return (
    <TelegramContext.Provider value={{ webApp, isReady, user }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (context === undefined) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
