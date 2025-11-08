# Telegram Bot Setup Guide - MatchVibe

**Version:** 1.0.0  
**Last Updated:** 2025-01-08

---

## 📋 Overview

MatchVibe runs as a Telegram Mini App (WebApp). This guide walks you through creating and configuring your Telegram bot.

---

## 🤖 Step 1: Create Bot with BotFather

1. Open Telegram and search for **@BotFather**
2. Start a chat and send `/newbot`
3. Follow the prompts:
   - **Bot name:** MatchVibe (or your preferred name)
   - **Username:** matchvibe_bot (must end with \_bot)
4. **Save the bot token** (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
5. Keep this token secret!

---

## ⚙️ Step 2: Configure Bot Settings

### Set Bot Description

```
/setdescription
@matchvibe_bot
Найди общий вайб! 🎮 Сыграй с друзьями и узнай ваши общие вкусы.
```

### Set About Text

```
/setabouttext
@matchvibe_bot
MatchVibe - игра для поиска общих интересов через свайпы.
```

### Set Bot Commands

```
/setcommands
@matchvibe_bot

start - Начать игру
profile - Мой профиль
stats - Статистика
help - Помощь
```

---

## 🌐 Step 3: Create Web App

### Set Menu Button (Web App Link)

```
/setmenubutton
@matchvibe_bot
```

Then:

1. Type: `Web App`
2. Text: `Играть`
3. URL: `https://your-domain.com` (or use `https://your-vercel-app.vercel.app` for deployment)

For local development, you'll need a tunnel (see Step 6).

---

## 🔐 Step 4: Add Environment Variables

Update your `.env.local`:

```env
# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
NEXT_PUBLIC_BOT_USERNAME=matchvibe_bot

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**⚠️ Security Note:**

- Never commit `.env.local` to git
- The bot token should be kept secret
- `NEXT_PUBLIC_` prefix makes variables accessible in browser (safe for bot username, not for token)

---

## 🚀 Step 5: Test Bot

1. Find your bot in Telegram: `@matchvibe_bot`
2. Send `/start`
3. You should see the bot respond (once you implement the start command handler)

---

## 🌍 Step 6: Local Development Setup

### Option A: Using ngrok (Recommended for Development)

Telegram Mini Apps need HTTPS. Use ngrok to expose localhost:

1. Install ngrok: https://ngrok.com/download
2. Run your Next.js app: `pnpm dev`
3. In another terminal: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update bot menu button URL with this ngrok URL
6. Open bot in Telegram and test

### Option B: Deploy to Vercel

1. Push code to GitHub
2. Deploy to Vercel
3. Get your Vercel URL
4. Update bot menu button with Vercel URL

---

## 🔧 Step 7: Implement Bot Commands (API Routes)

### Create Webhook Endpoint

Create `/src/app/api/telegram/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle /start command
    if (body.message?.text === '/start') {
      // Send welcome message
      // Open Mini App
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### Set Webhook (Production)

After deploying:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-domain.com/api/telegram/webhook"}'
```

---

## 🎨 Step 8: Customize Bot Appearance

### Set Bot Photo

1. Send `/setuserpic` to @BotFather
2. Select your bot
3. Upload square image (512x512 recommended)

### Create Bot Sticker (Optional)

Create a custom sticker pack for your bot.

---

## 🧪 Step 9: Test Mini App Features

### Test Authentication

The initData from Telegram WebApp contains user info:

```typescript
const initData = window.Telegram.WebApp.initData
const user = window.Telegram.WebApp.initDataUnsafe.user
```

### Test Theme Integration

Telegram theme colors are automatically applied:

```typescript
const theme = window.Telegram.WebApp.themeParams
const colorScheme = window.Telegram.WebApp.colorScheme // 'light' or 'dark'
```

---

## 📱 Step 10: Test on Different Platforms

Test your Mini App on:

- ✅ Telegram iOS
- ✅ Telegram Android
- ✅ Telegram Desktop
- ✅ Telegram Web

Each platform may have slight UI differences.

---

## 🔒 Security Best Practices

### Validate InitData

Always validate Telegram initData on the server:

```typescript
import { validateTelegramInitData } from '@/lib/telegram/auth'

const isValid = validateTelegramInitData(
  initData,
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!
)

if (!isValid) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Check Data Expiration

InitData expires after 24 hours:

```typescript
import { isInitDataExpired, parseTelegramInitData } from '@/lib/telegram/auth'

const parsed = parseTelegramInitData(initData)
if (parsed && isInitDataExpired(parsed)) {
  // Ask user to restart the app
}
```

---

## 🎯 Step 11: Configure Bot for Production

Before launching:

1. ✅ Set production webhook URL
2. ✅ Update menu button with production URL
3. ✅ Test all commands
4. ✅ Verify authentication works
5. ✅ Test on all platforms
6. ✅ Set bot privacy mode (if needed)

### Privacy Mode

```
/setprivacy
@matchvibe_bot
Disable
```

This allows bot to see all messages in groups (if you plan to support group features).

---

## 📊 Step 12: Monitor Bot Usage

### Get Bot Info

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```

### Get Webhook Info

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

---

## 🚨 Troubleshooting

### "Bot token is invalid"

- Verify token copied correctly
- Check for extra spaces
- Generate new token with /token in @BotFather

### "Mini App doesn't open"

- Verify HTTPS URL (HTTP won't work)
- Check CORS headers
- Ensure Next.js app is running
- Check browser console for errors

### "Authentication fails"

- Verify bot token in env variables
- Check initData validation logic
- Ensure data isn't expired

### "Theme colors not applied"

- Check if `applyTelegramTheme` is called
- Verify CSS variables are defined
- Test in actual Telegram (not browser)

---

## 📚 Resources

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Mini Apps:** https://core.telegram.org/bots/webapps
- **@BotFather Commands:** https://core.telegram.org/bots/features#botfather
- **Mini Apps SDK:** https://docs.telegram-mini-apps.com/

---

## 🔄 Next Steps

1. ✅ Bot created and configured
2. ⏳ Implement bot commands
3. ⏳ Set up webhook
4. ⏳ Test authentication flow
5. ⏳ Deploy to production

---

**Status:** ✅ Bot Configuration Complete  
**Ready for:** Development & Testing
