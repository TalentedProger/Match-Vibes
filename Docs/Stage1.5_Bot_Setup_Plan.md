# Stage 1.5: Telegram Bot Setup - Implementation Plan

**Project:** MatchVibe  
**Stage:** 1.5 (between Stage 1 and Stage 2)  
**Priority:** HIGH - Bot is entry point for Mini App  
**Status:** READY TO IMPLEMENT

---

## 🎯 Overview

**Problem Identified:**
В плане реализации отсутствовал Telegram Bot, который является обязательным entry point для Telegram Mini App. Пользователи не смогут запустить приложение без бота.

**Solution:**
Добавлен Stage 1.5 для создания полнофункционального Telegram Bot с командами, deep linking и опциональными уведомлениями.

---

## 📋 Implementation Checklist

### 1. Bot Configuration (30-60 min)

- [ ] Создать бота через @BotFather
- [ ] Сохранить bot token в `.env.local`
- [ ] Настроить описание и команды бота
- [ ] Настроить иконку бота
- [ ] Создать Mini App в настройках бота
- [ ] Указать URL Mini App

**Commands:**

```
start - 🎮 Начать игру
play - 🎯 Создать комнату
help - ❓ Помощь
stats - 📊 Моя статистика
profile - 👤 Мой профиль
```

---

### 2. Install Dependencies (5 min)

```bash
pnpm add grammy
```

---

### 3. Create Bot Files (2-3 hours)

#### Core Bot Setup

- [ ] `src/bot/index.ts` - Bot instance
- [ ] `src/bot/commands/start.ts` - /start command
- [ ] `src/bot/commands/play.ts` - /play command
- [ ] `src/bot/commands/help.ts` - /help command
- [ ] `src/bot/commands/stats.ts` - /stats command
- [ ] `src/bot/commands/profile.ts` - /profile command

#### Deep Linking

- [ ] `src/lib/telegram/deep-linking.ts` - Link generators
- [ ] Update invitation sharing to use deep links
- [ ] Test deep link flow

#### API Routes

- [ ] `src/app/api/bot/webhook/route.ts` - Webhook handler
- [ ] `src/app/api/bot/send-notification/route.ts` - Notification API

---

### 4. Notifications (Optional - 1-2 hours)

- [ ] `src/lib/telegram/notifications.ts` - Helper functions
- [ ] Implement "partner joined" notification
- [ ] Implement "game results" notification
- [ ] Add notification triggers in room/game logic

---

### 5. Testing (30-60 min)

- [ ] Test `/start` command
- [ ] Test Web App button opens correctly
- [ ] Test all commands work
- [ ] Test deep linking with invitation codes
- [ ] Test notifications (if implemented)

---

### 6. Production Setup (30 min)

- [ ] Deploy Mini App to Vercel
- [ ] Update bot Mini App URL
- [ ] Set webhook (production)
- [ ] Test end-to-end flow

---

## 📁 Files to Create

```
src/
├── bot/
│   ├── index.ts                     # ✅ Create
│   ├── commands/
│   │   ├── start.ts                 # ✅ Create
│   │   ├── play.ts                  # ✅ Create
│   │   ├── help.ts                  # ✅ Create
│   │   ├── stats.ts                 # ✅ Create
│   │   └── profile.ts               # ✅ Create
│   └── handlers/
│       └── deep-linking.ts          # ✅ Create (optional)
│
├── lib/
│   └── telegram/
│       ├── deep-linking.ts          # ✅ Create
│       └── notifications.ts         # ✅ Create (optional)
│
├── app/
│   └── api/
│       └── bot/
│           ├── webhook/
│           │   └── route.ts         # ✅ Create
│           └── send-notification/
│               └── route.ts         # ✅ Create (optional)
│
└── scripts/
    ├── bot-dev.ts                   # ✅ Create (for testing)
    └── set-webhook.ts               # ✅ Create (for production)
```

---

## 🔧 Environment Variables to Add

Update `.env.local`:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=matchvibe_bot
TELEGRAM_WEBHOOK_SECRET=your_random_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

Update `.env.example` to include these variables.

---

## 📝 Code Snippets

### Quick Start Template

**src/bot/index.ts:**

```typescript
import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'
import { handleHelpCommand } from './commands/help'
import { handleStatsCommand } from './commands/stats'
import { handleProfileCommand } from './commands/profile'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
bot.command('help', handleHelpCommand)
bot.command('stats', handleStatsCommand)
bot.command('profile', handleProfileCommand)

export default bot
```

**src/bot/commands/start.ts:**

```typescript
import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

export async function handleStartCommand(ctx: Context) {
  await ctx.reply(
    '👋 Привет! Добро пожаловать в MatchVibe!\n\n' +
      '🎮 Играй с друзьями и узнай совместимость!',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Начать игру', web_app: { url: APP_URL } }],
        ],
      },
    }
  )
}
```

See `/Docs/Bot_Code_Examples.md` for complete examples.

---

## 🧪 Testing Workflow

### Local Development

```bash
# Terminal 1: Run Mini App
pnpm dev

# Terminal 2: Run bot in polling mode
pnpm bot:dev
```

### Test Checklist

1. Open Telegram
2. Find your bot: `@matchvibe_bot`
3. Send `/start`
4. Click "🎮 Начать игру"
5. Verify Mini App opens
6. Create a room
7. Copy invitation link
8. Test deep link in another chat

---

## 📚 Documentation References

### Created Documents

- ✅ `/Docs/Telegram_Bot_Setup.md` - Full setup guide
- ✅ `/Docs/Bot_Code_Examples.md` - Ready-to-use code
- ✅ `/Docs/Implementation.md` - Updated with Stage 1.5
- ✅ `/Docs/project_structure.md` - Updated structure

### External Resources

- **grammy:** https://grammy.dev/
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **BotFather:** https://t.me/BotFather

---

## ⏱️ Time Estimate

| Task              | Time          | Priority     |
| ----------------- | ------------- | ------------ |
| Bot configuration | 30-60 min     | Must Have    |
| Core commands     | 2-3 hours     | Must Have    |
| Deep linking      | 1 hour        | Must Have    |
| Webhook setup     | 30 min        | Must Have    |
| Notifications     | 1-2 hours     | Nice to Have |
| Testing           | 1 hour        | Must Have    |
| **Total**         | **5-8 hours** |              |

**Recommendation:** Complete Must Have features first (4-5 hours), then add notifications if time permits.

---

## 🎯 Success Criteria

- [ ] Bot responds to all commands
- [ ] Web App opens from bot
- [ ] Deep linking works for invitations
- [ ] Users can start game from bot
- [ ] All bot features documented
- [ ] Production webhook configured

---

## ⚠️ Important Notes

### Security

- **Never commit** `TELEGRAM_BOT_TOKEN` to git
- Use `TELEGRAM_WEBHOOK_SECRET` in production
- Validate all webhook requests

### Development vs Production

- **Development:** Use polling mode (`bot.start()`)
- **Production:** Use webhook mode (Vercel function)

### Mini App URL

- **Development:** `http://localhost:3002`
- **Production:** `https://matchvibe.vercel.app`
- Update URL in bot settings after deployment

---

## 🐛 Common Issues & Solutions

### Issue: "Unable to retrieve launch parameters"

**Solution:** ✅ Already fixed in `src/lib/telegram/init.ts`

- Added environment check
- Graceful fallback for non-Telegram environments

### Issue: Bot doesn't respond

**Check:**

1. Bot token is correct
2. Bot is running (polling or webhook)
3. Commands are registered correctly

### Issue: Web App doesn't open

**Check:**

1. Mini App URL is set in @BotFather
2. URL is correct (http in dev, https in prod)
3. App is deployed and accessible

---

## 🚀 Next Steps After Stage 1.5

1. **Stage 2:** Authentication & Profile (already completed)
2. **Stage 3:** Room & Invitation System (already completed)
3. Update invitation sharing to use bot deep links
4. Optionally add more bot commands
5. Monitor bot usage and errors

---

## 📊 Integration with Existing Stages

### Stage 3 Integration

Update `src/components/room/invitation-link.tsx`:

```typescript
import { generateInvitationDeepLink } from '@/lib/telegram/deep-linking'

const deepLink = generateInvitationDeepLink(invitationCode)
// Use deepLink instead of direct URL
```

### Future Integration Points

- **Stage 6:** Send results notification
- **Stage 8:** Bot command to view stats
- **Stage 11:** Bot analytics

---

## ✅ Completion Checklist

When Stage 1.5 is complete:

- [ ] All bot commands working
- [ ] Deep linking tested
- [ ] Production webhook configured
- [ ] Documentation reviewed
- [ ] Mark Stage 1.5 as ✅ in `/Docs/Implementation.md`
- [ ] Create `/Docs/Stage1.5_Completion_Summary.md`

---

**Status:** READY TO IMPLEMENT  
**Priority:** HIGH  
**Estimated Time:** 5-8 hours  
**Blocking:** None (can be done in parallel with other stages)

---

**Start with:**

1. Create bot in @BotFather
2. Install grammy
3. Copy code from `/Docs/Bot_Code_Examples.md`
4. Test locally
5. Deploy to production

Good luck! 🚀
