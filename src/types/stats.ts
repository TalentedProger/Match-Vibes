/**
 * Statistics Types for MatchVibe
 * Extended statistics data structures for dashboard
 */

// Partner statistics
export interface PartnerStats {
  id: string
  username: string | null
  firstName: string | null
  avatarUrl: string | null
  gamesPlayed: number
  avgCompatibility: number
  lastPlayedAt: string
}

// Category statistics
export interface CategoryStats {
  categoryId: string
  categoryName: string
  categoryIcon: string
  gamesPlayed: number
  avgCompatibility: number
  totalLikes: number
  totalDislikes: number
}

// Fun fact types
export interface FunFact {
  id: string
  type: 'preference' | 'compatibility' | 'activity' | 'streak' | 'category'
  icon: string
  title: string
  description: string
  value?: number
  category?: string
}

// Game history item
export interface GameHistoryItem {
  id: string
  roomId: string
  partnerId: string
  partnerUsername: string | null
  partnerFirstName: string | null
  partnerAvatarUrl: string | null
  categoryId: string
  categoryName: string
  categoryIcon: string
  matchPercentage: number
  hostFavorite: string
  guestFavorite: string
  sharedItem: string | null
  playedAt: string
  wasHost: boolean
}

// Compatibility distribution for chart
export interface CompatibilityDistribution {
  range: string // e.g., "0-20%", "21-40%", etc.
  count: number
  percentage: number
}

// Extended statistics response
export interface ExtendedStats {
  // Basic stats
  gamesPlayed: number
  matches: number
  friends: number
  achievementsUnlocked: number
  avgCompatibility: number

  // Extended stats
  totalLikes: number
  totalDislikes: number
  likeRatio: number // percentage of likes

  // Time-based stats
  gamesThisWeek: number
  gamesThisMonth: number
  longestStreak: number
  currentStreak: number

  // Best/worst stats
  bestMatchPercentage: number
  worstMatchPercentage: number
  bestMatchPartner: PartnerStats | null

  // Category breakdown
  categoryStats: CategoryStats[]

  // Partner breakdown
  topPartners: PartnerStats[]

  // Compatibility distribution
  compatibilityDistribution: CompatibilityDistribution[]

  // Fun facts
  funFacts: FunFact[]

  // Recent activity
  recentGames: GameHistoryItem[]
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TimelineDataPoint {
  date: string
  games: number
  avgCompatibility: number
}
