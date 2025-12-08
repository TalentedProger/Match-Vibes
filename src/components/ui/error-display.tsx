'use client'

import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getErrorMessage, type ErrorCode } from '@/lib/error-handler'

interface ErrorDisplayProps {
  title?: string
  message?: string
  code?: ErrorCode | string
  onRetry?: () => void
  showHome?: boolean
  showBack?: boolean
}

export function ErrorDisplay({
  title = 'Произошла ошибка',
  message,
  code,
  onRetry,
  showHome = true,
  showBack = true,
}: ErrorDisplayProps) {
  const router = useRouter()

  const displayMessage =
    message || (code ? getErrorMessage(code) : 'Что-то пошло не так')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      <p className="text-muted-foreground max-w-sm mb-6">{displayMessage}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Повторить
          </motion.button>
        )}

        {showBack && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </motion.button>
        )}

        {showHome && (
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
        )}
      </div>

      {code && (
        <p className="text-xs text-muted-foreground mt-4">Код ошибки: {code}</p>
      )}
    </motion.div>
  )
}

interface ErrorBoundaryFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorBoundaryFallback({
  error,
  resetError,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ErrorDisplay
        title="Что-то сломалось"
        message={error.message || 'Произошла непредвиденная ошибка'}
        onRetry={resetError}
        showHome
        showBack={false}
      />
    </div>
  )
}

// Inline error message for forms
interface InlineErrorProps {
  message: string
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="text-sm text-destructive flex items-center gap-1"
    >
      <AlertCircle className="h-3 w-3" />
      {message}
    </motion.p>
  )
}
