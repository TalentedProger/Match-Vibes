# Telegram Bot Server Integration

Руководство по интеграции бота в основной сервер Next.js без отдельных команд.

---

## Архитектура

### Production (Vercel/любой HTTPS сервер)

- ✅ Бот работает через **webhook**
- ✅ Не требует отдельного процесса
- ✅ Автоматически обрабатывает сообщения через `/api/bot/webhook`
- ✅ Не занимает ресурсы в простое

### Development (Local)

**Проблема:** Webhook требует HTTPS, localhost использует HTTP

**Решение:** Используйте один из вариантов:

#### Вариант 1: ngrok (Рекомендуется)

```bash
# 1. Установите ngrok
npm install -g ngrok

# 2. Запустите dev сервер
pnpm dev

# 3. В новом терминале запустите ngrok
ngrok http 3002

# 4. Скопируйте HTTPS URL (например: https://abc123.ngrok.io)

# 5. Установите webhook
curl -X POST "https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook" \
  -d "url=https://abc123.ngrok.io/api/bot/webhook"
```

#### Вариант 2: Встроенный webhook сервер

Создайте файл для локального тестирования через polling.

---

## Настройка Production

### Шаг 1: Деплой на Vercel

```bash
# Деплой приложения
vercel --prod
```

### Шаг 2: Установите Webhook

После деплоя выполните:

```bash
curl -X POST \
  "https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook" \
  -d "url=https://ваш-домен.vercel.app/api/bot/webhook"
```

**Или используйте готовый скрипт:**

```bash
pnpm bot:webhook
```

### Шаг 3: Проверьте Webhook

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

## Как работает Webhook в Next.js

### 1. API Route Handler

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

### 2. Bot Instance

Файл: `src/bot/index.ts`

```typescript
import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
// ... другие импорты

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

// Регистрация команд
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
// ...

export default bot
```

### 3. Команды

Все команды в `src/bot/commands/` автоматически обрабатываются через webhook.

---

## Преимущества Webhook

✅ **Не требует отдельного процесса** - работает внутри Next.js  
✅ **Мгновенные обновления** - получает сообщения сразу  
✅ **Экономия ресурсов** - нет polling запросов каждую секунду  
✅ **Масштабируемость** - Vercel автоматически масштабирует  
✅ **Бесплатно** - входит в Vercel Free tier

---

## Устранение проблем

### Проблема: "Webhook not working"

**Проверка 1:** Endpoint доступен

```bash
curl https://ваш-домен.vercel.app/api/bot/webhook
```

**Проверка 2:** Webhook установлен

```bash
curl "https://api.telegram.org/bot<ТОКЕН>/getWebhookInfo"
```

**Проверка 3:** Логи Vercel

1. Откройте Vercel Dashboard
2. Перейдите в Functions
3. Найдите `/api/bot/webhook`
4. Просмотрите логи

### Проблема: "Bot not responding in production"

**Причина 1:** Webhook URL неправильный

```bash
# Удалите старый webhook
curl -X POST "https://api.telegram.org/bot<ТОКЕН>/deleteWebhook"

# Установите новый
curl -X POST "https://api.telegram.org/bot<ТОКЕН>/setWebhook" \
  -d "url=https://ваш-домен.vercel.app/api/bot/webhook"
```

**Причина 2:** Переменные окружения не установлены

1. Vercel Dashboard → Settings → Environment Variables
2. Добавьте: `TELEGRAM_BOT_TOKEN`
3. Redeploy приложение

**Причина 3:** API route не работает
Проверьте файл `src/app/api/bot/webhook/route.ts` существует и правильно настроен.

---

## Development без ngrok

Если не хотите использовать ngrok, можно временно использовать polling:

### Создайте файл `scripts/dev-bot.ts`:

```typescript
import bot from '../src/bot'

console.log('🤖 Starting bot in polling mode...')
console.log('⚠️  For development only! Use webhook in production.')

bot.start({
  onStart: () => {
    console.log('✅ Bot started successfully')
  },
})

// Graceful shutdown
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
```

### Обновите `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "dev:bot": "tsx watch scripts/dev-bot.ts",
    "dev:all": "concurrently \"pnpm dev\" \"pnpm dev:bot\""
  }
}
```

### Установите зависимости:

```bash
pnpm add -D concurrently tsx
```

### Запустите оба процесса:

```bash
pnpm dev:all
```

---

## Production Checklist

Перед деплоем убедитесь:

- [ ] `TELEGRAM_BOT_TOKEN` установлен в environment variables
- [ ] `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` установлен
- [ ] `NEXT_PUBLIC_APP_URL` указывает на production домен (HTTPS)
- [ ] Файл `/api/bot/webhook/route.ts` существует
- [ ] Бот зарегистрирован через @BotFather
- [ ] Mini App настроен в @BotFather
- [ ] После деплоя webhook установлен

---

## Мониторинг

### Vercel Dashboard

1. **Functions** → `/api/bot/webhook`
   - Количество вызовов
   - Время выполнения
   - Ошибки

2. **Logs**
   - Все console.log из бота
   - Ошибки обработки

### Telegram

```bash
# Проверка webhook
curl "https://api.telegram.org/bot<ТОКЕН>/getWebhookInfo"
```

Важные метрики:

- `pending_update_count` - должен быть 0
- `last_error_date` - должен быть 0
- `last_error_message` - должен отсутствовать

---

## Рекомендации

### ✅ DO:

- Используйте webhook в production
- Проверяйте webhook после каждого деплоя
- Логируйте ошибки в Vercel
- Используйте переменные окружения для токенов

### ❌ DON'T:

- Не используйте polling в production
- Не храните токены в коде
- Не запускайте бота отдельным процессом в production
- Не забывайте устанавливать webhook после деплоя

---

## Резюме

**В Production:**

- Бот работает автоматически через webhook ✅
- Не требует `pnpm bot:dev` ✅
- Не занимает дополнительные ресурсы ✅
- Обрабатывает сообщения мгновенно ✅

**В Development:**

- Используйте ngrok + webhook (рекомендуется)
- Или используйте polling (`pnpm dev:bot`)
- Оба варианта работают параллельно с Next.js

**Автоматический запуск:**
После настройки webhook бот **всегда работает** на сервере, пока сервер запущен. Никаких дополнительных команд не требуется!

---

**Бот готов к production! 🚀**
