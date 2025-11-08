import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useTelegram } from './use-telegram'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  } = useAuthStore()

  const { initData, user: tgUser } = useTelegram()

  useEffect(() => {
    // Auto-login if we have Telegram initData but no authenticated user
    if (initData && !isAuthenticated && !isLoading) {
      login(initData).catch((err) => {
        console.error('Auto-login failed:', err)
      })
    }
  }, [initData, isAuthenticated, isLoading, login])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    telegramUser: tgUser,
  }
}
