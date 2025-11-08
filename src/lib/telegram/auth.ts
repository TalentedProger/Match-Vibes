import crypto from 'crypto'
import type { TelegramInitData } from '@/types/telegram'

/**
 * Validates Telegram initData using bot token
 * @param initData - The initData string from Telegram WebApp
 * @param botToken - Your Telegram bot token
 * @returns boolean indicating if data is valid
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string
): boolean {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    
    if (!hash) {
      return false
    }

    // Remove hash from params
    urlParams.delete('hash')

    // Create data check string
    const dataCheckArr: string[] = []
    urlParams.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`)
    })
    dataCheckArr.sort()
    const dataCheckString = dataCheckArr.join('\n')

    // Calculate secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    // Compare hashes
    return calculatedHash === hash
  } catch (error) {
    console.error('Error validating Telegram init data:', error)
    return false
  }
}

/**
 * Parses Telegram initData string into typed object
 * @param initData - The initData string from Telegram WebApp
 * @returns Parsed TelegramInitData object or null
 */
export function parseTelegramInitData(
  initData: string
): TelegramInitData | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const userParam = urlParams.get('user')
    const authDate = urlParams.get('auth_date')
    const hash = urlParams.get('hash')

    if (!authDate || !hash) {
      return null
    }

    const parsed: TelegramInitData = {
      auth_date: parseInt(authDate, 10),
      hash,
    }

    if (userParam) {
      parsed.user = JSON.parse(decodeURIComponent(userParam))
    }

    const queryId = urlParams.get('query_id')
    if (queryId) {
      parsed.query_id = queryId
    }

    return parsed
  } catch (error) {
    console.error('Error parsing Telegram init data:', error)
    return null
  }
}

/**
 * Checks if initData is expired (older than 24 hours)
 * @param initData - Parsed TelegramInitData object
 * @returns boolean indicating if data is expired
 */
export function isInitDataExpired(initData: TelegramInitData): boolean {
  const now = Math.floor(Date.now() / 1000)
  const expirationTime = 24 * 60 * 60 // 24 hours in seconds
  return now - initData.auth_date > expirationTime
}
