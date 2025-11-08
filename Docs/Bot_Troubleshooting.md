# Telegram Bot Troubleshooting Guide

Руководство по проверке и устранению проблем с Telegram ботом.

---

## Проблема: Бот не отвечает на команды

### Шаг 1: Проверка статуса бота

#### 1.1 Проверьте что бот запущен

**Локальная разработка:**

```bash
# Должен быть запущен один из этих процессов:
pnpm bot:dev   # Для разработки (polling)
pnpm bot:webhook # Для production (webhook)
```

**Production (Vercel):**

- Бот работает через webhook
- Webhook должен быть настроен на `/api/bot/webhook`

#### 1.2 Проверьте токен бота

Откройте `.env.local`:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот_username
```

**Проверка токена:**

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/mybots`
4. Выберите вашего бота
5. Выберите **"API Token"**
6. Сравните токен с тем что в `.env.local`

---

### Шаг 2: Тестирование бота локально

#### 2.1 Остановите все процессы

```bash
# Найдите процессы на порту 3002
netstat -ano | findstr :3002

# Убейте процесс (замените PID на реальный)
taskkill /PID <номер_процесса> /F
```

#### 2.2 Запустите бота в dev режиме

```bash
# Запустите polling mode
pnpm bot:dev
```

**Ожидаемый вывод:**

```
Bot started in polling mode
Bot username: @ваш_бот
```

#### 2.3 Отправьте тестовую команду

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте `/start`

**Если бот отвечает** - всё работает! ✅  
**Если нет** - переходите к следующему шагу ⬇️

---

### Шаг 3: Проверка логов и ошибок

#### 3.1 Проверьте консоль dev сервера

При отправке команды должны появиться логи:

```
Received command: /start
Processing message from user: 123456789
```

**Если логов нет:**

- Бот не получает обновления
- Проверьте токен
- Возможно конфликт webhook

#### 3.2 Удалите старый webhook

Иногда webhook блокирует polling mode:

```bash
# Создайте файл scripts/delete-webhook.ts
```

```typescript
import { Bot } from 'grammy'

const token = process.env.TELEGRAM_BOT_TOKEN!
const bot = new Bot(token)

bot.api
  .deleteWebhook({ drop_pending_updates: true })
  .then(() => console.log('Webhook deleted'))
  .catch(err => console.error('Error:', err))
```

```bash
# Запустите
npx tsx scripts/delete-webhook.ts
```

---

### Шаг 4: Проверка кода бота

#### 4.1 Проверьте что файлы бота на месте

```
src/bot/
├── index.ts           ✅ Должен существовать
├── commands/
│   ├── start.ts      ✅ Должен существовать
│   ├── play.ts       ✅ Должен существовать
│   ├── help.ts       ✅ Должен существовать
│   └── ...
```

#### 4.2 Проверьте импорты в src/bot/index.ts

Откройте `src/bot/index.ts`:

```typescript
import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
// ... другие импорты

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

// Команды должны быть зарегистрированы
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
// ...

export default bot
```

#### 4.3 Тестовый скрипт

Создайте `scripts/test-bot.ts`:

```typescript
import bot from '../src/bot'

console.log('Testing bot...')

// Test bot token
bot.api
  .getMe()
  .then(me => {
    console.log('✅ Bot connected:', me.username)
  })
  .catch(err => {
    console.error('❌ Bot error:', err.message)
  })
```

```bash
npx tsx scripts/test-bot.ts
```

---

### Шаг 5: Настройка webhook для Production

#### 5.1 Проверьте что webhook endpoint существует

Файл: `src/app/api/bot/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import bot from '@/bot'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### 5.2 Установите webhook

```bash
# После деплоя на Vercel
pnpm bot:webhook
```

Или вручную:

```bash
curl -X POST \
  "https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook" \
  -d "url=https://ваш-домен.vercel.app/api/bot/webhook"
```

#### 5.3 Проверьте webhook

```bash
curl "https://api.telegram.org/bot<ВАШ_ТОКЕН>/getWebhookInfo"
```

**Ожидаемый ответ:**

```json
{
  "ok": true,
  "result": {
    "url": "https://ваш-домен.vercel.app/api/bot/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0
  }
}
```

---

## Частые ошибки

### Ошибка 1: "Unauthorized"

**Причина:** Неверный токен бота

**Решение:**

1. Получите новый токен от @BotFather
2. Обновите `.env.local`
3. Перезапустите сервер

---

### Ошибка 2: "Conflict: terminated by other getUpdates"

**Причина:** Одновременно запущены polling и webhook

**Решение:**

```bash
# Удалите webhook
curl -X POST "https://api.telegram.org/bot<ТОКЕН>/deleteWebhook"

# Перезапустите polling
pnpm bot:dev
```

---

### Ошибка 3: "Bot not responding in production"

**Причина:** Webhook не настроен или не работает

**Решение:**

1. Проверьте логи Vercel:
   - Перейдите в Vercel Dashboard
   - Откройте ваш проект
   - Перейдите в **Functions**
   - Найдите `/api/bot/webhook`
   - Проверьте логи

2. Проверьте что endpoint доступен:

```bash
curl https://ваш-домен.vercel.app/api/bot/webhook
```

3. Переустановите webhook:

```bash
pnpm bot:webhook
```

---

### Ошибка 4: "Commands work but web_app button doesn't open"

**Причина:** Неправильный URL в web_app кнопке

**Проверьте:**

1. `NEXT_PUBLIC_APP_URL` в `.env.local` - должен быть HTTPS
2. Mini App настроен в @BotFather
3. URL в коде правильный

**Исправление в `src/bot/commands/start.ts`:**

```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ваш-домен.vercel.app'

// Кнопка должна быть так:
{
  text: '🎮 Начать игру',
  web_app: { url: appUrl }  // Без дополнительных параметров!
}
```

---

## Проверочный чеклист

- [ ] Токен бота правильный в `.env.local`
- [ ] Bot username правильный
- [ ] Файлы бота существуют в `src/bot/`
- [ ] Команды зарегистрированы в `index.ts`
- [ ] Для локальной разработки: `pnpm bot:dev` работает
- [ ] Для production: webhook настроен
- [ ] Webhook endpoint отвечает
- [ ] Mini App настроен в @BotFather
- [ ] HTTPS URL в production
- [ ] Кнопки с web_app работают
- [ ] Deep linking работает (invite_CODE)

---

## Быстрая диагностика

Выполните эту команду для быстрой проверки:

```bash
curl "https://api.telegram.org/bot<ВАШ_ТОКЕН>/getMe"
```

**Успешный ответ:**

```json
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "MatchVibe",
    "username": "matchvibe_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

**Если ошибка** - токен неверный!

---

## Настройка Mini App в BotFather

### Если web_app кнопка не работает:

1. Откройте @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Выберите **"Bot Settings"**
5. Выберите **"Menu Button"**
6. Выберите **"Configure menu button"**
7. Введите URL: `https://ваш-домен.vercel.app`
8. Введите текст кнопки: `Играть`

Теперь кнопка меню будет открывать Mini App!

---

## Дополнительные ресурсы

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Grammy Docs:** https://grammy.dev/
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **Vercel Functions:** https://vercel.com/docs/functions

---

**Если проблема не решена:**

1. Проверьте все пункты чеклиста
2. Просмотрите логи в консоли
3. Проверьте логи в Vercel
4. Попробуйте пересоздать бота через @BotFather
5. Проверьте что нет конфликтующих процессов

**Бот должен работать! ✅**
