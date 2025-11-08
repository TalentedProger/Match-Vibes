# ⚡ БЫСТРОЕ ОБНОВЛЕНИЕ URL

**Новый URL:** `https://matchvibesmain.vercel.app`

---

## 🎯 3 ШАГА (5 минут)

### ШАГ 1: Vercel Environment Variables ⭐ САМОЕ ВАЖНОЕ!

```
1. Откройте: https://vercel.com/dashboard
2. Проект matchvibesmain → Settings → Environment Variables
3. Найдите: NEXT_PUBLIC_APP_URL
4. Edit → Значение: https://matchvibesmain.vercel.app
5. Save
6. Deployments → последний → Redeploy ← ОБЯЗАТЕЛЬНО!
```

**Без Redeploy не заработает!**

---

### ШАГ 2: Telegram Bot Menu Button

```
1. Откройте @BotFather в Telegram
2. Отправьте: /setmenubutton
3. Выберите ваш бот
4. URL: https://matchvibesmain.vercel.app
```

---

### ШАГ 3: Локальный .env.local (опционально)

Откройте файл `.env.local` и замените:

```env
# Было:
NEXT_PUBLIC_APP_URL=https://старый-url.vercel.app

# Стало:
NEXT_PUBLIC_APP_URL=https://matchvibesmain.vercel.app
```

**Это только для локальной разработки!**

---

## ✅ ПРОВЕРКА

### 1. В браузере:

Откройте: https://matchvibesmain.vercel.app

**Должно показать:** Главную страницу MatchVibe

### 2. В Telegram:

1. Откройте ваш бот
2. Нажмите Menu Button
3. **Должно открыть:** Mini App

---

## 🔥 КРИТИЧЕСКИ ВАЖНО!

### ❌ НЕ РАБОТАЕТ:

```
Обновил .env.local → git commit → git push
```

**Почему:** `.env.local` в `.gitignore`, не попадает на Vercel!

### ✅ РАБОТАЕТ:

```
Обновил Vercel Environment Variables → Redeploy
```

**Почему:** Vercel использует СВОИ переменные из Dashboard!

---

## 📊 Схема работы

### Локальная разработка:

```
.env.local
    ↓
Next.js на localhost
    ↓
http://localhost:3002
```

### Production (Vercel):

```
Vercel Environment Variables
    ↓
Next.js на Vercel
    ↓
https://matchvibesmain.vercel.app
```

### Telegram Bot:

```
@BotFather Menu Button URL
    ↓
Telegram открывает
    ↓
https://matchvibesmain.vercel.app
```

---

## 🎯 Главное правило

> **Vercel НЕ использует .env.local!**
>
> Vercel использует Environment Variables из Dashboard!
>
> После изменения переменных ВСЕГДА делайте Redeploy!

---

## 🚨 Если не работает

### Проверьте:

1. ✅ Vercel Environment Variables обновлены?
2. ✅ Redeploy выполнен?
3. ✅ Redeploy завершился успешно (зеленая галочка)?
4. ✅ @BotFather Menu Button обновлен?

### Очистите кеш Telegram:

1. Закройте Mini App
2. Закройте Telegram полностью
3. Откройте заново
4. Попробуйте снова

---

## 📞 Нужна помощь?

См. подробный гайд: `UPDATE_URL_GUIDE.md`
