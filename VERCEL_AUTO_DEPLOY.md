# Vercel Auto-Deploy Setup Guide

**Цель:** Настроить автоматический деплой при push в GitHub

---

## 🚀 Быстрая настройка (5 минут)

### Шаг 1: Подключите GitHub к Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект **MatchVibe**
3. Перейдите в **Settings** → **Git**

### Шаг 2: Проверьте Git Integration

Убедитесь что:

- ✅ **Git Repository** подключен к GitHub
- ✅ **Production Branch** установлена как `main`
- ✅ **Auto-deployments** включены

### Шаг 3: Настройте Production Branch

В **Settings** → **Git** → **Production Branch**:

```
Production Branch: main
```

### Шаг 4: Включите Auto-deployments

В **Settings** → **Git**:

- ✅ **Deploy automatically on push to production branch** - ВКЛЮЧЕНО
- ✅ **Deploy preview branches** - ВКЛЮЧЕНО (опционально)

---

## 📋 Как это работает

После настройки:

1. Вы делаете `git push origin main`
2. GitHub принимает push
3. Vercel автоматически получает webhook от GitHub
4. Vercel запускает новый деплой
5. Vercel собирает проект (`pnpm build`)
6. Vercel деплоит на production

**Время деплоя:** ~2-3 минуты

---

## 🔍 Проверка настройки

### Тест автоматического деплоя:

```bash
# 1. Сделайте небольшое изменение
echo "# Test auto-deploy" >> README.md

# 2. Закоммитьте и запушьте
git add .
git commit -m "test: проверка авто-деплоя"
git push origin main

# 3. Откройте Vercel Dashboard
# Вы должны увидеть новый деплой запустился автоматически
```

### Где посмотреть деплои:

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **MatchVibe**
3. Вкладка **Deployments**
4. Вы увидите список всех деплоев

---

## 🐛 Если не работает

### Проблема 1: Деплои не запускаются автоматически

**Решение:**

1. Перейдите в **Settings** → **Git**
2. Убедитесь что **Production Branch** = `main`
3. Проверьте что **Auto-deployments** включены
4. Попробуйте отключить и включить интеграцию

### Проблема 2: Vercel не подключен к GitHub

**Решение:**

1. В Vercel Dashboard нажмите **Add New** → **Project**
2. Выберите **Import Git Repository**
3. Выберите ваш репозиторий `TalentedProger/Match-Vibes`
4. Нажмите **Import**
5. Настройте environment variables
6. Нажмите **Deploy**

### Проблема 3: Build падает в Vercel

**Решение:**

1. Проверьте логи в Vercel Dashboard → Deployments → [Failed Deployment]
2. Убедитесь что все **Environment Variables** настроены:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`
   - `NEXT_PUBLIC_BOT_USERNAME`
   - `NEXT_PUBLIC_APP_URL`

3. Попробуйте собрать локально: `pnpm build`

---

## ⚙️ Environment Variables в Vercel

**Важно:** Убедитесь что все переменные настроены в Vercel

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте каждую переменную из `.env.local`
3. Для Production выберите **Environment: Production**

**Список переменных:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔔 Уведомления о деплоях

### Настройка уведомлений:

1. Откройте **Settings** → **Notifications**
2. Включите уведомления для:
   - ✅ **Deployment succeeded**
   - ✅ **Deployment failed**
   - ⚠️ **Deployment ready** (опционально)

### Где получать уведомления:

- Email
- Slack (если подключен)
- Discord (если подключен)

---

## 📊 Deploy Preview Branches

**Опционально:** Включите preview деплои для других веток

В **Settings** → **Git**:

- ✅ **Deploy preview branches** - ВКЛЮЧЕНО

**Теперь:**

- Push в `main` → Production deploy
- Push в `develop` → Preview deploy
- Pull Request → Preview deploy с уникальным URL

---

## 🚀 Команды для быстрого деплоя

```bash
# Деплой в production
git add .
git commit -m "feat: новая фича"
git push origin main

# Проверить статус в CI
# GitHub Actions автоматически проверит код

# Vercel автоматически задеплоит после успешного CI
```

---

## 📝 Чек-лист настройки

- [ ] Vercel проект подключен к GitHub репозиторию
- [ ] Production Branch = `main`
- [ ] Auto-deployments включены
- [ ] Environment Variables настроены в Vercel
- [ ] GitHub CI проходит успешно
- [ ] Тестовый push создает новый деплой
- [ ] Уведомления настроены
- [ ] Preview deploys включены (опционально)

---

## 🎯 Результат

После настройки:

✅ **Каждый push в `main`** → Автоматический production deploy  
✅ **GitHub CI проходит** → Vercel деплоит  
✅ **Ошибки в CI** → Деплой не происходит (безопасность)  
✅ **Новый коммит** → Новый деплой (~2-3 минуты)

---

## 📞 Поддержка

**Проблемы с Vercel:**

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

**Проблемы с GitHub Actions:**

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- Проверьте файл `.github/workflows/ci.yml`
