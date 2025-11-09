# ⚡ БЫСТРОЕ ИСПРАВЛЕНИЕ WEBHOOK

**Проблема:** 401 Invalid webhook secret token  
**Решение:** 5 шагов (5 минут)

---

## 🔑 Новый токен (ПРАВИЛЬНЫЙ):

```
rvR2cW3tfRZbQjMtRg4rX5OOYxWhbNY3
```

---

## ✅ 5 ШАГОВ:

### 1. .env.local

Добавьте в файл `.env.local`:

```
TELEGRAM_WEBHOOK_SECRET=rvR2cW3tfRZbQjMtRg4rX5OOYxWhbNY3
```

### 2. Vercel

https://vercel.com → Settings → Environment Variables

- **Удалите** старую переменную `TELEGRAM_WEBHOOK_SECRET`
- **Создайте новую:**
  - Name: `TELEGRAM_WEBHOOK_SECRET`
  - Value: `rvR2cW3tfRZbQjMtRg4rX5OOYxWhbNY3`
  - Environments: ✅ All

### 3. Redeploy

https://vercel.com → Deployments → ... → **Redeploy**

⏳ **Дождитесь завершения** (2-3 минуты)

### 4. Webhook

```bash
pnpm bot:webhook
```

### 5. Проверка

Напишите боту `/start`

---

## ✅ Должно показать:

```
🔒 Using webhook secret: rvR2...bNY3
✅ Webhook set successfully!
```

---

## ❌ Если не работает:

1. Проверьте что токены одинаковые (.env.local и Vercel)
2. Убедитесь что сделали Redeploy
3. Подождите 2-3 минуты после redeploy
4. Повторите `pnpm bot:webhook`

---

**Детали:** См. `WEBHOOK_FIX_FINAL.md`
