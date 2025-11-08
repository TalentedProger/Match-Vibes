export interface User {
  id: string
  telegramId: number
  username: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  premiumStatus: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UserStats {
  gamesPlayed: number
  matches: number
  friends: number
  achievementsUnlocked: number
  avgCompatibility: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: 'games' | 'matches' | 'friends' | 'compatibility'
}

export interface UserAchievement {
  user_id: string
  achievement_id: string
  unlocked_at: string
}
