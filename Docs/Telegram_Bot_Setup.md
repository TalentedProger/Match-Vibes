# Telegram Bot Setup Guide

**Project:** MatchVibe  
**Purpose:** Launch & manage Telegram Mini App  
**Status:** To be implemented in Stage 1.5

---

## 📋 Overview

This document describes the complete setup and configuration of the Telegram Bot that serves as the entry point for the MatchVibe Mini App.

**Key Functions:**

- Launch Mini App via Web App button
- Handle deep linking for invitations
- Provide bot commands for navigation
- Send notifications (optional)
- Inline mode for sharing (optional)

---

## 🤖 Bot Creation

### Step 1: Create Bot via BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions:
   - **Bot name:** MatchVibe
   - **Bot username:** `matchvibe_bot` (or similar, must be unique)
4. Save the **Bot Token** (keep it secret!)
   - Format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. Save bot token to `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

### Step 2: Configure Bot Settings

Send these commands to @BotFather:

```
/setdescription
Description:
🎮 Найди общий вайб с друзьями! Проходите тесты вместе и узнайте, насколько вы совместимы в вкусах, интересах и предпочтениях.

/setabouttext
About:
MatchVibe — это социальная игра для двоих в формате Telegram Mini App. Свайпайте карточки, сравнивайте ответы и находите общие интересы!

/setuserpic
Upload: Logo image (512x512 px recommended)

/setcommands
Commands:
start - 🎮 Начать игру
play - 🎯 Создать комнату
help - ❓ Помощь
stats - 📊 Моя статистика
profile - 👤 Мой профиль
```

### Step 3: Configure Mini App

```
/newapp
Select bot: @matchvibe_bot
App name: MatchVibe
Description: Игровое приложение для проверки совместимости
Photo: Upload app icon (640x360 px)
GIF: Upload demo GIF (optional)
Web App URL: https://your-app-url.vercel.app
```

After deployment, update URL:

```
/editapp
Select bot: @matchvibe_bot
Select app: MatchVibe
Edit Web App URL: https://matchvibe.vercel.app
```

---

## 🔧 Bot Commands Implementation

### Command Handlers

```typescript
// src/bot/commands.ts
export const BOT_COMMANDS = {
  start: {
    command: 'start',
    description: '🎮 Начать игру',
    handler: async ctx => {
      await ctx.reply(
        '👋 Привет! Добро пожаловать в MatchVibe!\n\n' +
          '🎮 Играй с друзьями и узнай, насколько совпадают ваши вкусы!\n\n' +
          '✨ Нажми кнопку ниже, чтобы начать:',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Играть', web_app: { url: APP_URL } }],
              [{ text: '❓ Как играть?', callback_data: 'help' }],
            ],
          },
        }
      )
    },
  },

  play: {
    command: 'play',
    description: '🎯 Создать комнату',
    handler: async ctx => {
      await ctx.reply('🎯 Создай комнату и пригласи друга!', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Создать комнату',
                web_app: { url: `${APP_URL}/categories` },
              },
            ],
          ],
        },
      })
    },
  },

  help: {
    command: 'help',
    description: '❓ Помощь',
    handler: async ctx => {
      await ctx.reply(
        '📖 *Как играть в MatchVibe:*\n\n' +
          '1️⃣ Создай комнату и выбери категорию\n' +
          '2️⃣ Отправь ссылку-приглашение другу\n' +
          '3️⃣ Свайпайте карточки вместе\n' +
          '4️⃣ Узнайте результаты совместимости!\n\n' +
          '⏱ У вас 20 секунд на каждую карточку\n' +
          '➡️ Вправо = нравится\n' +
          '⬅️ Влево = не нравится\n\n' +
          '💡 Совет: играйте честно для точных результатов!',
        { parse_mode: 'Markdown' }
      )
    },
  },

  stats: {
    command: 'stats',
    description: '📊 Моя статистика',
    handler: async ctx => {
      await ctx.reply('📊 Твоя статистика:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📊 Открыть статистику',
                web_app: { url: `${APP_URL}/stats` },
              },
            ],
          ],
        },
      })
    },
  },

  profile: {
    command: 'profile',
    description: '👤 Мой профиль',
    handler: async ctx => {
      await ctx.reply('👤 Твой профиль:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '👤 Открыть профиль',
                web_app: { url: `${APP_URL}/profile` },
              },
            ],
          ],
        },
      })
    },
  },
}
```

---

## 🔗 Deep Linking

### Invitation Links Format

```
https://t.me/matchvibe_bot/app?startapp=invite_ABC123XYZ
```

**Parameters:**

- `invite_` prefix for invitation codes
- Code format: `{invitation_code}`

### Handler Implementation

```typescript
// src/bot/deep-linking.ts
export async function handleStartParam(ctx, startParam: string) {
  if (startParam.startsWith('invite_')) {
    const invitationCode = startParam.replace('invite_', '')

    await ctx.reply(
      '🎉 Тебя пригласили в игру!\n\n' +
        '👥 Присоединяйся к комнате и начни игру:',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Присоединиться',
                web_app: { url: `${APP_URL}/join/${invitationCode}` },
              },
            ],
          ],
        },
      }
    )
  } else {
    // Default start message
    await handleStartCommand(ctx)
  }
}
```

### Generate Deep Link (Mini App)

```typescript
// src/lib/telegram/sharing.ts
export function generateInvitationDeepLink(invitationCode: string): string {
  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'matchvibe_bot'
  return `https://t.me/${botUsername}/app?startapp=invite_${invitationCode}`
}

export function generateShareText(invitationCode: string): string {
  return (
    '🎮 Присоединяйся к игре в MatchVibe!\n\n' +
    '👥 Давай узнаем, насколько совпадают наши вкусы!\n\n' +
    `🔗 Код приглашения: ${invitationCode}`
  )
}
```

---

## 📱 Inline Mode (Optional)

Enable inline mode for sharing results:

```
/setinline
Select bot: @matchvibe_bot
Enable inline mode: Yes
Placeholder: Поделиться результатом игры
```

### Inline Query Handler

```typescript
// src/bot/inline.ts
export async function handleInlineQuery(ctx) {
  const query = ctx.inlineQuery.query

  // Fetch user's recent games
  const games = await getUserGames(ctx.from.id)

  const results = games.map((game, index) => ({
    type: 'article',
    id: index.toString(),
    title: `${game.category} — ${game.matchPercentage}% совпадений`,
    description: `Игра с ${game.partnerName}`,
    input_message_content: {
      message_text:
        `🎮 *MatchVibe Result*\n\n` +
        `📂 Категория: ${game.category}\n` +
        `💯 Совпадение: ${game.matchPercentage}%\n` +
        `🎯 Общий вкус: ${game.sharedItem}\n\n` +
        `Хочешь проверить свою совместимость? @matchvibe_bot`,
      parse_mode: 'Markdown',
    },
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Попробовать', url: 't.me/matchvibe_bot/app' }],
      ],
    },
  }))

  await ctx.answerInlineQuery(results)
}
```

---

## 🔔 Notifications (Optional)

### Webhook Setup

```typescript
// src/app/api/bot/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Bot } from 'grammy'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    await bot.handleUpdate(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
```

### Set Webhook

```bash
curl -X POST \
  https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d url=https://your-app-url.vercel.app/api/bot/webhook \
  -d secret_token=your_secret_token
```

### Notification Types

1. **Partner Joined Room**

   ```typescript
   await bot.api.sendMessage(
     hostUserId,
     '✅ Партнёр присоединился к комнате! Игра начинается...',
     {
       reply_markup: {
         inline_keyboard: [
           [
             {
               text: '🎮 Открыть игру',
               web_app: { url: `${APP_URL}/game/${roomId}` },
             },
           ],
         ],
       },
     }
   )
   ```

2. **Game Results Ready**

   ```typescript
   await bot.api.sendMessage(
     userId,
     `🎉 Результаты готовы!\n\n💯 Совпадение: ${matchPercentage}%`,
     {
       reply_markup: {
         inline_keyboard: [
           [
             {
               text: '📊 Смотреть результаты',
               web_app: { url: `${APP_URL}/results/${gameId}` },
             },
           ],
         ],
       },
     }
   )
   ```

3. **Invitation Reminder**
   ```typescript
   await bot.api.sendMessage(
     guestUserId,
     '⏰ Тебя ждут в игре! Не забудь присоединиться.',
     {
       reply_markup: {
         inline_keyboard: [
           [
             {
               text: '🎮 Присоединиться',
               web_app: { url: `${APP_URL}/join/${code}` },
             },
           ],
         ],
       },
     }
   )
   ```

---

## 🛠️ Bot Framework Options

### Option 1: grammy (Recommended)

```bash
pnpm add grammy
```

**Pros:**

- Modern, TypeScript-first
- Excellent documentation
- Built-in Web App support

```typescript
// src/bot/index.ts
import { Bot, webhookCallback } from 'grammy'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

// Register commands
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
bot.command('help', handleHelpCommand)

export default bot
```

### Option 2: node-telegram-bot-api

```bash
pnpm add node-telegram-bot-api
pnpm add -D @types/node-telegram-bot-api
```

**Pros:**

- Battle-tested
- Large community

### Option 3: telegraf

```bash
pnpm add telegraf
```

**Pros:**

- Popular
- Middleware support

---

## 📁 File Structure

```
src/
├── bot/
│   ├── index.ts                 # Bot instance & setup
│   ├── commands.ts              # Command handlers
│   ├── deep-linking.ts          # Invitation link handlers
│   ├── inline.ts                # Inline mode handlers (optional)
│   └── notifications.ts         # Push notification functions (optional)
├── app/
│   └── api/
│       └── bot/
│           ├── webhook/
│           │   └── route.ts     # Webhook endpoint
│           └── send-notification/
│               └── route.ts     # Send notification API
└── lib/
    └── telegram/
        ├── bot-client.ts        # Bot API wrapper
        └── sharing.ts           # Share link generators
```

---

## 🔐 Security

### Environment Variables

```env
# .env.local
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=matchvibe_bot
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret_token
```

### Webhook Security

1. Use HTTPS only
2. Verify secret token in webhook
3. Validate user data

```typescript
export async function POST(request: NextRequest) {
  const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')

  if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Process webhook...
}
```

---

## 🧪 Testing

### Development Testing

```bash
# Start bot in polling mode (development)
pnpm run bot:dev
```

```typescript
// scripts/bot-dev.ts
import { bot } from '@/bot'

bot.start({
  drop_pending_updates: true,
  onStart: () => console.log('Bot started in polling mode'),
})
```

### Test Commands

1. Open Telegram
2. Search for your bot: `@matchvibe_bot`
3. Send `/start`
4. Click "🎮 Играть" button
5. Verify Mini App opens

### Test Deep Links

```
https://t.me/matchvibe_bot/app?startapp=invite_TEST123
```

---

## 📊 Monitoring

### Bot Analytics

Track:

- Command usage frequency
- Web App launch rate
- Deep link click-through rate
- User retention

### Logging

```typescript
// src/lib/logger.ts
export function logBotCommand(userId: number, command: string) {
  console.log(`[BOT] User ${userId} used command: ${command}`)
  // Send to analytics service
}
```

---

## 🚀 Deployment Checklist

- [ ] Bot created via @BotFather
- [ ] Bot token saved to environment
- [ ] Bot commands configured
- [ ] Mini App URL set
- [ ] Deep linking tested
- [ ] Webhook configured (production)
- [ ] Security tokens set
- [ ] Notifications implemented (optional)
- [ ] Inline mode enabled (optional)
- [ ] Bot verified and working

---

## 📚 Resources

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **grammy Documentation:** https://grammy.dev/
- **BotFather:** https://t.me/BotFather

---

## 🎯 Stage 1.5 Implementation Goals

**Must Have:**

- ✅ Bot created and configured
- ✅ `/start`, `/play`, `/help` commands
- ✅ Web App button integration
- ✅ Deep linking for invitations

**Should Have:**

- ✅ `/stats` and `/profile` commands
- ✅ Webhook for notifications
- ✅ Partner joined notification

**Nice to Have:**

- ⏳ Inline mode for results sharing
- ⏳ Game reminder notifications
- ⏳ Achievement notifications

---

**Next:** See `/Docs/Implementation.md` Stage 1.5 for task breakdown
