/**
 * API client for game results
 */

import type { GameResult } from '@/types/game'

export interface CalculateMatchResponse {
  message: string
  result: GameResult
  details?: {
    totalQuestions: number
    matchedQuestions: number
    hostLikes: number
    guestLikes: number
  }
  cached?: boolean
}

/**
 * Calculate match result for a room
 */
export async function calculateMatchResult(
  roomId: string
): Promise<CalculateMatchResponse> {
  const response = await fetch(`/api/game/${roomId}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to calculate match')
  }

  return response.json()
}

/**
 * Fetch existing match result for a room
 */
export async function fetchMatchResult(roomId: string): Promise<GameResult> {
  const response = await fetch(`/api/game/${roomId}/calculate`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch result')
  }

  const data = await response.json()
  return data.result
}

/**
 * Fetch all results for a user
 */
export async function fetchUserResults(userId: string): Promise<GameResult[]> {
  const response = await fetch(`/api/profile/results?userId=${userId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch user results')
  }

  const data = await response.json()
  return data.results
}

/**
 * Share result via Telegram
 */
export async function shareResult(
  result: GameResult,
  categoryName: string
): Promise<void> {
  const shareText = formatShareText(result, categoryName)

  // Use Telegram WebApp API to share
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp

    // Option 1: Open share dialog
    if (webApp.openTelegramLink) {
      const url = `https://t.me/share/url?url=${encodeURIComponent(
        window.location.origin
      )}&text=${encodeURIComponent(shareText)}`
      webApp.openTelegramLink(url)
    } else {
      // Fallback: Use native share if available
      if (navigator.share) {
        await navigator.share({
          title: 'MatchVibe Results',
          text: shareText,
        })
      }
    }
  }
}

/**
 * Format result for sharing
 */
function formatShareText(result: GameResult, categoryName: string): string {
  const { match_percentage, host_favorite, guest_favorite, shared_item } =
    result

  let text = `🎮 MatchVibe - ${categoryName}\n\n`
  text += `💫 Совпадение: ${match_percentage}%\n\n`

  if (host_favorite) {
    text += `👤 Мой выбор: ${host_favorite}\n`
  }
  if (guest_favorite) {
    text += `👥 Партнёр выбрал: ${guest_favorite}\n`
  }
  if (shared_item) {
    text += `\n❤️ Общий вайб: ${shared_item}\n`
  }

  text += `\nИграйте вместе в MatchVibe! 🎯`

  return text
}
