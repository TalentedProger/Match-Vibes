import { useEffect, useRef } from 'react'
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
    setLoading,
  } = useAuthStore()

  const { initData, user: tgUser, isReady } = useTelegram()
  const loginAttemptedRef = useRef(false)

  useEffect(() => {
    // Reset loading after timeout to prevent stuck state
    const timeout = setTimeout(() => {
      if (isLoading && !isAuthenticated) {
        console.warn('Login timeout - resetting loading state')
        setLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [isLoading, isAuthenticated, setLoading])

  useEffect(() => {
    // Auto-login if we have Telegram initData but no authenticated user
    // Only attempt once to prevent infinite loops
    if (
      isReady &&
      initData &&
      !isAuthenticated &&
      !isLoading &&
      !loginAttemptedRef.current
    ) {
      loginAttemptedRef.current = true
      login(initData).catch(err => {
        console.error('Auto-login failed:', err)
        // Reset loading state on error
        setLoading(false)
      })
    }

    // If Telegram is not available after ready, allow proceeding without auth
    if (isReady && !initData && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true
      console.log('Telegram WebApp not detected - running in browser mode')
      setLoading(false)
    }
  }, [initData, isAuthenticated, isLoading, login, isReady, setLoading])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    telegramUser: tgUser,
    isTelegramEnv: !!initData,
  }
}
