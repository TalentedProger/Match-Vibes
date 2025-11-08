# MatchVibe - Telegram Mini App

**Version:** 0.1.0  
**Status:** In Development

## Overview

MatchVibe is a Telegram Mini App that helps people find shared interests and preferences through quick, interactive games. Players swipe through cards to express their likes and dislikes, then discover their compatibility and shared favorites.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript 5.9
- **Styling:** TailwindCSS 4.0, shadcn/ui
- **Backend:** Supabase (Auth, Database, Realtime)
- **State Management:** Zustand 5.0
- **Animations:** Framer Motion 11
- **Telegram:** @telegram-apps/sdk 2.0

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Supabase account
- Telegram Bot Token

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

4. Set up Supabase database (see `/Docs/Implementation.md` Stage 1)

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

See `/Docs/project_structure.md` for detailed folder organization.

## Development Workflow

See `/Docs/workflowfile.md` for development guidelines.

## Documentation

- **PRD:** `/Docs/PRD.md` - Product requirements
- **Implementation Plan:** `/Docs/Implementation.md` - Development stages
- **UI/UX Specifications:** `/Docs/UI_UX_doc.md` - Design system
- **Project Structure:** `/Docs/project_structure.md` - Folder organization
- **Bug Tracking:** `/Docs/Bug_tracking.md` - Issue log

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format with Prettier
- `pnpm type-check` - TypeScript check
- `pnpm test` - Run tests

## Telegram Mini App Setup

1. Create a bot with @BotFather
2. Get your bot token
3. Set up Web App URL in bot settings
4. Configure environment variables

## License

Private - All rights reserved

## Contact

Development Team
