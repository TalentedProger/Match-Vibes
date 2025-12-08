export type AchievementCategory =
  | 'games'
  | 'social'
  | 'exploration'
  | 'streaks'
  | 'special'

export type AchievementRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: AchievementRarity
  requirement: number // Target value to unlock
  rewardXP: number
}

export interface UserAchievement {
  achievementId: string
  progress: number
  unlockedAt: string | null
  isUnlocked: boolean
}

export interface AchievementWithProgress extends Achievement {
  progress: number
  isUnlocked: boolean
  unlockedAt: string | null
  progressPercentage: number
}

// Achievement definitions - 30 achievements
export const ACHIEVEMENTS: Achievement[] = [
  // === GAMES CATEGORY (10) ===
  {
    id: 'first_game',
    name: 'Первый шаг',
    description: 'Сыграйте свою первую игру',
    icon: '🎮',
    category: 'games',
    rarity: 'common',
    requirement: 1,
    rewardXP: 10,
  },
  {
    id: 'games_5',
    name: 'Новичок',
    description: 'Сыграйте 5 игр',
    icon: '🌱',
    category: 'games',
    rarity: 'common',
    requirement: 5,
    rewardXP: 25,
  },
  {
    id: 'games_10',
    name: 'Активный игрок',
    description: 'Сыграйте 10 игр',
    icon: '⭐',
    category: 'games',
    rarity: 'uncommon',
    requirement: 10,
    rewardXP: 50,
  },
  {
    id: 'games_25',
    name: 'Опытный',
    description: 'Сыграйте 25 игр',
    icon: '🎯',
    category: 'games',
    rarity: 'rare',
    requirement: 25,
    rewardXP: 100,
  },
  {
    id: 'games_50',
    name: 'Ветеран',
    description: 'Сыграйте 50 игр',
    icon: '🏆',
    category: 'games',
    rarity: 'epic',
    requirement: 50,
    rewardXP: 200,
  },
  {
    id: 'games_100',
    name: 'Легенда',
    description: 'Сыграйте 100 игр',
    icon: '👑',
    category: 'games',
    rarity: 'legendary',
    requirement: 100,
    rewardXP: 500,
  },
  {
    id: 'perfect_match',
    name: 'Идеальная пара',
    description: 'Получите 100% совместимости',
    icon: '💯',
    category: 'games',
    rarity: 'legendary',
    requirement: 1,
    rewardXP: 250,
  },
  {
    id: 'high_match_5',
    name: 'Отличное понимание',
    description: 'Получите 80%+ совместимости 5 раз',
    icon: '🤝',
    category: 'games',
    rarity: 'rare',
    requirement: 5,
    rewardXP: 75,
  },
  {
    id: 'high_match_20',
    name: 'Родственные души',
    description: 'Получите 80%+ совместимости 20 раз',
    icon: '💫',
    category: 'games',
    rarity: 'epic',
    requirement: 20,
    rewardXP: 150,
  },
  {
    id: 'speed_demon',
    name: 'Молниеносный',
    description: 'Завершите игру менее чем за 2 минуты',
    icon: '⚡',
    category: 'games',
    rarity: 'uncommon',
    requirement: 1,
    rewardXP: 40,
  },

  // === SOCIAL CATEGORY (8) ===
  {
    id: 'first_friend',
    name: 'Первый друг',
    description: 'Сыграйте с первым партнёром',
    icon: '🤗',
    category: 'social',
    rarity: 'common',
    requirement: 1,
    rewardXP: 15,
  },
  {
    id: 'partners_3',
    name: 'Компанейский',
    description: 'Сыграйте с 3 разными партнёрами',
    icon: '👥',
    category: 'social',
    rarity: 'uncommon',
    requirement: 3,
    rewardXP: 35,
  },
  {
    id: 'partners_10',
    name: 'Душа компании',
    description: 'Сыграйте с 10 разными партнёрами',
    icon: '🎉',
    category: 'social',
    rarity: 'rare',
    requirement: 10,
    rewardXP: 100,
  },
  {
    id: 'partners_25',
    name: 'Социальная бабочка',
    description: 'Сыграйте с 25 разными партнёрами',
    icon: '🦋',
    category: 'social',
    rarity: 'epic',
    requirement: 25,
    rewardXP: 200,
  },
  {
    id: 'best_friend',
    name: 'Лучшие друзья',
    description: 'Сыграйте 10 игр с одним партнёром',
    icon: '💕',
    category: 'social',
    rarity: 'rare',
    requirement: 10,
    rewardXP: 80,
  },
  {
    id: 'invite_master',
    name: 'Организатор',
    description: 'Создайте 10 игровых комнат',
    icon: '🏠',
    category: 'social',
    rarity: 'uncommon',
    requirement: 10,
    rewardXP: 50,
  },
  {
    id: 'invite_legend',
    name: 'Лидер',
    description: 'Создайте 50 игровых комнат',
    icon: '🗝️',
    category: 'social',
    rarity: 'epic',
    requirement: 50,
    rewardXP: 150,
  },
  {
    id: 'joiner',
    name: 'Гость',
    description: 'Присоединитесь к 20 играм по приглашению',
    icon: '🎟️',
    category: 'social',
    rarity: 'uncommon',
    requirement: 20,
    rewardXP: 45,
  },

  // === EXPLORATION CATEGORY (6) ===
  {
    id: 'first_category',
    name: 'Исследователь',
    description: 'Сыграйте в первую категорию',
    icon: '🧭',
    category: 'exploration',
    rarity: 'common',
    requirement: 1,
    rewardXP: 10,
  },
  {
    id: 'categories_3',
    name: 'Любопытный',
    description: 'Сыграйте в 3 разные категории',
    icon: '🔍',
    category: 'exploration',
    rarity: 'uncommon',
    requirement: 3,
    rewardXP: 40,
  },
  {
    id: 'categories_all',
    name: 'Эрудит',
    description: 'Сыграйте во все категории',
    icon: '🎓',
    category: 'exploration',
    rarity: 'epic',
    requirement: 6,
    rewardXP: 175,
  },
  {
    id: 'favorites_10',
    name: 'Коллекционер',
    description: 'Добавьте 10 элементов в избранное',
    icon: '❤️',
    category: 'exploration',
    rarity: 'uncommon',
    requirement: 10,
    rewardXP: 30,
  },
  {
    id: 'favorites_50',
    name: 'Хранитель',
    description: 'Добавьте 50 элементов в избранное',
    icon: '💎',
    category: 'exploration',
    rarity: 'rare',
    requirement: 50,
    rewardXP: 100,
  },
  {
    id: 'swipes_500',
    name: 'Свайпер',
    description: 'Сделайте 500 свайпов',
    icon: '👆',
    category: 'exploration',
    rarity: 'rare',
    requirement: 500,
    rewardXP: 75,
  },

  // === STREAKS CATEGORY (4) ===
  {
    id: 'streak_3',
    name: 'Постоянство',
    description: 'Играйте 3 дня подряд',
    icon: '🔥',
    category: 'streaks',
    rarity: 'uncommon',
    requirement: 3,
    rewardXP: 50,
  },
  {
    id: 'streak_7',
    name: 'Неделя активности',
    description: 'Играйте 7 дней подряд',
    icon: '🌟',
    category: 'streaks',
    rarity: 'rare',
    requirement: 7,
    rewardXP: 100,
  },
  {
    id: 'streak_30',
    name: 'Преданность',
    description: 'Играйте 30 дней подряд',
    icon: '💪',
    category: 'streaks',
    rarity: 'legendary',
    requirement: 30,
    rewardXP: 500,
  },
  {
    id: 'daily_games_3',
    name: 'Марафонец',
    description: 'Сыграйте 3 игры за один день',
    icon: '🏃',
    category: 'streaks',
    rarity: 'uncommon',
    requirement: 3,
    rewardXP: 35,
  },

  // === SPECIAL CATEGORY (2) ===
  {
    id: 'early_bird',
    name: 'Ранняя пташка',
    description: 'Сыграйте игру до 8 утра',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    requirement: 1,
    rewardXP: 60,
  },
  {
    id: 'night_owl',
    name: 'Ночная сова',
    description: 'Сыграйте игру после полуночи',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    requirement: 1,
    rewardXP: 60,
  },
]

export const CATEGORY_NAMES: Record<AchievementCategory, string> = {
  games: 'Игры',
  social: 'Социальные',
  exploration: 'Исследование',
  streaks: 'Серии',
  special: 'Особые',
}

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: 'from-gray-400 to-gray-500',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
}

export const RARITY_NAMES: Record<AchievementRarity, string> = {
  common: 'Обычное',
  uncommon: 'Необычное',
  rare: 'Редкое',
  epic: 'Эпическое',
  legendary: 'Легендарное',
}
