# Telegram Bot - Code Examples

**Project:** MatchVibe  
**Purpose:** Ready-to-use code snippets for bot implementation

---

## 📦 Installation

```bash
pnpm add grammy
```

---

## 🤖 Bot Setup

### Environment Variables

```env
# .env.local
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=matchvibe_bot
TELEGRAM_WEBHOOK_SECRET=your_secret_token_here
NEXT_PUBLIC_APP_URL=https://matchvibe.vercel.app
```

---

## 🔧 Bot Instance

### `src/bot/index.ts`

```typescript
import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'
import { handleHelpCommand } from './commands/help'
import { handleStatsCommand } from './commands/stats'
import { handleProfileCommand } from './commands/profile'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set')
}

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

// Register commands
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
bot.command('help', handleHelpCommand)
bot.command('stats', handleStatsCommand)
bot.command('profile', handleProfileCommand)

// Error handler
bot.catch(err => {
  console.error('Bot error:', err)
})

export default bot
```

---

## 📝 Command Handlers

### `src/bot/commands/start.ts`

```typescript
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

export async function handleStartCommand(ctx: Context) {
  const startParam = ctx.match as string

  // Handle deep linking
  if (startParam && startParam.startsWith('invite_')) {
    const invitationCode = startParam.replace('invite_', '')

    await ctx.reply(
      '🎉 *Тебя пригласили в игру!*\n\n' +
        '👥 Присоединяйся к комнате и начни проходить тест вместе с другом.\n\n' +
        '✨ Узнайте, насколько совпадают ваши вкусы!',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Присоединиться к игре',
                web_app: { url: `${APP_URL}/join/${invitationCode}` },
              },
            ],
            [{ text: '❓ Как играть?', callback_data: 'help' }],
          ],
        },
      }
    )
    return
  }

  // Default welcome message
  const firstName = ctx.from?.first_name || 'друг'

  await ctx.reply(
    `👋 *Привет, ${firstName}!*\n\n` +
      '🎮 Добро пожаловать в *MatchVibe* — игру для проверки совместимости!\n\n' +
      '✨ *Как это работает:*\n' +
      '• Создай комнату и выбери категорию\n' +
      '• Отправь ссылку другу\n' +
      '• Свайпайте карточки вместе\n' +
      '• Узнайте результаты!\n\n' +
      '🎯 Готов начать?',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Начать игру', web_app: { url: APP_URL } }],
          [
            { text: '❓ Помощь', callback_data: 'help' },
            { text: '📊 Статистика', callback_data: 'stats' },
          ],
        ],
      },
    }
  )
}
```

### `src/bot/commands/play.ts`

```typescript
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

export async function handlePlayCommand(ctx: Context) {
  await ctx.reply(
    '🎯 *Создай комнату и пригласи друга!*\n\n' +
      'Выбери категорию и начни игру:',
    {
      parse_mode: 'Markdown',
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
    }
  )
}
```

### `src/bot/commands/help.ts`

```typescript
import { Context } from 'grammy'

export async function handleHelpCommand(ctx: Context) {
  await ctx.reply(
    '📖 *Как играть в MatchVibe*\n\n' +
      '*Шаг 1:* Создай комнату\n' +
      'Нажми "Создать комнату" и выбери категорию (еда, фильмы, путешествия...)\n\n' +
      '*Шаг 2:* Пригласи друга\n' +
      'Отправь ему ссылку-приглашение через Telegram\n\n' +
      '*Шаг 3:* Играй вместе\n' +
      'Свайпайте карточки одновременно:\n' +
      '• ➡️ Вправо = нравится\n' +
      '• ⬅️ Влево = не нравится\n' +
      '• ⏱ 20 секунд на карточку\n\n' +
      '*Шаг 4:* Смотри результаты\n' +
      'Узнай процент совпадений и общие интересы!\n\n' +
      '💡 *Совет:* Отвечай честно для точных результатов\n\n' +
      '_Доступные команды:_\n' +
      '/start — Главное меню\n' +
      '/play — Создать комнату\n' +
      '/stats — Моя статистика\n' +
      '/profile — Мой профиль\n' +
      '/help — Эта справка',
    {
      parse_mode: 'Markdown',
    }
  )
}
```

### `src/bot/commands/stats.ts`

```typescript
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

export async function handleStatsCommand(ctx: Context) {
  await ctx.reply(
    '📊 *Твоя статистика*\n\n' +
      'Открой приложение, чтобы посмотреть:\n' +
      '• Количество пройденных игр\n' +
      '• Средний процент совпадений\n' +
      '• Любимые категории\n' +
      '• История игр',
    {
      parse_mode: 'Markdown',
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
    }
  )
}
```

### `src/bot/commands/profile.ts`

```typescript
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

export async function handleProfileCommand(ctx: Context) {
  const firstName = ctx.from?.first_name || 'друг'

  await ctx.reply(
    `👤 *Профиль: ${firstName}*\n\n` + 'Управляй своим профилем в приложении:',
    {
      parse_mode: 'Markdown',
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
    }
  )
}
```

---

## 🔗 Deep Linking Helper

### `src/lib/telegram/deep-linking.ts`

```typescript
export function generateInvitationDeepLink(invitationCode: string): string {
  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'matchvibe_bot'
  return `https://t.me/${botUsername}/app?startapp=invite_${invitationCode}`
}

export function generateInvitationShareText(invitationCode: string): string {
  return (
    '🎮 Присоединяйся к игре в MatchVibe!\n\n' +
    '👥 Давай узнаем, насколько совпадают наши вкусы!\n\n' +
    `🔗 Код: ${invitationCode}`
  )
}

export function parseStartParam(
  startParam: string
): { type: string; code: string } | null {
  if (startParam.startsWith('invite_')) {
    return {
      type: 'invitation',
      code: startParam.replace('invite_', ''),
    }
  }
  return null
}
```

### Usage in Room Store

Update `src/stores/room-store.ts`:

```typescript
import { generateInvitationDeepLink } from '@/lib/telegram/deep-linking'

// In useRoomStore...
const getInvitationDeepLink = useCallback(() => {
  if (!invitationCode) return null
  return generateInvitationDeepLink(invitationCode)
}, [invitationCode])

return {
  // ... other properties
  getInvitationDeepLink,
}
```

Update `src/components/room/invitation-link.tsx`:

```typescript
const handleShare = () => {
  const deepLink = generateInvitationDeepLink(invitationCode)
  const text = generateInvitationShareText(invitationCode)

  if (shareUrl) {
    shareUrl(deepLink, text)
  } else {
    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(text)}`
    window.open(shareLink, '_blank')
  }
}
```

---

## 🔔 Webhook Setup (Production)

### `src/app/api/bot/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { webhookCallback } from 'grammy'
import { bot } from '@/bot'

// Verify webhook secret
function verifyWebhookSecret(request: NextRequest): boolean {
  const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
  return secretToken === process.env.TELEGRAM_WEBHOOK_SECRET
}

export async function POST(request: NextRequest) {
  // Security check
  if (!verifyWebhookSecret(request)) {
    console.error('Invalid webhook secret')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const update = await request.json()

    // Handle the update using grammy
    await webhookCallback(bot, 'std/http')(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', bot: 'MatchVibe' })
}
```

### Set Webhook Script

Create `scripts/set-webhook.ts`:

```typescript
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/bot/webhook`
const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET

async function setWebhook() {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        secret_token: SECRET_TOKEN,
        allowed_updates: ['message', 'callback_query', 'inline_query'],
      }),
    }
  )

  const data = await response.json()
  console.log('Webhook set:', data)
}

setWebhook()
```

Run after deployment:

```bash
tsx scripts/set-webhook.ts
```

---

## 📨 Notification Functions

### `src/lib/telegram/notifications.ts`

```typescript
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: any
) {
  try {
    const response = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
      }),
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
    throw error
  }
}

export async function notifyPartnerJoined(
  hostTelegramId: number,
  roomId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  await sendTelegramMessage(
    hostTelegramId,
    '✅ *Партнёр присоединился!*\n\nИгра начинается...',
    {
      inline_keyboard: [
        [
          {
            text: '🎮 Открыть игру',
            web_app: { url: `${appUrl}/game/${roomId}` },
          },
        ],
      ],
    }
  )
}

export async function notifyGameResults(
  userTelegramId: number,
  gameId: string,
  matchPercentage: number
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  await sendTelegramMessage(
    userTelegramId,
    `🎉 *Результаты готовы!*\n\n💯 Совпадение: ${matchPercentage}%\n\nПосмотри полные результаты в приложении!`,
    {
      inline_keyboard: [
        [
          {
            text: '📊 Смотреть результаты',
            web_app: { url: `${appUrl}/results/${gameId}` },
          },
        ],
        [{ text: '🎮 Играть ещё раз', web_app: { url: appUrl } }],
      ],
    }
  )
}

export async function sendInvitationReminder(
  guestTelegramId: number,
  invitationCode: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  await sendTelegramMessage(
    guestTelegramId,
    '⏰ *Напоминание*\n\nТебя ждут в игре! Не забудь присоединиться.',
    {
      inline_keyboard: [
        [
          {
            text: '🎮 Присоединиться',
            web_app: { url: `${appUrl}/join/${invitationCode}` },
          },
        ],
      ],
    }
  )
}
```

### Usage in API Routes

In `src/app/api/rooms/[roomId]/join/route.ts`:

```typescript
import { notifyPartnerJoined } from '@/lib/telegram/notifications'

// After successful join...
if (updatedRoom) {
  // Send notification to host
  try {
    const hostTelegramId = await getHostTelegramId(updatedRoom.host_id)
    if (hostTelegramId) {
      await notifyPartnerJoined(hostTelegramId, updatedRoom.id)
    }
  } catch (error) {
    console.error('Failed to send notification:', error)
    // Don't fail the request if notification fails
  }
}
```

---

## 🧪 Development Testing

### `scripts/bot-dev.ts`

```typescript
import { bot } from '@/bot'

console.log('Starting bot in polling mode...')

// Start the bot
bot.start({
  drop_pending_updates: true,
  onStart: botInfo => {
    console.log(`Bot @${botInfo.username} started successfully!`)
    console.log('Send /start to the bot to test')
  },
})

// Handle graceful shutdown
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
```

Add to `package.json`:

```json
{
  "scripts": {
    "bot:dev": "tsx watch scripts/bot-dev.ts",
    "bot:webhook": "tsx scripts/set-webhook.ts"
  }
}
```

Run in development:

```bash
pnpm bot:dev
```

---

## 📱 Testing Checklist

- [ ] Bot responds to `/start` command
- [ ] Web App button opens Mini App
- [ ] Deep link with invitation code works
- [ ] All commands (`/play`, `/help`, `/stats`, `/profile`) work
- [ ] Notifications are sent correctly
- [ ] Webhook is configured for production

---

## 🚀 Deployment Steps

1. **Create bot via @BotFather**
   - Save token to environment
   - Configure bot settings

2. **Deploy Mini App**
   - Deploy to Vercel/hosting
   - Set up environment variables

3. **Configure Mini App URL in bot**

   ```
   /newapp or /editapp
   Web App URL: https://your-app-url.vercel.app
   ```

4. **Set webhook (production only)**

   ```bash
   pnpm bot:webhook
   ```

5. **Test bot**
   - Send `/start` in Telegram
   - Click "Играть" button
   - Verify Mini App opens
   - Test invitation deep links

---

**Related:**

- `/Docs/Telegram_Bot_Setup.md` - Full setup guide
- `/Docs/Implementation.md` - Stage 1.5 tasks
