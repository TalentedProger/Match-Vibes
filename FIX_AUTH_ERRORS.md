# 🔧 Исправление ошибок аутентификации

**Дата:** 2025-01-08  
**Проблемы:**

- ❌ 401 Unauthorized при запуске бота
- ❌ 500 ошибки на `/api/auth/telegram` в Vercel
- ❌ Не могу попасть дальше первоначальной страницы

---

## 🎯 Корневая причина

В `.env.local` и Vercel **не хватает переменных** или они неправильно названы.

### Требуются ДВЕ переменные с токеном:

1. `TELEGRAM_BOT_TOKEN` (без `NEXT_PUBLIC_`) → для локального бота
2. `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` (с `NEXT_PUBLIC_`) → для API

**Оба должны содержать один и тот же токен!**

---

## ✅ РЕШЕНИЕ: Пошаговая инструкция

### Шаг 1: Проверьте `.env.local`

Откройте файл `.env.local` и убедитесь что он выглядит **ТОЧНО** так:

```env
# Telegram Mini App (с NEXT_PUBLIC_)
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
NEXT_PUBLIC_BOT_USERNAME=VibesMatch_bot

# Telegram Bot (БЕЗ NEXT_PUBLIC_!)
TELEGRAM_BOT_TOKEN=8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg
TELEGRAM_BOT_USERNAME=VibesMatch_bot
TELEGRAM_WEBHOOK_SECRET=super_secret_random_string_12345

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dagdugwedwiuqzosmjby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key_из_supabase
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key_из_supabase

# App URL
NEXT_PUBLIC_APP_URL=https://matchvibes.vercel.app

# Environment
NODE_ENV=development
```

**⚠️ ВАЖНО:**

- Токен должен быть **БЕЗ** пробелов в начале/конце
- Токен должен быть **БЕЗ** кавычек
- Токен должен быть **ПОЛНОСТЬЮ** скопирован
- **ОБА** токена должны быть **ОДИНАКОВЫМИ**

---

### Шаг 2: Проверьте токен

Запустите проверку:

```powershell
# Проверка переменных окружения
node test-env.js
```

Вы должны увидеть:

```
✅ TELEGRAM_BOT_TOKEN: 8110389649...JEhrlg
✅ NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: 8110389649...JEhrlg
✅ Both tokens match: ✅
```

Если видите `❌`, исправьте `.env.local`!

---

### Шаг 3: Проверьте токен через API

```powershell
# Замените ВАШ_ТОКЕН на настоящий токен
$token = "8110389649:AAEcrUWNOG34lMsLfr2Hzn8aACy81JEhrlg"
Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getMe" | ConvertTo-Json
```

**Ожидаемый результат:**

```json
{
  "ok": true,
  "result": {
    "id": 8110389649,
    "is_bot": true,
    "first_name": "VibesMatch",
    "username": "VibesMatch_bot"
  }
}
```

**Если видите 401 Unauthorized** → токен неправильный, создайте новый через @BotFather!

---

### Шаг 4: Удалите webhook (если есть)

Если бот не запускается из-за webhook:

```powershell
$token = "ВАШ_ТОКЕН"
Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/deleteWebhook?drop_pending_updates=true"
```

Должно вернуться:

```json
{
  "ok": true,
  "result": true
}
```

---

### Шаг 5: Запустите бота локально

```powershell
# Остановите предыдущую попытку (Ctrl+C если запущена)

# Запустите заново
pnpm bot:dev
```

**Ожидаемый вывод:**

```
🤖 Starting MatchVibe bot in polling mode...
📍 Environment: development
✅ Bot started successfully!
📱 Bot username: @VibesMatch_bot
```

**Если видите ошибку** → вернитесь к Шагу 1!

---

## 🌐 Исправление Vercel (ошибки 500)

### Шаг 1: Обновите Environment Variables в Vercel

1. Откройте https://vercel.com/dashboard
2. Выберите проект **matchvibes**
3. Settings → Environment Variables
4. Добавьте/обновите **ВСЕ** переменные:

```
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN = 8110389649:AAE...ваш_новый_токен
NEXT_PUBLIC_BOT_USERNAME = VibesMatch_bot
TELEGRAM_BOT_TOKEN = 8110389649:AAE...ваш_новый_токен
TELEGRAM_BOT_USERNAME = VibesMatch_bot
TELEGRAM_WEBHOOK_SECRET = super_secret_random_string_12345

NEXT_PUBLIC_SUPABASE_URL = https://dagdugwedwiuqzosmjby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY = ваш_service_role_key

NEXT_PUBLIC_APP_URL = https://matchvibes.vercel.app
NODE_ENV = production
```

**⚠️ Для каждой переменной:**

- Выберите **All** (Production, Preview, Development)
- Нажмите **Save**

### Шаг 2: Redeploy

1. Deployments → последний деплой → **⋮** (три точки) → **Redeploy**
2. Дождитесь завершения (2-3 минуты)

### Шаг 3: Проверьте логи

1. Deployments → последний деплой → **Function Logs**
2. Найдите `/api/auth/telegram`
3. Проверьте логи - теперь вы увидите детальные сообщения:

```
[Auth API] Request received
[Auth API] Init data received, length: 245
[Auth API] Bot token available, length: 46
[Auth API] Telegram data validated successfully
[Auth API] Telegram user: 123456789 username
[Auth API] User exists: true
```

**Если видите:**

- `CRITICAL: Bot token not configured!` → вернитесь к Шагу 1
- `Database error` → проблема с Supabase (см. ниже)

---

## 🗄️ Проверка Supabase

### Шаг 1: Проверьте таблицу profiles

1. Откройте https://supabase.com/dashboard/project/dagdugwedwiuqzosmjby
2. Table Editor → **profiles**
3. Убедитесь что таблица существует

**Если таблицы нет:**

```sql
-- Выполните в SQL Editor
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  telegram_id bigint unique not null,
  username text,
  first_name text,
  last_name text,
  avatar_url text,
  premium_status boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Включите RLS
alter table profiles enable row level security;

-- Политика: Пользователи видят только свой профиль
create policy "Users can view own profile"
  on profiles for select
  using (true);

-- Политика: Пользователи могут создавать свой профиль
create policy "Users can create own profile"
  on profiles for insert
  with check (true);

-- Политика: Пользователи могут обновлять свой профиль
create policy "Users can update own profile"
  on profiles for update
  using (true);
```

### Шаг 2: Проверьте ключи

1. Settings → API
2. Проверьте:
   - **URL:** `https://dagdugwedwiuqzosmjby.supabase.co`
   - **anon public:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role:** (секретный ключ)

3. Скопируйте эти значения в `.env.local` и Vercel

---

## ✅ Финальная проверка

### Локально:

```powershell
# 1. Проверка переменных
node test-env.js
# Должно быть: ✅ All variables are set!

# 2. Запуск бота
pnpm bot:dev
# Должно быть: ✅ Bot started successfully!

# 3. Запуск приложения
pnpm dev
# Откройте http://localhost:3002
```

### В Telegram:

1. Откройте @VibesMatch_bot
2. Отправьте `/start`
3. Нажмите кнопку Menu (☰)
4. Выберите "🎮 Открыть игру"
5. Приложение должно открыться и аутентифицировать вас

### На Vercel:

1. Откройте https://matchvibes.vercel.app
2. В консоли браузера (F12) не должно быть ошибок
3. Если открыто в Telegram → должна быть аутентификация
4. Если в браузере → должно быть предупреждение "Откройте через Telegram"

---

## 🆘 Если все еще не работает

### Проблема: 401 при запуске бота

**Решение:** Токен неправильный

1. Создайте **НОВЫЙ** токен через @BotFather
2. `/mybots` → выберите бот → API Token → Revoke → скопируйте новый
3. Обновите в `.env.local` (обе переменные!)
4. Попробуйте снова

### Проблема: 500 на Vercel

**Решение:** Проверьте логи

1. Vercel → Function Logs
2. Найдите детали ошибки
3. Если "Bot token not configured" → обновите Environment Variables
4. Если "Database error" → проверьте Supabase (таблица, RLS, ключи)
5. Redeploy после изменений

### Проблема: Аутентификация не проходит

**Решение:** Проверьте initData

1. В консоли браузера (F12) проверьте Network → `/api/auth/telegram`
2. Посмотрите Request Payload
3. Если initData пустой → Telegram WebApp не инициализирован
4. Если 401 → проблема с валидацией токена

---

## 📋 Checklist

Перед тем как сообщить что не работает, проверьте:

- [ ] ✅ `node test-env.js` показывает все переменные
- [ ] ✅ Оба токена одинаковые (`TELEGRAM_BOT_TOKEN` и `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`)
- [ ] ✅ Токен проверен через API (`/getMe` возвращает данные бота)
- [ ] ✅ Webhook удален или отключен
- [ ] ✅ Бот запускается локально (`pnpm bot:dev`)
- [ ] ✅ Все переменные добавлены в Vercel
- [ ] ✅ Vercel Redeploy после обновления переменных
- [ ] ✅ Таблица `profiles` существует в Supabase
- [ ] ✅ RLS политики настроены
- [ ] ✅ Supabase ключи правильные

---

**После выполнения всех шагов все должно работать!** 🎉

Если проблемы остались - покажите:

1. Вывод `node test-env.js`
2. Ошибку из Vercel Function Logs (детально)
3. Скриншот консоли браузера (F12)
