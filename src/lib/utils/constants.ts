// Game Constants
export const GAME_CONSTANTS = {
  MIN_QUESTIONS_PER_CATEGORY: 12,
  QUESTION_TIME_LIMIT: 20, // seconds
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 2,
} as const

// Category Colors (from UI_UX_doc.md)
export const CATEGORY_COLORS = {
  food: 'hsl(25, 100%, 66%)', // 255 140 80
  movies: 'hsl(276, 100%, 70%)', // 200 100 255
  animals: 'hsl(30, 100%, 74%)', // 255 180 120
  relationships: 'hsl(345, 100%, 74%)', // 255 120 150
  travel: 'hsl(210, 100%, 70%)', // 100 180 255
  self: 'hsl(240, 100%, 80%)', // 150 150 255
  fun: 'hsl(44, 100%, 70%)', // 255 200 100
} as const

// API Routes
export const API_ROUTES = {
  auth: {
    telegram: '/api/auth/telegram',
    session: '/api/auth/session',
  },
  rooms: {
    create: '/api/rooms',
    get: (id: string) => `/api/rooms/${id}`,
    join: (id: string) => `/api/rooms/${id}/join`,
  },
  categories: {
    list: '/api/categories',
    get: (id: string) => `/api/categories/${id}`,
    questions: (id: string) => `/api/categories/${id}/questions`,
  },
  game: {
    response: (roomId: string) => `/api/game/${roomId}/response`,
    calculate: (roomId: string) => `/api/game/${roomId}/calculate`,
  },
  profile: {
    get: '/api/profile',
    update: '/api/profile',
    stats: '/api/profile/stats',
  },
  favorites: '/api/favorites',
} as const

// App Routes
export const APP_ROUTES = {
  home: '/',
  categories: '/categories',
  category: (id: string) => `/categories/${id}`,
  game: (roomId: string) => `/game/${roomId}`,
  waiting: (roomId: string) => `/game/${roomId}/waiting`,
  result: (roomId: string) => `/game/${roomId}/result`,
  profile: '/profile',
  profileEdit: '/profile/edit',
  favorites: '/profile/favorites',
  stats: '/stats',
  history: '/history',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  user: 'matchvibe_user',
  theme: 'matchvibe_theme',
  language: 'matchvibe_language',
} as const
