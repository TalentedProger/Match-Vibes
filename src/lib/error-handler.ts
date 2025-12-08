// Comprehensive error handling utility

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

// Common error types
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',

  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED: 'MISSING_REQUIRED',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Room/Game errors
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  ROOM_EXPIRED: 'ROOM_EXPIRED',
  GAME_NOT_STARTED: 'GAME_NOT_STARTED',
  GAME_ALREADY_COMPLETED: 'GAME_ALREADY_COMPLETED',

  // Database errors
  DB_ERROR: 'DB_ERROR',
  DB_TIMEOUT: 'DB_TIMEOUT',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // External service errors
  TELEGRAM_ERROR: 'TELEGRAM_ERROR',
  SUPABASE_ERROR: 'SUPABASE_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// Error factory functions
export const createError = {
  auth: (message: string = 'Требуется авторизация') =>
    new AppError(message, ErrorCodes.AUTH_REQUIRED, 401),

  notFound: (resource: string = 'Ресурс') =>
    new AppError(`${resource} не найден`, ErrorCodes.NOT_FOUND, 404),

  validation: (message: string) =>
    new AppError(message, ErrorCodes.VALIDATION_FAILED, 400),

  roomNotFound: () =>
    new AppError('Комната не найдена', ErrorCodes.ROOM_NOT_FOUND, 404),

  roomFull: () => new AppError('Комната заполнена', ErrorCodes.ROOM_FULL, 400),

  gameCompleted: () =>
    new AppError('Игра уже завершена', ErrorCodes.GAME_ALREADY_COMPLETED, 400),

  database: (message: string = 'Ошибка базы данных') =>
    new AppError(message, ErrorCodes.DB_ERROR, 500),
}

// Error message translations for users
export const getErrorMessage = (code: ErrorCode | string): string => {
  const messages: Record<string, string> = {
    [ErrorCodes.AUTH_REQUIRED]: 'Требуется авторизация',
    [ErrorCodes.AUTH_INVALID]: 'Неверные данные авторизации',
    [ErrorCodes.AUTH_EXPIRED]: 'Сессия истекла, войдите снова',
    [ErrorCodes.VALIDATION_FAILED]: 'Ошибка валидации данных',
    [ErrorCodes.INVALID_INPUT]: 'Некорректные входные данные',
    [ErrorCodes.MISSING_REQUIRED]: 'Отсутствуют обязательные поля',
    [ErrorCodes.NOT_FOUND]: 'Ресурс не найден',
    [ErrorCodes.ALREADY_EXISTS]: 'Ресурс уже существует',
    [ErrorCodes.ROOM_NOT_FOUND]: 'Комната не найдена',
    [ErrorCodes.ROOM_FULL]: 'Комната уже заполнена',
    [ErrorCodes.ROOM_EXPIRED]: 'Комната больше не активна',
    [ErrorCodes.GAME_NOT_STARTED]: 'Игра ещё не началась',
    [ErrorCodes.GAME_ALREADY_COMPLETED]: 'Игра уже завершена',
    [ErrorCodes.DB_ERROR]: 'Ошибка базы данных',
    [ErrorCodes.DB_TIMEOUT]: 'Превышено время ожидания базы данных',
    [ErrorCodes.NETWORK_ERROR]: 'Ошибка сети',
    [ErrorCodes.TIMEOUT]: 'Превышено время ожидания',
    [ErrorCodes.TELEGRAM_ERROR]: 'Ошибка Telegram',
    [ErrorCodes.SUPABASE_ERROR]: 'Ошибка сервиса данных',
  }

  return messages[code] || 'Произошла неизвестная ошибка'
}

// Logger utility
export const logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data || '')
    }
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data || '')
  },

  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error || '')

    // In production, send to error tracking service
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined'
    ) {
      // Could integrate with Sentry, LogRocket, etc.
      // window.Sentry?.captureException(error)
    }
  },

  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
  },
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

// Retry utility for network requests
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      logger.warn(`Retry ${i + 1}/${retries} failed`, {
        error: lastError.message,
      })

      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}
