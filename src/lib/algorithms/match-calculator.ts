/**
 * Match Calculator Algorithm
 * Calculates compatibility between two players based on their responses
 */

import type { Response, Question } from '@/types/game'

export interface MatchResult {
  matchPercentage: number
  hostFavorite: string
  guestFavorite: string
  sharedItem: string | null
  totalQuestions: number
  matchedQuestions: number
  hostLikes: number
  guestLikes: number
}

export interface CalculationInput {
  hostResponses: Response[]
  guestResponses: Response[]
  questions: Question[]
}

/**
 * Calculate match percentage and favorites between two players
 */
export function calculateMatch(input: CalculationInput): MatchResult {
  const { hostResponses, guestResponses, questions } = input

  // Validate inputs
  if (!hostResponses.length || !guestResponses.length) {
    throw new Error('Both players must have responses')
  }

  if (!questions.length) {
    throw new Error('Questions are required for calculation')
  }

  // Create response maps for quick lookup
  const hostResponseMap = new Map(
    hostResponses.map(r => [r.question_id, r.answer])
  )
  const guestResponseMap = new Map(
    guestResponses.map(r => [r.question_id, r.answer])
  )

  // Calculate matches and collect liked items
  let matchedQuestions = 0
  const hostLikedQuestions: Question[] = []
  const guestLikedQuestions: Question[] = []
  const sharedLikedQuestions: Question[] = []

  for (const question of questions) {
    const hostAnswer = hostResponseMap.get(question.id)
    const guestAnswer = guestResponseMap.get(question.id)

    // Skip if either player didn't answer
    if (hostAnswer === undefined || guestAnswer === undefined) {
      continue
    }

    // Count matches (both liked or both disliked)
    if (hostAnswer === guestAnswer) {
      matchedQuestions++
    }

    // Track liked items
    if (hostAnswer === 1) {
      hostLikedQuestions.push(question)
    }
    if (guestAnswer === 1) {
      guestLikedQuestions.push(question)
    }

    // Track shared likes (both players liked this item)
    if (hostAnswer === 1 && guestAnswer === 1) {
      sharedLikedQuestions.push(question)
    }
  }

  // Calculate percentage
  const totalQuestions = Math.min(hostResponses.length, guestResponses.length)
  const matchPercentage =
    totalQuestions > 0
      ? Math.round((matchedQuestions / totalQuestions) * 100)
      : 0

  // Find favorites (most liked item or first liked)
  const hostFavorite = findFavorite(hostLikedQuestions, 'host')
  const guestFavorite = findFavorite(guestLikedQuestions, 'guest')

  // Find shared item (prioritize first shared like)
  const sharedItem = findSharedItem(sharedLikedQuestions, {
    hostLiked: hostLikedQuestions,
    guestLiked: guestLikedQuestions,
  })

  return {
    matchPercentage,
    hostFavorite,
    guestFavorite,
    sharedItem,
    totalQuestions,
    matchedQuestions,
    hostLikes: hostLikedQuestions.length,
    guestLikes: guestLikedQuestions.length,
  }
}

/**
 * Find user's favorite item from their liked questions
 */
function findFavorite(
  likedQuestions: Question[],
  player: 'host' | 'guest'
): string {
  if (likedQuestions.length === 0) {
    return `${player === 'host' ? 'Хост' : 'Гость'} ничего не выбрал`
  }

  // For now, use the first liked item as favorite
  // In future: could use more sophisticated logic (e.g., weighted by order)
  return likedQuestions[0].text
}

/**
 * Find shared item that both players liked
 * Uses smart algorithm to find best match even with low compatibility
 */
function findSharedItem(
  sharedLikedQuestions: Question[],
  context: {
    hostLiked: Question[]
    guestLiked: Question[]
  }
): string | null {
  // Best case: both players liked the same item
  if (sharedLikedQuestions.length > 0) {
    return sharedLikedQuestions[0].text
  }

  // Fallback: no shared likes
  // According to PRD: "система обязана найти хотя бы минимальное совпадение"
  // Use soft correlation algorithm

  // Strategy 1: Find items with closest preference
  // If one player strongly liked something and other was neutral (didn't dislike)
  // This would require storing neutral responses, which we don't have (binary yes/no)

  // Strategy 2: Return a message indicating no shared preferences
  // But still acknowledge their individual preferences
  if (context.hostLiked.length === 0 && context.guestLiked.length === 0) {
    return 'Вы оба не выбрали ничего'
  }

  if (context.hostLiked.length === 0) {
    return `Только партнёр выбрал: ${context.guestLiked[0]?.text || 'неизвестно'}`
  }

  if (context.guestLiked.length === 0) {
    return `Только вы выбрали: ${context.hostLiked[0]?.text || 'неизвестно'}`
  }

  // Both liked something, but not the same thing
  return 'У вас разные предпочтения, но это делает вас интересными!'
}

/**
 * Validate that both players completed the game
 */
export function validateResponses(
  hostResponses: Response[],
  guestResponses: Response[],
  expectedQuestions: number
): { isValid: boolean; error?: string } {
  if (hostResponses.length < expectedQuestions) {
    return {
      isValid: false,
      error: `Host has incomplete responses (${hostResponses.length}/${expectedQuestions})`,
    }
  }

  if (guestResponses.length < expectedQuestions) {
    return {
      isValid: false,
      error: `Guest has incomplete responses (${guestResponses.length}/${expectedQuestions})`,
    }
  }

  return { isValid: true }
}

/**
 * Cache key generator for results
 */
export function generateCacheKey(roomId: string): string {
  return `match_result_${roomId}`
}
