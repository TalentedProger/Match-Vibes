# MatchVibe - Comprehensive Technology Stack

**Version:** 1.0.0  
**Last Updated:** 2025-01-08  
**Role:** Chief Technical Officer  
**Document Type:** Technical Specification

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Technology Stack](#core-technology-stack)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend & Database](#backend--database)
5. [UI/UX Libraries](#uiux-libraries)
6. [State Management](#state-management)
7. [Forms & Validation](#forms--validation)
8. [Internationalization](#internationalization)
9. [Testing Framework](#testing-framework)
10. [Development Tools](#development-tools)
11. [Additional Libraries](#additional-libraries)
12. [Version Compatibility Matrix](#version-compatibility-matrix)
13. [Package Installation](#package-installation)

---

## Overview

MatchVibe is a **Telegram Mini App** designed for interactive, game-based social matching. The tech stack is carefully selected to ensure:

- ✅ **Maximum Performance** - Fast load times and smooth animations
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Scalability** - Ready for millions of users
- ✅ **Developer Experience** - Modern tooling and best practices
- ✅ **Telegram Integration** - Native Mini App functionality

---

## Core Technology Stack

### Platform

- **Telegram Mini Apps (WebApp)**
  - Native integration with Telegram
  - Access to user data (name, avatar)
  - Seamless authentication
  - Deep linking support

### Runtime & Framework

- **Node.js**: `20.x LTS` (Required for Next.js 15)
- **Next.js**: `15.1.8` (App Router)
- **React**: `19.x`
- **TypeScript**: `5.9.2`

---

## Frontend Architecture

### 🚀 Next.js 15.1.8 (App Router)

**Why Next.js 15 with App Router?**

- ✅ Server Components for better performance
- ✅ Built-in API routes for backend logic
- ✅ Optimized image loading
- ✅ File-based routing
- ✅ Enhanced SEO capabilities
- ✅ Streaming and Suspense support

**NPM Package:**

```json
"next": "^15.1.8"
```

**Key Features Used:**

- App Router architecture (`app/` directory)
- Server Components for data fetching
- Client Components for interactivity
- API Routes for backend integration
- Middleware for authentication
- Dynamic imports for code splitting

**Documentation:**

- Official Docs: https://nextjs.org/docs
- App Router Guide: https://nextjs.org/docs/app

---

### ⚛️ React 19

**NPM Packages:**

```json
"react": "^19.0.0",
"react-dom": "^19.0.0"
```

**Key Features:**

- React Server Components
- Improved hydration
- Enhanced hooks API
- Better error boundaries
- Automatic batching

**Documentation:** https://react.dev/

---

### 📱 Telegram Mini Apps SDK

**NPM Package:**

```json
"@telegram-apps/sdk": "^2.0.0",
"@telegram-apps/telegram-ui": "^2.0.0"
```

**Why This SDK?**

- ✅ TypeScript-first design
- ✅ Comprehensive Telegram WebApp API coverage
- ✅ React hooks integration
- ✅ UI components matching Telegram style
- ✅ Authentication helpers
- ✅ Theme detection (dark/light mode)

**Key Features:**

- `useInitData()` - Access Telegram user data
- `useThemeParams()` - Theme customization
- `useViewport()` - Viewport management
- `useBackButton()` - Native back button
- `useMainButton()` - Main action button
- `useHapticFeedback()` - Vibration feedback

**Alternative Package (for React integration):**

```json
"@vkruglikov/react-telegram-web-app": "^2.0.0"
```

**Documentation:**

- Telegram Mini Apps: https://core.telegram.org/bots/webapps
- SDK Docs: https://docs.telegram-mini-apps.com/
- Official Telegram WebApp Guide: https://core.telegram.org/bots/webapps

---

## Backend & Database

### 🗄️ Supabase (BaaS - Backend as a Service)

**NPM Packages:**

```json
"@supabase/supabase-js": "^2.45.4",
"@supabase/ssr": "^0.5.1"
```

**Why Supabase?**

- ✅ PostgreSQL database (SQL)
- ✅ Built-in authentication
- ✅ Realtime subscriptions
- ✅ Storage for images/media
- ✅ Row Level Security (RLS)
- ✅ Auto-generated REST & GraphQL APIs
- ✅ Edge Functions support
- ✅ Free tier for MVP

**Services Used:**

#### 1. **Database (PostgreSQL)**

- User profiles
- Game rooms
- Test results
- Match history
- Favorites
- Achievements

#### 2. **Authentication**

- Telegram user authentication
- Session management
- JWT token handling

#### 3. **Realtime**

- Live game synchronization
- Partner answer tracking (Premium)
- Room status updates
- Presence tracking

#### 4. **Storage**

- User avatars
- Test card images (AI-generated)
- Category illustrations
- Cached media assets

#### 5. **Edge Functions (Optional)**

- Match algorithm computation
- AI content generation hooks
- Payment processing (Telegram Stars)
- Analytics data processing

**Supabase Client Setup (Next.js App Router):**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Documentation:**

- Main Docs: https://supabase.com/docs
- JavaScript SDK: https://supabase.com/docs/reference/javascript/introduction
- Realtime: https://supabase.com/docs/guides/realtime
- Auth Guide: https://supabase.com/docs/guides/auth

---

### 🔐 Authentication Strategy

**Telegram WebApp Auth Flow:**

1. User opens Mini App from Telegram
2. Telegram provides `initData` with user info
3. Verify `initData` hash on server
4. Create/update user in Supabase
5. Issue session token
6. Store in secure httpOnly cookie

**NPM Package for Auth Verification:**

```json
"@telegram-apps/init-data-node": "^1.0.0"
```

---

## UI/UX Libraries

### 🎨 TailwindCSS 4.x (Beta/Stable)

**NPM Packages:**

```json
"tailwindcss": "^4.0.0",
"tailwindcss-animate": "^1.0.7",
"@tailwindcss/typography": "^0.5.15"
```

**Why TailwindCSS?**

- ✅ Utility-first CSS
- ✅ Minimal bundle size (only used classes)
- ✅ Dark mode support
- ✅ Responsive design made easy
- ✅ Custom design system
- ✅ Animation utilities

**Tailwind Config Highlights:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        primary: {
          /* ... */
        },
        accent: {
          /* ... */
        },
      },
      animation: {
        'swipe-left': '...',
        'swipe-right': '...',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

**Documentation:** https://tailwindcss.com/docs

---

### 🎭 shadcn/ui Components

**Installation:** Via CLI (copies components to your project)

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

**Why shadcn/ui?**

- ✅ Copy-paste components (not a library)
- ✅ Full customization
- ✅ Accessible (Radix UI primitives)
- ✅ TypeScript support
- ✅ Tailwind-based styling
- ✅ No runtime overhead

**Key Components for MatchVibe:**

- `Button` - CTA buttons
- `Card` - Test cards, result cards
- `Dialog` - Modals, invitations
- `Progress` - Game progress bar
- `Avatar` - User avatars
- `Badge` - Achievements
- `Tabs` - Category selection

**Dependencies:**

```json
"@radix-ui/react-dialog": "^1.1.2",
"@radix-ui/react-progress": "^1.1.1",
"@radix-ui/react-avatar": "^1.1.1",
"@radix-ui/react-tabs": "^1.1.1",
"class-variance-authority": "^0.7.0",
"clsx": "^2.1.1",
"tailwind-merge": "^2.5.4"
```

**Documentation:** https://ui.shadcn.com/

---

### 🌊 Framer Motion

**NPM Package:**

```json
"framer-motion": "^11.11.11"
```

**Why Framer Motion?**

- ✅ Smooth animations
- ✅ Gesture support (swipe, drag, tap)
- ✅ Layout animations
- ✅ Scroll animations
- ✅ SVG path animations
- ✅ Variants for complex sequences

**Use Cases in MatchVibe:**

- Card swipe animations (left/right)
- Page transitions
- Progress bar animations
- Result reveal animations
- Micro-interactions (button press, etc.)
- Entry/exit animations

**Example:**

```typescript
import { motion } from 'framer-motion'

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={handleSwipe}
  whileTap={{ scale: 0.95 }}
>
  {/* Swipeable card */}
</motion.div>
```

**Documentation:** https://www.framer.com/motion/

---

### 🎡 Swiper.js (Alternative/Additional)

**NPM Package:**

```json
"swiper": "^11.2.10"
```

**Why Swiper?**

- ✅ Mobile-first touch slider
- ✅ Hardware acceleration
- ✅ Extensive API
- ✅ Virtual slides for performance
- ✅ Built-in effects

**Use Case:**

- Category carousel
- Onboarding slides
- Image galleries

**Documentation:** https://swiperjs.com/

---

## State Management

### 🐻 Zustand

**NPM Package:**

```json
"zustand": "^5.0.2"
```

**Why Zustand?**

- ✅ Minimal boilerplate
- ✅ No providers needed
- ✅ TypeScript-first
- ✅ DevTools integration
- ✅ Middleware support (persist, immer)
- ✅ Small bundle size (< 2kb)

**Use Cases:**

- Global user state
- Game room state
- UI state (modals, themes)
- Temporary session data

**Example Store:**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
    }),
    { name: 'user-storage' }
  )
)
```

**Middleware:**

```json
"zustand/middleware": "included"
```

**Documentation:** https://zustand.docs.pmnd.rs/

---

## Forms & Validation

### 📝 React Hook Form

**NPM Package:**

```json
"react-hook-form": "^7.54.0"
```

**Why React Hook Form?**

- ✅ Performant (uncontrolled components)
- ✅ Small bundle size
- ✅ Easy validation integration
- ✅ TypeScript support
- ✅ DevTools

**Use Cases:**

- Profile editing
- Custom test creation
- Settings forms
- Feedback forms

**Documentation:** https://react-hook-form.com/

---

### ✅ Zod (Schema Validation)

**NPM Package:**

```json
"zod": "^3.24.2",
"@hookform/resolvers": "^3.9.1"
```

**Why Zod?**

- ✅ TypeScript-first
- ✅ Type inference
- ✅ Runtime validation
- ✅ Works with React Hook Form
- ✅ Schema composition

**Example:**

```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  website: z.string().url().optional(),
})

const form = useForm({
  resolver: zodResolver(profileSchema),
})
```

**Use Cases:**

- API request validation
- Form validation
- Environment variables validation
- Response data validation

**Documentation:** https://zod.dev/

---

## Internationalization

### 🌍 next-intl

**NPM Package:**

```json
"next-intl": "^3.24.0"
```

**Why next-intl?**

- ✅ Next.js App Router support
- ✅ Type-safe translations
- ✅ ICU message format
- ✅ Number/date formatting
- ✅ Pluralization
- ✅ Server & Client Components

**Languages:**

- 🇷🇺 Russian (MVP)
- 🇬🇧 English (Post-MVP)

**Usage:**

```typescript
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('Home')
  return <h1>{t('title')}</h1>
}
```

**Documentation:** https://next-intl-docs.vercel.app/

---

## Testing Framework

### 🧪 Vitest

**NPM Packages:**

```json
"vitest": "^3.2.4",
"@vitejs/plugin-react": "^4.3.4",
"@testing-library/react": "^16.1.0",
"@testing-library/jest-dom": "^6.6.3",
"@testing-library/user-event": "^14.5.2"
```

**Why Vitest?**

- ✅ Vite-powered (faster than Jest)
- ✅ Jest-compatible API
- ✅ ESM, TypeScript, JSX support
- ✅ Watch mode
- ✅ UI mode
- ✅ Coverage reports

**Test Types:**

- Unit tests (components, utilities)
- Integration tests (API calls)
- E2E tests (user flows)

**Documentation:** https://vitest.dev/

---

## Development Tools

### 📦 Package Manager

```json
"packageManager": "pnpm@9.0.0"
```

**Alternative:** `npm` or `yarn`

### 🔍 Code Quality

**ESLint:**

```json
"eslint": "^9.17.0",
"eslint-config-next": "^15.1.8",
"@typescript-eslint/eslint-plugin": "^8.18.2",
"@typescript-eslint/parser": "^8.18.2"
```

**Prettier:**

```json
"prettier": "^3.4.2",
"prettier-plugin-tailwindcss": "^0.6.10"
```

### 🔧 Build Tools

**PostCSS:**

```json
"postcss": "^8.4.49",
"autoprefixer": "^10.4.20"
```

---

## Additional Libraries

### 🛠️ Utilities

**Date Handling:**

```json
"date-fns": "^4.1.0"
```

**Unique IDs:**

```json
"nanoid": "^5.0.8"
```

**Utility Hooks:**

```json
"react-use": "^17.5.1"
```

**Class Name Utilities:**

```json
"clsx": "^2.1.1",
"tailwind-merge": "^2.5.4"
```

### 🎨 Icons

```json
"lucide-react": "^0.468.0"
```

**Why Lucide?**

- ✅ Beautiful consistent icons
- ✅ Tree-shakeable
- ✅ React components
- ✅ 1000+ icons

**Documentation:** https://lucide.dev/

---

### 📊 Analytics

**Telegram Analytics:**

```json
"@telegram-apps/analytics": "^1.0.0"
```

**Vercel Analytics (Optional):**

```json
"@vercel/analytics": "^1.3.1"
```

---

### 💳 Payments

**Telegram Stars Integration:**

- Built-in Telegram WebApp API
- No external SDK needed
- Integration via `@telegram-apps/sdk`

---

## Version Compatibility Matrix

| Package         | Version    | Compatibility  | Notes                         |
| --------------- | ---------- | -------------- | ----------------------------- |
| Node.js         | `20.x LTS` | ✅ Required    | Next.js 15 requirement        |
| Next.js         | `15.1.8`   | ✅ Stable      | Latest stable with App Router |
| React           | `19.x`     | ✅ Stable      | Works with Next.js 15         |
| TypeScript      | `5.9.2`    | ✅ Compatible  | Latest stable                 |
| Supabase JS     | `2.45.4`   | ✅ Compatible  | Latest stable                 |
| TailwindCSS     | `4.0.0`    | ✅ Beta/Stable | v4 is production-ready        |
| Framer Motion   | `11.x`     | ✅ Compatible  | React 19 support              |
| Zustand         | `5.0.2`    | ✅ Compatible  | React 19 support              |
| React Hook Form | `7.54.0`   | ✅ Compatible  | React 19 support              |
| Zod             | `3.24.2`   | ✅ Stable      | Latest stable                 |
| next-intl       | `3.24.0`   | ✅ Compatible  | Next.js 15 support            |
| Vitest          | `3.2.4`    | ✅ Stable      | Latest stable                 |

---

## Package Installation

### Complete `package.json` dependencies:

```json
{
  "name": "matchvibe",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.8",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "@telegram-apps/sdk": "^2.0.0",
    "@telegram-apps/telegram-ui": "^2.0.0",
    "@telegram-apps/init-data-node": "^1.0.0",

    "@supabase/supabase-js": "^2.45.4",
    "@supabase/ssr": "^0.5.1",

    "framer-motion": "^11.11.11",
    "swiper": "^11.2.10",

    "zustand": "^5.0.2",

    "react-hook-form": "^7.54.0",
    "zod": "^3.24.2",
    "@hookform/resolvers": "^3.9.1",

    "next-intl": "^3.24.0",

    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.0",

    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",

    "lucide-react": "^0.468.0",
    "date-fns": "^4.1.0",
    "nanoid": "^5.0.8",
    "react-use": "^17.5.1"
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",

    "tailwindcss": "^4.0.0",
    "tailwindcss-animate": "^1.0.7",
    "@tailwindcss/typography": "^0.5.15",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",

    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.8",
    "@typescript-eslint/eslint-plugin": "^8.18.2",
    "@typescript-eslint/parser": "^8.18.2",

    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.10",

    "vitest": "^3.2.4",
    "@vitejs/plugin-react": "^4.3.4",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/ui": "^3.2.4"
  }
}
```

---

### Installation Commands:

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

---

## Environment Variables

Create `.env.local`:

```env
# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=development
```

---

## Architecture Decisions

### Why These Choices?

✅ **Next.js 15 App Router**

- Server Components reduce client bundle
- Streaming improves perceived performance
- Built-in API routes eliminate backend complexity

✅ **Supabase over Firebase**

- PostgreSQL is more powerful than Firestore
- Better real-time performance
- Row Level Security for fine-grained permissions
- More cost-effective scaling

✅ **Zustand over Redux**

- Less boilerplate
- Better TypeScript support
- Smaller bundle size
- Sufficient for app complexity

✅ **TailwindCSS over CSS-in-JS**

- Better performance (no runtime)
- Smaller bundle size
- Easier to customize
- Better DX with autocomplete

✅ **Vitest over Jest**

- Faster test execution
- Better ESM support
- Native TypeScript support
- Modern tooling

---

## Performance Targets

- ⚡ First Contentful Paint (FCP): < 1.5s
- ⚡ Time to Interactive (TTI): < 3s
- ⚡ Largest Contentful Paint (LCP): < 2.5s
- 📦 Initial Bundle Size: < 200kb (gzipped)
- 🎯 Lighthouse Score: > 90

---

## Browser Support

- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Desktop Chrome 90+
- ✅ Desktop Firefox 88+
- ✅ Desktop Safari 14+

**Note:** Telegram Mini Apps run in Telegram's embedded browser (WebView)

---

## Deployment

### Recommended Hosting:

- **Vercel** (Next.js creators - optimized)
- **Netlify** (Good alternative)
- **Railway** (With Supabase)

### CI/CD:

- GitHub Actions
- Vercel Auto-Deploy
- Environment validation

---

## Security Considerations

1. **Telegram Auth Validation**
   - Always verify `initData` hash server-side
   - Never trust client-side user data

2. **Supabase RLS**
   - Enable Row Level Security on all tables
   - Test policies thoroughly

3. **Environment Variables**
   - Never commit `.env.local`
   - Use Vercel Environment Variables

4. **API Rate Limiting**
   - Implement rate limiting on API routes
   - Use Supabase Edge Functions limits

---

## Documentation & Resources

### Official Docs

- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- Telegram Mini Apps: https://core.telegram.org/bots/webapps
- Supabase: https://supabase.com/docs
- TailwindCSS: https://tailwindcss.com/docs

### Community

- Next.js Discord: https://discord.gg/nextjs
- Supabase Discord: https://discord.supabase.com/

---

## Conclusion

This technology stack is:

- ✅ **Production-ready**
- ✅ **Scalable** to millions of users
- ✅ **Type-safe** with TypeScript
- ✅ **Performant** with modern tooling
- ✅ **Maintainable** with clear patterns
- ✅ **Cost-effective** with Supabase free tier

All versions are **tested for compatibility** and represent the **latest stable releases** as of January 2025.

---

**Prepared by:** Chief Technical Officer  
**For:** MatchVibe Development Team  
**Status:** ✅ Ready for Implementation
