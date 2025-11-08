# MatchVibe - Project Structure

**Version:** 1.0.0  
**Last Updated:** 2025-01-08  
**Document Type:** Project Organization Guide

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Root Directory Structure](#root-directory-structure)
3. [Detailed Folder Structure](#detailed-folder-structure)
4. [File Naming Conventions](#file-naming-conventions)
5. [Module Organization](#module-organization)
6. [Configuration Files](#configuration-files)
7. [Environment Variables](#environment-variables)
8. [Import Aliases](#import-aliases)

---

## Overview

This document defines the complete folder structure for the MatchVibe Telegram Mini App. The project follows **Next.js 15 App Router** conventions with additional organization for scalability and maintainability.

**Key Principles:**

- ✅ Clear separation of concerns
- ✅ Feature-based organization where appropriate
- ✅ Consistent naming conventions
- ✅ Easy to navigate and understand
- ✅ Scalable for future growth

---

## Root Directory Structure

```
matchvibe/
├── .github/                    # GitHub Actions workflows
├── .husky/                     # Git hooks
├── .vscode/                    # VS Code settings
├── public/                     # Static assets
├── src/                        # Source code (main application)
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities and helpers
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── bot/                    # Telegram Bot (Stage 1.5)
│   ├── types/                  # TypeScript types
│   ├── styles/                 # Global styles
│   └── middleware.ts           # Next.js middleware
├── tests/                      # Test files
├── docs/                       # Project documentation
├── .env.local                  # Environment variables (gitignored)
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── pnpm-lock.yaml              # Lock file
├── vitest.config.ts            # Vitest configuration
└── README.md                   # Project readme
```

---

## Detailed Folder Structure

### `/src/app/` - Next.js App Router

```
src/app/
├── (auth)/                     # Auth route group
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
│
├── (main)/                     # Main app route group (protected)
│   ├── layout.tsx              # Main layout with navigation
│   ├── page.tsx                # Home page
│   │
│   ├── categories/
│   │   ├── page.tsx            # Category selection
│   │   └── [id]/
│   │       └── page.tsx        # Category detail
│   │
│   ├── game/
│   │   └── [roomId]/
│   │       ├── page.tsx        # Game room
│   │       ├── waiting/
│   │       │   └── page.tsx    # Waiting room
│   │       └── result/
│   │           └── page.tsx    # Result screen
│   │
│   ├── profile/
│   │   ├── page.tsx            # User profile
│   │   ├── edit/
│   │   │   └── page.tsx        # Edit profile
│   │   └── favorites/
│   │       └── page.tsx        # Favorites page
│   │
│   ├── stats/
│   │   ├── page.tsx            # Statistics dashboard
│   │   └── [partnerId]/
│   │       └── page.tsx        # Partner-specific stats
│   │
│   └── history/
│       ├── page.tsx            # Game history
│       └── [gameId]/
│           └── page.tsx        # Game detail
│
├── api/                        # API routes
│   ├── auth/
│   │   ├── telegram/
│   │   │   └── route.ts        # Telegram auth validation
│   │   └── session/
│   │       └── route.ts        # Session management
│   │
│   ├── rooms/
│   │   ├── route.ts            # Create room
│   │   └── [roomId]/
│   │       ├── route.ts        # Get/update room
│   │       └── join/
│   │           └── route.ts    # Join room
│   │
│   ├── categories/
│   │   ├── route.ts            # Get all categories
│   │   └── [id]/
│   │       ├── route.ts        # Get category
│   │       └── questions/
│   │           └── route.ts    # Get questions
│   │
│   ├── game/
│   │   ├── [roomId]/
│   │   │   ├── response/
│   │   │   │   └── route.ts    # Submit answer
│   │   │   └── calculate/
│   │   │       └── route.ts    # Calculate match
│   │
│   ├── profile/
│   │   ├── route.ts            # Get/update profile
│   │   └── stats/
│   │       └── route.ts        # Get user stats
│   │
│   ├── favorites/
│   │   └── route.ts            # Get/add favorites
│   │
│   └── bot/                    # Bot API (Stage 1.5)
│       ├── webhook/
│       │   └── route.ts        # Telegram webhook
│       └── send-notification/
│           └── route.ts        # Send notification
│
├── join/                       # Deep linking routes
│   └── [code]/
│       └── page.tsx            # Join room by code
│
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── error.tsx                   # Error boundary
├── not-found.tsx               # 404 page
└── loading.tsx                 # Loading UI
```

**Route Groups Explanation:**

- `(auth)` - Authentication routes
- `(main)` - Protected main application routes
- Parentheses make the folder name invisible in URLs

---

### `/src/components/` - React Components

```
src/components/
├── ui/                         # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── progress.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── tabs.tsx
│   ├── skeleton.tsx
│   └── ...
│
├── layout/                     # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   ├── bottom-nav.tsx
│   └── sidebar.tsx
│
├── auth/                       # Authentication components
│   ├── login-button.tsx
│   ├── protected-route.tsx
│   └── auth-guard.tsx
│
├── game/                       # Game-related components
│   ├── game-card.tsx           # Swipeable card
│   ├── card-stack.tsx          # Card stack container
│   ├── timer.tsx               # Game timer
│   ├── progress-bar.tsx        # Game progress
│   ├── swipe-indicator.tsx     # Swipe direction hint
│   └── game-result.tsx         # Result display
│
├── room/                       # Room components
│   ├── room-creator.tsx        # Create room modal
│   ├── invitation-link.tsx     # Shareable link
│   ├── waiting-room.tsx        # Waiting UI
│   └── player-indicator.tsx    # Player avatars
│
├── category/                   # Category components
│   ├── category-grid.tsx       # Grid layout
│   ├── category-card.tsx       # Category card
│   └── category-detail.tsx     # Detail modal
│
├── profile/                    # Profile components
│   ├── profile-header.tsx
│   ├── profile-stats.tsx
│   ├── achievement-badge.tsx
│   └── favorites-list.tsx
│
├── stats/                      # Statistics components
│   ├── stats-overview.tsx
│   ├── compatibility-chart.tsx
│   ├── fun-fact-card.tsx
│   └── partner-list.tsx
│
├── history/                    # History components
│   ├── game-history-card.tsx
│   ├── game-carousel.tsx
│   └── game-detail.tsx
│
├── shared/                     # Shared/common components
│   ├── loading-spinner.tsx
│   ├── error-message.tsx
│   ├── empty-state.tsx
│   ├── confetti.tsx
│   ├── share-button.tsx
│   └── language-switcher.tsx
│
└── providers/                  # Context providers
    ├── telegram-provider.tsx
    ├── theme-provider.tsx
    └── query-provider.tsx
```

**Component Organization:**

- `ui/` - Base UI primitives (shadcn/ui)
- Feature folders - Components specific to a feature
- `shared/` - Reusable across features
- `providers/` - React context providers

---

### `/src/lib/` - Libraries and Utilities

```
src/lib/
├── supabase/
│   ├── client.ts               # Browser client
│   ├── server.ts               # Server client
│   ├── middleware.ts           # Middleware client
│   └── types.ts                # Supabase types
│
├── telegram/
│   ├── init.ts                 # Telegram SDK initialization
│   ├── auth.ts                 # Auth validation
│   ├── theme.ts                # Theme handling
│   ├── deep-linking.ts         # Deep link generators (Stage 1.5)
│   ├── notifications.ts        # Push notifications (Stage 1.5)
│   └── utils.ts                # Telegram utilities
│
├── api/
│   ├── client.ts               # API client setup
│   ├── rooms.ts                # Room API calls
│   ├── categories.ts           # Category API calls
│   ├── game.ts                 # Game API calls
│   ├── profile.ts              # Profile API calls
│   └── stats.ts                # Stats API calls
│
├── algorithms/
│   ├── match-calculator.ts     # Match algorithm
│   ├── favorite-selector.ts    # Favorite item logic
│   └── compatibility.ts        # Compatibility calculations
│
├── utils/
│   ├── cn.ts                   # Class name utility
│   ├── date.ts                 # Date formatting
│   ├── string.ts               # String utilities
│   ├── number.ts               # Number formatting
│   ├── validation.ts           # Input validation
│   └── constants.ts            # App constants
│
├── validations/
│   ├── auth.ts                 # Auth schemas
│   ├── room.ts                 # Room schemas
│   ├── profile.ts              # Profile schemas
│   └── game.ts                 # Game schemas
│
└── config/
    ├── site.ts                 # Site config
    └── navigation.ts           # Navigation config
```

---

### `/src/hooks/` - Custom React Hooks

```
src/hooks/
├── use-auth.ts                 # Authentication hook
├── use-user.ts                 # User data hook
├── use-telegram.ts             # Telegram SDK hook
├── use-theme.ts                # Theme management
├── use-room.ts                 # Room state hook
├── use-game.ts                 # Game state hook
├── use-timer.ts                # Timer hook
├── use-swipe.ts                # Swipe gesture hook
├── use-realtime.ts             # Supabase Realtime hook
├── use-stats.ts                # Statistics hook
├── use-toast.ts                # Toast notifications
└── use-media-query.ts          # Responsive hook
```

---

### `/src/stores/` - Zustand Stores

```
src/stores/
├── auth-store.ts               # Authentication state
├── user-store.ts               # User data state
├── room-store.ts               # Active room state
├── game-store.ts               # Game state
├── ui-store.ts                 # UI state (modals, etc)
└── settings-store.ts           # App settings
```

**Store Pattern:**

```typescript
// Example: auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
```

---

### `/src/bot/` - Telegram Bot (Stage 1.5)

```
src/bot/
├── index.ts                    # Bot instance & setup
├── commands/                   # Command handlers
│   ├── start.ts                # /start command
│   ├── play.ts                 # /play command
│   ├── help.ts                 # /help command
│   ├── stats.ts                # /stats command
│   └── profile.ts              # /profile command
├── handlers/                   # Event handlers
│   ├── deep-linking.ts         # Invitation link handler
│   ├── inline-query.ts         # Inline mode (optional)
│   └── callback-query.ts       # Button callbacks
└── utils/                      # Bot utilities
    └── notifications.ts        # Push notification functions
```

**Bot Pattern:**

```typescript
// Example: index.ts
import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

// Register commands
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
bot.command('help', handleHelpCommand)
bot.command('stats', handleStatsCommand)
bot.command('profile', handleProfileCommand)

export default bot
```

**Command Handler Pattern:**

```typescript
// Example: commands/start.ts
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export async function handleStartCommand(ctx: Context) {
  await ctx.reply('👋 Привет! Добро пожаловать в MatchVibe!', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Начать игру', web_app: { url: APP_URL } }],
      ],
    },
  })
}
```

**See Also:**

- `/Docs/Telegram_Bot_Setup.md` - Full bot setup guide
- `/Docs/Bot_Code_Examples.md` - Code examples & patterns

---

### `/src/types/` - TypeScript Types

```
src/types/
├── index.ts                    # Main type exports
├── database.ts                 # Supabase database types
├── telegram.ts                 # Telegram types
├── api.ts                      # API response types
├── game.ts                     # Game types
├── user.ts                     # User types
├── room.ts                     # Room types
├── category.ts                 # Category types
└── stats.ts                    # Statistics types
```

**Type Organization:**

```typescript
// Example: game.ts
export interface Question {
  id: string
  category_id: string
  text: string
  image_url: string
  order: number
}

export interface Response {
  question_id: string
  user_id: string
  answer: 0 | 1 // 0 = dislike, 1 = like
  timestamp: string
}

export interface GameState {
  room_id: string
  current_question: number
  total_questions: number
  responses: Response[]
  is_complete: boolean
}
```

---

### `/src/styles/` - Global Styles

```
src/styles/
├── globals.css                 # Global CSS + Tailwind imports
├── animations.css              # Custom animations
└── telegram-theme.css          # Telegram theme overrides
```

---

### `/tests/` - Test Files

```
tests/
├── unit/                       # Unit tests
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── utils/
│
├── integration/                # Integration tests
│   ├── api/
│   ├── auth/
│   └── game/
│
└── e2e/                        # End-to-end tests
    ├── game-flow.test.ts
    ├── auth-flow.test.ts
    └── profile.test.ts
```

---

### `/public/` - Static Assets

```
public/
├── images/
│   ├── logo.svg
│   ├── categories/
│   │   ├── food.png
│   │   ├── movies.png
│   │   ├── animals.png
│   │   └── ...
│   └── placeholders/
│       └── default-avatar.png
│
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
│
├── locales/                    # Translation files
│   ├── ru/
│   │   ├── common.json
│   │   ├── game.json
│   │   └── categories.json
│   └── en/
│       ├── common.json
│       ├── game.json
│       └── categories.json
│
└── manifest.json               # PWA manifest
```

---

## File Naming Conventions

### Components

- **React Components:** `kebab-case.tsx`
  - Example: `game-card.tsx`, `waiting-room.tsx`
- **Component exports:** PascalCase
  - Example: `export function GameCard() {}`

### Utilities & Hooks

- **Files:** `kebab-case.ts`
  - Example: `use-auth.ts`, `match-calculator.ts`
- **Exports:** camelCase
  - Example: `export function useAuth() {}`

### Types

- **Files:** `kebab-case.ts`
  - Example: `game.ts`, `user.ts`
- **Types/Interfaces:** PascalCase
  - Example: `export interface GameState {}`

### API Routes

- **Files:** `route.ts` (Next.js convention)
- **Folders:** `kebab-case`

### Pages

- **Files:** `page.tsx` (Next.js convention)

---

## Module Organization

### Feature-Based Structure Example

For large features, consider grouping related files:

```
src/features/
├── game/
│   ├── components/
│   │   ├── game-card.tsx
│   │   └── timer.tsx
│   ├── hooks/
│   │   ├── use-game.ts
│   │   └── use-swipe.ts
│   ├── stores/
│   │   └── game-store.ts
│   ├── types/
│   │   └── game.ts
│   └── utils/
│       └── game-logic.ts
```

**Note:** For MatchVibe MVP, the flat structure is sufficient. Consider feature-based organization for future scaling.

---

## Configuration Files

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-project.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
      animation: {
        'swipe-left': 'swipeLeft 0.3s ease-out',
        'swipe-right': 'swipeRight 0.3s ease-out',
      },
      keyframes: {
        swipeLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        swipeRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## Environment Variables

### `.env.example`

```env
# Telegram Mini App
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_BOT_USERNAME=YourBotUsername

# Telegram Bot (Stage 1.5)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=matchvibe_bot
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_TELEGRAM_ANALYTICS_TOKEN=
```

**Note:**

- `TELEGRAM_BOT_TOKEN` is server-side only (never exposed to client)
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `TELEGRAM_WEBHOOK_SECRET` is used to verify webhook authenticity in production

### `.env.local` (gitignored)

Contains actual values for local development.

---

## Import Aliases

Configured in `tsconfig.json`:

```typescript
// Instead of:
import { Button } from '../../../components/ui/button'

// Use:
import { Button } from '@/components/ui/button'

// Other aliases:
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GameState } from '@/types/game'
```

**Available Aliases:**

- `@/*` - src root
- `@/components/*` - components folder
- `@/lib/*` - libraries
- `@/hooks/*` - hooks
- `@/stores/*` - stores
- `@/bot/*` - bot commands & handlers
- `@/types/*` - types
- `@/styles/*` - styles

---

## Best Practices

### Component Organization

1. Keep components small and focused
2. Use composition over props drilling
3. Co-locate related components
4. Extract reusable logic to hooks

### File Organization

1. Group by feature when it makes sense
2. Keep flat structure for small projects
3. Use index files sparingly (prefer explicit imports)
4. Keep test files close to source

### Import Order

```typescript
// 1. External libraries
import React from 'react'
import { motion } from 'framer-motion'

// 2. Internal aliases
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 3. Relative imports
import { GameCard } from './game-card'

// 4. Types
import type { Game } from '@/types/game'

// 5. Styles
import './styles.css'
```

---

## Database Schema Organization

While not in the codebase, document your Supabase schema:

```
Database Tables:
├── profiles
├── rooms
├── categories
├── questions
├── responses
├── results
├── favorites
├── achievements
└── user_achievements
```

Refer to Stage 1 in `/Docs/Implementation.md` for detailed schema.

---

## Commands Reference

### Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript check
pnpm test         # Run tests
pnpm test:ui      # Run tests with UI
```

---

## Notes

- This structure supports MVP and scales for future features
- Follows Next.js 15 App Router best practices
- Optimized for TypeScript and type safety
- Clear separation between client and server code
- Easy to understand and navigate
- Consistent with modern React patterns

---

**Cross-References:**

- See `/Docs/Implementation.md` for development stages
- See `/Docs/tech_stack.md` for technology details
- See `/Docs/UI_UX_doc.md` for component specifications
