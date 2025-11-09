# Telegram Bot Webhook Debug Guide

Пошаговое руководство по исправлению ошибки бота.

---

## 🔍 Ошибка

```
TypeError: Cannot read properties of undefined (reading 'get')
```

### Причина:

Неправильное использование `webhookCallback` из grammy. Функция ожидала полный HTTP Request объект, но получала только JSON.

### ✅ Исправление:

Обновлен файл `src/app/api/bot/webhook/route.ts`:

- Убран `webhookCallback`
- Используется прямой вызов `bot.handleUpdate(update)`
- Добавлено подробное логирование

---

## 📋 Шаги для исправления

### Шаг 1: Проверьте Environment Variables в Vercel

1. Откройте https://vercel.com/
2. Выберите проект `matchvibesmain`
3. Settings → Environment Variables
4. Проверьте что установлены:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
NEXT_PUBLIC_APP_URL=https://matchvibesmain.vercel.app
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот_без_@
```

**Важно:**

- `TELEGRAM_BOT_TOKEN` должен быть в **Production**, **Preview** и **Development**
- URL без финального слэша
- Токен должен быть актуальным

### Шаг 2: Redeploy приложение

После обновления кода нужно задеплоить:

```bash
git add .
git commit -m "Fix bot webhook error"
git push origin main
```

Vercel автоматически задеплоит изменения.

### Шаг 3: Переустановите webhook

После деплоя:

```bash
pnpm bot:webhook
```

**Ожидаемый вывод:**

```
🔧 Setting Telegram webhook...
📍 Webhook URL: https://matchvibesmain.vercel.app/api/bot/webhook
✅ Webhook set successfully!
```

### Шаг 4: Проверьте логи

1. Vercel Dashboard → Project → Functions
2. Найдите `/api/bot/webhook`
3. Откройте бота в Telegram
4. Отправьте `/start`
5. Смотрите логи в реальном времени

**Ожидаемые логи:**

```
Webhook POST received
Received update from Telegram: {
  update_id: 123456789,
  type: 'message',
  message: '/start',
  from: 'username'
}
Initializing bot instance...
Registering bot commands...
Bot initialized successfully
Processing update with bot...
Update processed successfully
```

### Шаг 5: Тестируйте бота

В Telegram:

1. Отправьте `/start`
2. Бот должен ответить приветственным сообщением
3. Если есть кнопка "🎮 Начать игру" - всё работает!

---

## 🛠️ Устранение проблем

### Проблема: "TELEGRAM_BOT_TOKEN is not set"

**В логах:**

```
TELEGRAM_BOT_TOKEN is not set in environment variables
```

**Решение:**

1. Vercel Dashboard → Settings → Environment Variables
2. Добавьте `TELEGRAM_BOT_TOKEN` со значением от @BotFather
3. Выберите все окружения (Production, Preview, Development)
4. Save
5. Redeploy: Deployments → ... → Redeploy

---

### Проблема: "Cannot read properties of undefined"

**Причина:** Старая версия кода ещё деплоится

**Решение:**

1. Проверьте что код закоммичен: `git status`
2. Если есть изменения: `git add . && git commit -m "Fix" && git push`
3. Дождитесь окончания деплоя в Vercel
4. Переустановите webhook: `pnpm bot:webhook`

---

### Проблема: Бот не отвечает после исправлений

**Проверка 1:** Environment variables установлены?

```bash
# Локально проверьте
node -e "console.log(process.env.TELEGRAM_BOT_TOKEN)"
```

**Проверка 2:** Webhook установлен правильно?

```bash
curl "https://api.telegram.org/bot<ВАШ_ТОКЕН>/getWebhookInfo"
```

Должно быть:

```json
{
  "url": "https://matchvibesmain.vercel.app/api/bot/webhook",
  "pending_update_count": 0
}
```

**Проверка 3:** API route доступен?

```bash
curl https://matchvibesmain.vercel.app/api/bot/webhook
```

Должен вернуть:

```json
{
  "status": "ok",
  "bot": "MatchVibe",
  "timestamp": "..."
}
```

---

### Проблема: "Webhook error: 500"

**Причина:** Ошибка в коде команд бота

**Решение:**

1. Откройте Vercel Logs
2. Найдите полный stack trace ошибки
3. Проверьте файлы команд в `src/bot/commands/`
4. Исправьте ошибку
5. Commit + Push + Redeploy

---

## 📊 Мониторинг

### Vercel Functions

1. Перейдите в **Functions** → `/api/bot/webhook`
2. Смотрите метрики:
   - **Invocations** - количество вызовов
   - **Errors** - количество ошибок (должно быть 0)
   - **Duration** - время выполнения

### Telegram Webhook Info

```bash
curl "https://api.telegram.org/bot<ТОКЕН>/getWebhookInfo"
```

Важные поля:

- `url` - должен быть правильный
- `pending_update_count` - должно быть 0
- `last_error_date` - должно быть 0 или отсутствовать
- `last_error_message` - не должно быть

---

## ✅ Чеклист успешной настройки

- [ ] Код обновлён (убран webhookCallback, используется handleUpdate)
- [ ] Environment variables установлены в Vercel
- [ ] Приложение задеплоено
- [ ] Webhook установлен (`pnpm bot:webhook`)
- [ ] Webhook info показывает правильный URL
- [ ] Бот отвечает на `/start` в Telegram
- [ ] В логах Vercel нет ошибок
- [ ] `pending_update_count` = 0

---

## 🚀 После исправления

Бот будет работать **24/7 автоматически**:

1. ✅ Webhook установлен на Vercel
2. ✅ Vercel обрабатывает запросы от Telegram
3. ✅ Бот отвечает мгновенно
4. ✅ Не требует запуска команд
5. ✅ Не занимает дополнительные ресурсы

### Что делать если бот перестал работать:

1. Проверьте логи Vercel
2. Проверьте webhook info
3. Если нужно - переустановите webhook: `pnpm bot:webhook`
4. Если проблема в коде - исправьте и задеплойте

---

## 📝 Важные файлы

### Обновлены:

- `src/app/api/bot/webhook/route.ts` - webhook handler
- `src/bot/index.ts` - инициализация бота

### Проверьте:

- `src/bot/commands/start.ts` - команда /start
- `src/bot/commands/play.ts` - команда /play
- `.env.local` (локально) - environment variables
- Vercel Environment Variables (production)

---

## 🔗 Полезные ссылки

- [Vercel Dashboard](https://vercel.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Grammy Docs](https://grammy.dev/)

---

**Бот должен заработать после этих исправлений!** 🎉

Если проблемы остаются - проверьте логи Vercel для детальной информации об ошибках.
