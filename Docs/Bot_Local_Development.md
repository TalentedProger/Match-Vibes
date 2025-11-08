# 🤖 Telegram Bot - Local Development Guide

## ⚠️ Important: HTTPS Requirement

**Telegram Bot API требует HTTPS для Web App кнопок!**

HTTP URLs (например `http://localhost:3002`) **не работают** с `web_app` кнопками.

---

## 🔧 Решение для локальной разработки

### Что было изменено:

Все команды бота обновлены для работы в локальной разработке:

#### ❌ Старый код (не работает локально):

```typescript
reply_markup: {
  inline_keyboard: [
    [
      {
        text: '🎮 Начать игру',
        web_app: { url: 'http://localhost:3002' }, // ❌ Ошибка!
      },
    ],
  ]
}
```

#### ✅ Новый код (работает):

```typescript
reply_markup: {
  inline_keyboard: [
    [
      {
        text: '🎮 Открыть Mini App',
        url: `https://t.me/${BOT_USERNAME}/app`, // ✅ Работает!
      },
    ],
  ]
}
```

---

## 📝 Обновленные команды

### `/start` - Welcome message

- Убрана `web_app` кнопка
- Добавлена обычная URL кнопка с deep link
- Инструкция открыть через меню бота

### `/start invite_CODE` - Deep linking

- Показывает код приглашения
- URL кнопка с параметром: `https://t.me/bot/app?startapp=invite_CODE`
- Работает с deep linking

### `/play` - Create room

- URL кнопка открывает Mini App
- Инструкция использовать меню бота

### `/stats` - Statistics

- URL кнопка открывает Mini App
- Пользователь сам переходит в раздел статистики

### `/profile` - Profile

- URL кнопка открывает Mini App
- Пользователь сам переходит в профиль

---

## 🚀 Как тестировать локально

### 1. Настройте Mini App в @BotFather

```
/newapp
→ Выберите @VibesMatch_bot
→ Название: MatchVibe
→ Описание: Игра для проверки совместимости
→ Web App URL: http://localhost:3002
→ Загрузите иконку (512x512 PNG)
```

### 2. Запустите оба сервера

**Terminal 1 - Mini App:**

```bash
pnpm dev
```

**Terminal 2 - Bot:**

```bash
pnpm bot:dev
```

### 3. Тестируйте в Telegram

1. Найдите **@VibesMatch_bot**
2. Отправьте `/start`
3. Нажмите кнопку **"🎮 Открыть Mini App"**
4. Mini App откроется через встроенный браузер Telegram

---

## 📱 Как работает открытие Mini App

### Через кнопку в сообщении:

```
User нажимает "🎮 Открыть Mini App"
  ↓
Telegram открывает: https://t.me/VibesMatch_bot/app
  ↓
Показывается Mini App из настроек бота
  ↓
Mini App загружается с http://localhost:3002
```

### Через меню бота:

```
User открывает меню бота
  ↓
Нажимает кнопку меню (если настроена)
  ↓
Mini App открывается напрямую
```

---

## 🔗 Deep Linking для приглашений

### Как работает:

1. **User 1 создает комнату** → получает код `ABC123`
2. **Генерируется deep link:** `https://t.me/VibesMatch_bot/app?startapp=invite_ABC123`
3. **User 2 кликает ссылку** → бот получает `/start invite_ABC123`
4. **Бот показывает сообщение** с кнопкой открыть Mini App
5. **Mini App открывается** с параметром `startapp=invite_ABC123`
6. **Mini App парсит параметр** и автоматически присоединяет к комнате

### Код для парсинга в Mini App:

```typescript
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { retrieveLaunchParams } from '@telegram-apps/sdk'

export function useDeepLinking() {
  const router = useRouter()

  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams()
    const params = new URLSearchParams(initDataRaw)
    const startParam = params.get('start_param')

    if (startParam?.startsWith('invite_')) {
      const code = startParam.replace('invite_', '')
      router.push(`/join/${code}`)
    }
  }, [router])
}
```

---

## 🌐 Production Setup

### Для production нужно:

1. **Deploy Mini App на Vercel/Netlify**

   ```
   https://matchvibe.vercel.app
   ```

2. **Обновить Web App URL в @BotFather**

   ```
   /editapp
   → @VibesMatch_bot
   → Web App URL: https://matchvibe.vercel.app
   ```

3. **Обновить .env на Vercel**

   ```env
   NEXT_PUBLIC_APP_URL=https://matchvibe.vercel.app
   ```

4. **Установить webhook**

   ```bash
   pnpm bot:webhook
   ```

5. **Можно вернуть `web_app` кнопки** (опционально)

   Если хотите использовать `web_app` вместо `url` в production:

   ```typescript
   // Production version
   reply_markup: {
     inline_keyboard: [
       [
         {
           text: '🎮 Начать игру',
           web_app: { url: 'https://matchvibe.vercel.app' },
         },
       ],
     ]
   }
   ```

---

## 🐛 Troubleshooting

### Ошибка: "Only HTTPS links are allowed"

- ✅ Используйте `url` вместо `web_app` для локальной разработки
- ✅ Или используйте ngrok/localtunnel для HTTPS туннеля

### Mini App не открывается

- ✅ Проверьте, что Web App URL настроен в @BotFather
- ✅ Убедитесь, что `pnpm dev` запущен на порту 3002
- ✅ Проверьте, что URL в @BotFather: `http://localhost:3002`

### Deep linking не работает

- ✅ Проверьте формат: `https://t.me/bot/app?startapp=invite_CODE`
- ✅ Убедитесь, что Mini App парсит `start_param`
- ✅ Проверьте, что код приглашения валидный

---

## 📚 Полезные ссылки

- [Telegram Bot API - Web Apps](https://core.telegram.org/bots/webapps)
- [Telegram Mini Apps SDK](https://docs.telegram-mini-apps.com/)
- [grammy Documentation](https://grammy.dev/)

---

## ✅ Checklist

- [x] Убраны `web_app` кнопки из команд
- [x] Добавлены `url` кнопки с deep links
- [x] Добавлены инструкции в сообщениях
- [x] Deep linking работает для приглашений
- [x] TypeScript без ошибок
- [x] Бот работает локально

---

**Готово!** Теперь бот работает в локальной разработке без ошибок HTTPS! 🎉
