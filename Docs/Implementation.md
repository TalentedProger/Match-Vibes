# Implementation Plan for MatchVibe

**Version:** 1.0.0  
**Last Updated:** 2025-01-08  
**Status:** Ready for Development

---

## Feature Analysis

### Identified Features

#### Must-Have (MVP)

1. Telegram Mini App integration & authentication
2. User profile system (basic)
3. Room creation & invitation links
4. Category selection (5-7 categories)
5. Interactive card game (swipe mechanism)
6. 20-second timer per card
7. Progress tracking
8. Match algorithm
9. Result display & sharing
10. Recent games history
11. Russian language support
12. Basic statistics

#### Should-Have (Phase 2)

1. Extended statistics dashboard
2. Achievements & badges
3. Favorites collection
4. Fun facts generation
5. More categories (15+ total)
6. Compatibility graphs
7. Enhanced animations

#### Nice-to-Have (Post-MVP)

1. Real-time partner view (Premium)
2. Custom test creation (Premium)
3. Extended analytics (Premium)
4. Unique themes & rare cards (Premium)
5. English language support
6. Seasonal content updates

---

## Recommended Tech Stack

### Frontend

- **Next.js:** 15.1.8 (App Router) - https://nextjs.org/docs
- **React:** 19.x - https://react.dev/
- **TypeScript:** 5.9.2 - https://www.typescriptlang.org/docs/
- **TailwindCSS:** 4.0.0 - https://tailwindcss.com/docs
- **shadcn/ui:** Latest - https://ui.shadcn.com/
- **Framer Motion:** 11.x - https://www.framer.com/motion/

### Telegram

- **SDK:** @telegram-apps/sdk 2.0.0 - https://docs.telegram-mini-apps.com/

### Backend & Database

- **Supabase:** 2.45.4 - https://supabase.com/docs

### State & Forms

- **Zustand:** 5.0.2 - https://zustand.docs.pmnd.rs/
- **React Hook Form:** 7.54.0 - https://react-hook-form.com/
- **Zod:** 3.24.2 - https://zod.dev/

### i18n & Testing

- **next-intl:** 3.24.0 - https://next-intl-docs.vercel.app/
- **Vitest:** 3.2.4 - https://vitest.dev/

---

## Implementation Stages

### Stage 1: Foundation & Setup ✅

**Duration:** 1-2 weeks  
**Status:** COMPLETED

- [x] Initialize Next.js 15 project with TypeScript
- [x] Install and configure core dependencies
- [x] Set up Supabase project and configure environment
- [x] Create initial database schema (profiles, rooms, categories, questions, responses, results)
- [x] Configure Telegram Mini App integration
- [x] Set up project structure (see project_structure.md)
- [x] Configure development environment (ESLint, Prettier, Husky)
- [x] Set up CI/CD pipeline (GitHub Actions, Vercel)

**Deliverables:** ✅ Working Next.js project, Supabase configured, Telegram bot connected

**Summary:** See `/Docs/Stage1_Completion_Summary.md` for details

---

### Stage 1.5: Telegram Bot Setup ✅

**Duration:** 1 session  
**Status:** COMPLETED

**Purpose:** Create and configure Telegram Bot as entry point for Mini App

**Documentation:** See `/Docs/Telegram_Bot_Setup.md` for detailed guide

#### Bot Configuration

- [x] Install bot framework (grammy)
- [x] Create bot infrastructure and command handlers
- [x] Set up development and production scripts
- [x] Configure environment variables

#### Command Implementation

- [x] Implement `/start` command with Mini App button
- [x] Implement `/start invite_CODE` for deep linking
- [x] Implement `/play` command (quick room creation)
- [x] Implement `/help` command (game instructions)
- [x] Implement `/stats` command (open statistics)
- [x] Implement `/profile` command (open profile)

#### Deep Linking

- [x] Implement invitation deep link handler (`/app?startapp=invite_CODE`)
- [x] Create deep link generation functions
- [x] Create share text generation functions
- [x] Ready to integrate with invitation system

#### Notifications

- [x] Set up webhook endpoint (`/api/bot/webhook`)
- [x] Implement "partner joined" notification
- [x] Implement "game results ready" notification
- [x] Implement "invitation reminder" notification

#### Development Tools

- [x] Create bot development script (polling mode)
- [x] Create webhook setup script
- [x] Add npm scripts for bot management
- [x] Configure TypeScript support

**Deliverables:** ✅

- Bot instance with all commands
- Deep linking system ready
- Webhook endpoint configured
- Notification system ready
- Development scripts working

**Summary:** See `/Docs/Stage1.5_Completion_Summary.md` for details

**Tech Stack:**

- **Bot Framework:** grammy@1.38.3 - https://grammy.dev/
- **API:** Telegram Bot API - https://core.telegram.org/bots/api
- **TypeScript Runner:** tsx@4.20.6

**Next Steps:**

1. Create bot via @BotFather (manual step)
2. Add bot token to `.env.local`
3. Test locally with `pnpm bot:dev`
4. Deploy and set webhook with `pnpm bot:webhook`

---

### Stage 2: Authentication & Profile ✅

**Duration:** 1 session  
**Status:** COMPLETED

- [x] Implement Telegram authentication with initData validation
- [x] Build user profile system (display, edit username)
- [x] Set up authentication state management (Zustand)
- [x] Create layout and navigation structure
- [x] Implement user data fetching and caching

**Deliverables:** ✅ Working authentication, user profile page, protected routes

**Summary:** See `/Docs/Stage2_Completion_Summary.md` for details

---

### Stage 3: Room & Invitation System ✅

**Duration:** 1 session  
**Status:** COMPLETED

- [x] Create room management system (create, join, track)
- [x] Build invitation system (generate links, deep linking)
- [x] Implement waiting room with auto-refresh (polling)
- [x] Create room creation flow from categories
- [x] Build invitation sharing with Telegram integration

**Deliverables:** ✅ Room creation, invitation links, waiting room, deep linking

**Summary:** See `/Docs/Stage3_Completion_Summary.md` for details

**Note:** Real-time sync via Supabase Realtime will be added in Stage 4

---

### Stage 4: Category Selection ✅

**Duration:** 1 session  
**Status:** COMPLETED

- [x] Design category data model and seed initial data
- [x] Implement category management API (GET /api/categories)
- [x] Build category selection UI (grid layout with loading/error states)
- [x] Add Database types for categories and questions

**Deliverables:** ✅ 5 categories, category selection page, API endpoint

**Categories:** Еда и напитки, Фильмы, Животные, Отношения, Путешествия

---

### Stage 5: Interactive Card Game

**Duration:** 2-3 weeks

- [ ] Create question/card data structure (12+ per category)
- [ ] Implement swipe mechanic with Framer Motion
- [ ] Build game room UI (card display, timer, progress bar)
- [ ] Implement game state management
- [ ] Add real-time synchronization between players
- [ ] Implement 20-second timer with auto-advance
- [ ] Add animations and transitions
- [ ] Enforce no-skip policy

**Deliverables:** Swipeable cards, timer, progress tracking, real-time sync, 60+ questions

---

### Stage 6: Match Algorithm

**Duration:** 1-1.5 weeks

- [ ] Design match calculation algorithm (percentage, favorites, shared items)
- [ ] Implement match calculation API
- [ ] Store results in database
- [ ] Add result caching
- [ ] Handle edge cases (no matches, incomplete responses)

**Deliverables:** Working match algorithm, result calculation API

---

### Stage 7: Result Display & Sharing

**Duration:** 1 week

- [ ] Design result screen UI with animations
- [ ] Implement result fetching and display
- [ ] Add result animations (reveal, percentage counter)
- [ ] Implement Telegram sharing functionality
- [ ] Update home page with results and history

**Deliverables:** Result screen, Telegram sharing, "Play Again" flow

---

### Stage 8: Statistics Dashboard

**Duration:** 1-1.5 weeks

- [ ] Design statistics data model and aggregation
- [ ] Build statistics API
- [ ] Create statistics page UI (metrics, graphs)
- [ ] Implement data visualization (charts)
- [ ] Add fun facts generation

**Deliverables:** Statistics dashboard, compatibility graphs, fun facts

**Optional Dependency:** `recharts: ^2.12.0`

---

### Stage 9: Game History

**Duration:** 1 week

- [ ] Implement game history storage
- [ ] Build recent games carousel on home page
- [ ] Create game detail view
- [ ] Add pagination/lazy loading

**Deliverables:** Game history tracking, recent games display

---

### Stage 10: Favorites System

**Duration:** 0.5-1 week

- [ ] Create favorites data structure
- [ ] Implement favorites tracking (auto-add after games)
- [ ] Build favorites page in profile
- [ ] Implement favorites sharing

**Deliverables:** Favorites tracking, display, shareable page

---

### Stage 11: Polish & Optimization

**Duration:** 1-2 weeks

- [ ] Conduct comprehensive testing (unit, integration, E2E)
- [ ] Optimize performance (bundle size, images, caching)
- [ ] Enhance UI/UX (animations, loading states, responsiveness)
- [ ] Implement error handling and logging
- [ ] Add analytics tracking
- [ ] Prepare for deployment
- [ ] Create documentation

**Deliverables:** Production-ready app, test coverage, optimized performance

**Performance Targets:** FCP < 1.5s, TTI < 3s, Lighthouse > 90

---

### Stage 12: Premium Features (Post-MVP)

**Duration:** Ongoing

- [ ] Implement Telegram Stars payment integration
- [ ] Build real-time partner view feature
- [ ] Create custom test builder
- [ ] Develop extended analytics
- [ ] Add unique themes & rare cards

**Deliverables:** Payment system, premium features operational

---

### Stage 13: English Translation

**Duration:** 1 week

- [ ] Extract all strings to translation files
- [ ] Translate content to English
- [ ] Implement language switcher
- [ ] Test both languages

**Deliverables:** Full English support, language switcher

---

## Timeline Estimation

### MVP Phase 1: 7-9 weeks

- Weeks 1-2: Foundation & Setup (Stage 1)
- Week 2.5: Telegram Bot Setup (Stage 1.5)
- Week 3: Authentication & Profile (Stage 2)
- Weeks 4-5: Room System & Categories (Stages 3-4)
- Weeks 6-7: Card Game (Stage 5)
- Week 8: Algorithm & Results (Stages 6-7)

### MVP Phase 2: 3-4 weeks

- Week 9: Statistics & History
- Week 10: Favorites & Polish
- Weeks 11-12: Testing & Deployment

### Post-MVP: Ongoing

- Premium features (4-6 weeks)
- English translation (1 week)
- New content updates

**Total MVP:** 10-12 weeks (2.5-3 months)

---

## Resource Links

- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **TailwindCSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **Framer Motion:** https://www.framer.com/motion/
- **Zustand:** https://zustand.docs.pmnd.rs/

---

## Success Criteria

### Technical

- Lighthouse score > 90
- FCP < 1.5s, TTI < 3s
- Bundle size < 200kb (gzipped)
- 80%+ test coverage

### User (Post-Launch)

- 1000+ MAU in first month
- 70%+ test completion rate
- 50%+ retention (7 days)

---

**Cross-References:**

- `/Docs/PRD.md` - Product requirements
- `/Docs/app_map.md` - Application architecture
- `/Docs/tech_stack.md` - Technology details
- `/Docs/project_structure.md` - Folder organization
- `/Docs/UI_UX_doc.md` - Design specifications
