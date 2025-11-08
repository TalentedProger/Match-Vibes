# 🚀 Деплой на Vercel + Supabase

## Архитектура проекта

```
┌─────────────────────┐
│   Telegram Bot      │
│  (VibesMatch_bot)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Vercel Frontend   │ ← HTTPS автоматически!
│   (Mini App UI)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Supabase Backend   │
│   (База данных)     │
└─────────────────────┘
```

**Преимущества:**

- ✅ Бесплатно
- ✅ Автоматический HTTPS
- ✅ Быстрый CDN по всему миру
- ✅ Автодеплой из Git
- ✅ Нет ngrok - нет медленной работы!

---

## 📋 Шаг 1: Подготовка .env.local

Откройте файл `.env.local` и **замените его содержимое** на это:

```env
# Telegram Mini App
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
NEXT_PUBLIC_BOT_USERNAME=VibesMatch_bot

# Telegram Bot (Stage 1.5)
TELEGRAM_BOT_TOKEN=8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
TELEGRAM_BOT_USERNAME=VibesMatch_bot
TELEGRAM_WEBHOOK_SECRET=super_secret_random_string_12345

# Supabase - ОБНОВЛЕНО!
NEXT_PUBLIC_SUPABASE_URL=https://dagdugwedwiuqzosmjby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZ2R1Z3dlZHdpdXF6b3NtamJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MTEzMzUsImV4cCI6MjA1MjA4NzMzNX0.bIv0iYPWBqHCy3o88N-ljX4ydRYCCO7ZD2OyJGnLfqE
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_dashboard

# App URL - ВАЖНО! Будет обновлено после деплоя на Vercel
NEXT_PUBLIC_APP_URL=http://localhost:3002
NODE_ENV=development
```

**⚠️ ВАЖНО:**

- `NEXT_PUBLIC_SUPABASE_URL` - уже правильный: `https://dagdugwedwiuqzosmjby.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - я взял из вашей конфигурации
- `SUPABASE_SERVICE_ROLE_KEY` - найдите в Supabase Dashboard → Settings → API → `service_role` key (секретный!)

---

## 📋 Шаг 2: Получить Service Role Key из Supabase

1. Откройте https://supabase.com/dashboard/project/dagdugwedwiuqzosmjby
2. Перейдите в **Settings** (⚙️) → **API**
3. Найдите раздел **Project API keys**
4. Скопируйте `service_role` key (⚠️ секретный ключ!)
5. Вставьте его в `.env.local` как `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 Шаг 3: Инициализация Git (если еще не сделано)

Откройте терминал в папке проекта:

```bash
# Проверьте есть ли Git
git status

# Если "not a git repository", инициализируйте:
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

---

## 📋 Шаг 4: Подключить GitHub (опционально, но рекомендуется)

### Вариант A: Через GitHub Desktop (проще)

1. Скачайте GitHub Desktop: https://desktop.github.com/
2. Откройте приложение
3. File → Add Local Repository → выберите папку проекта
4. Publish Repository → укажите название `matchvibe-telegram-app`
5. ✅ Готово!

### Вариант B: Через командную строку

```bash
# Создайте репозиторий на GitHub.com
# Затем:
git remote add origin https://github.com/ваш-username/matchvibe-telegram-app.git
git branch -M main
git push -u origin main
```

---

## 🚀 Шаг 5: Деплой на Vercel

### Вариант 1: Через Web Interface (рекомендуется для начала)

1. **Откройте Vercel Dashboard**
   - Перейдите на https://vercel.com/dashboard
   - Нажмите **"Add New..."** → **"Project"**

2. **Импортируйте проект**
   - Если подключили GitHub: выберите репозиторий `matchvibe-telegram-app`
   - Если нет GitHub: выберите "Import from Git" и укажите ссылку

3. **Настройте проект**

   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: next build
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **⚠️ ВАЖНО: Добавьте Environment Variables**

   Нажмите **"Environment Variables"** и добавьте **ВСЕ** переменные из `.env.local`:

   ```
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN = 8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
   NEXT_PUBLIC_BOT_USERNAME = VibesMatch_bot

   TELEGRAM_BOT_TOKEN = 8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
   TELEGRAM_BOT_USERNAME = VibesMatch_bot
   TELEGRAM_WEBHOOK_SECRET = super_secret_random_string_12345

   NEXT_PUBLIC_SUPABASE_URL = https://dagdugwedwiuqzosmjby.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY = ваш_service_role_key

   NODE_ENV = production
   ```

   **❌ НЕ ДОБАВЛЯЙТЕ `NEXT_PUBLIC_APP_URL` СЕЙЧАС!** Мы добавим его после деплоя.

5. **Нажмите "Deploy"**
   - Vercel начнет сборку проекта
   - Подождите ~2-3 минуты
   - ✅ Когда увидите "Congratulations!" - готово!

6. **Скопируйте URL проекта**
   - Вы получите URL типа: `https://matchvibe-telegram-app.vercel.app`
   - ИЛИ: `https://matchvibe-telegram-app-ваш-username.vercel.app`
   - **СКОПИРУЙТЕ ЭТО URL!**

---

## 📋 Шаг 6: Обновить NEXT_PUBLIC_APP_URL

### В Vercel Dashboard:

1. Откройте ваш проект на Vercel
2. Перейдите в **Settings** → **Environment Variables**
3. Нажмите **"Add New"**
4. Добавьте:
   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://matchvibe-telegram-app.vercel.app (ваш URL)
   Environment: Production, Preview, Development
   ```
5. Нажмите **"Save"**

### В локальном .env.local:

Откройте `.env.local` и обновите строку:

```env
NEXT_PUBLIC_APP_URL=https://matchvibe-telegram-app.vercel.app
```

### Редеплой:

1. В Vercel Dashboard → **Deployments**
2. Нажмите **"Redeploy"** на последнем деплое
3. Или запушьте любое изменение в Git (если подключен GitHub)

---

## 📋 Шаг 7: Настроить Telegram Bot

Теперь обновим бота, чтобы он использовал Vercel URL вместо ngrok:

### Способ 1: Через BotFather

1. Откройте Telegram → @BotFather
2. Отправьте `/mybots`
3. Выберите **@VibesMatch_bot**
4. Нажмите **"Bot Settings"** → **"Menu Button"**
5. Выберите **"Configure Menu Button"**
6. Введите URL: `https://matchvibe-telegram-app.vercel.app`
7. ✅ Готово!

### Способ 2: Через скрипт

Если у вас есть скрипт `setup-menu-button.ts`:

```bash
# В локальном проекте обновите .env.local с Vercel URL
# Затем запустите:
pnpm bot:menu
```

Вы должны увидеть:

```
✅ Menu button set successfully!
📱 Web App URL: https://matchvibe-telegram-app.vercel.app
```

---

## 🧪 Шаг 8: Тестирование

### Тест 1: Откройте Mini App

1. Откройте Telegram
2. Найдите **@VibesMatch_bot**
3. Отправьте `/start`
4. Нажмите на кнопку меню (☰) внизу
5. Выберите **"🎮 Открыть игру"**
6. **Mini App должен открыться МГНОВЕННО!** (не как с ngrok)

### Тест 2: Проверьте функциональность

- ✅ Кнопка "Погнали!" кликабельна
- ✅ Нет масштабирования
- ✅ Быстрая загрузка страниц
- ✅ Telegram данные загружаются
- ✅ Supabase подключение работает

---

## 🎯 Итоговая конфигурация

### Локальная разработка (.env.local):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3002
# ... остальные переменные
```

**Запуск:**

```bash
pnpm dev  # → http://localhost:3002
```

### Production (Vercel):

```env
NEXT_PUBLIC_APP_URL=https://matchvibe-telegram-app.vercel.app
# ... остальные переменные
```

**Автодеплой при каждом push в Git!**

---

## 🔄 Workflow после настройки

### Разработка:

```bash
# 1. Разрабатываете локально
pnpm dev

# 2. Тестируете через http://localhost:3002
# (без Telegram - для быстрой проверки)
```

### Деплой:

```bash
# Если подключен GitHub:
git add .
git commit -m "Добавил новую фичу"
git push

# Vercel автоматически задеплоит! 🚀
```

### Тестирование в Production:

```bash
# Откройте @VibesMatch_bot в Telegram
# Нажмите "🎮 Открыть игру"
# Тестируйте на реальном HTTPS URL
```

---

## ⚡ Преимущества Vercel vs ngrok

| Характеристика   | ngrok                | Vercel            |
| ---------------- | -------------------- | ----------------- |
| **Скорость**     | 🐌 Медленно          | ⚡ Мгновенно      |
| **HTTPS**        | ✅ Да (туннель)      | ✅ Да (нативный)  |
| **Стабильность** | ⚠️ Может отключиться | ✅ 99.99% uptime  |
| **URL**          | 🔄 Меняется          | ✅ Постоянный     |
| **CDN**          | ❌ Нет               | ✅ Глобальный CDN |
| **Цена**         | 💰 $8+/мес           | 🆓 Бесплатно      |
| **Автодеплой**   | ❌ Нет               | ✅ Есть           |
| **Кэширование**  | ❌ Нет               | ✅ Есть           |

---

## 🎉 Готово!

Теперь у вас:

- ✅ **Frontend на Vercel** (быстро, бесплатно, HTTPS)
- ✅ **Backend на Supabase** (база данных готова)
- ✅ **Telegram Bot интегрирован** с Vercel URL
- ✅ **Автодеплой** из Git
- ✅ **Нет зависимости от ngrok**

**Следующий шаг:** Настройте базу данных в Supabase (таблицы, RLS политики и т.д.)

---

## 🆘 Troubleshooting

### Ошибка: "Build failed on Vercel"

```bash
# Проверьте что проект собирается локально:
pnpm build

# Если ошибки - исправьте их
# Затем push в Git
```

### Ошибка: "Environment variables not defined"

- Убедитесь что все переменные из `.env.local` добавлены в Vercel
- Проверьте что они добавлены для всех окружений (Production, Preview, Development)

### Ошибка: "Mini App не открывается"

- Проверьте что `NEXT_PUBLIC_APP_URL` в Vercel = вашему Vercel URL
- Запустите `pnpm bot:menu` для обновления Menu Button
- Или обновите URL через @BotFather вручную

### Медленная загрузка даже на Vercel

- Проверьте регион деплоя в Vercel Settings
- Убедитесь что Supabase проект в том же регионе
- Оптимизируйте запросы к Supabase

---

## 📚 Полезные ссылки

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Supabase Dashboard: https://supabase.com/dashboard/project/dagdugwedwiuqzosmjby
- Telegram Bot API: https://core.telegram.org/bots/api
