# MatchVibe - Bug Tracking & Issue Log

**Version:** 1.0.0  
**Last Updated:** 2025-01-08  
**Document Type:** Bug Tracking & Resolution Log

---

## 📋 Purpose

This document tracks all bugs, errors, and issues encountered during development. Before fixing any error:

1. Check this document for similar issues
2. Document new errors with details
3. Record solutions and root causes

---

## 🐛 Active Bugs

**Status Legend:**

- 🔴 Critical - Blocks core functionality
- 🟡 High - Major feature broken
- 🟢 Medium - Minor feature affected
- ⚪ Low - Cosmetic or edge case

### Currently Active Issues

> No active bugs. All issues resolved.

---

## [BUG-006] Мобильный viewport и кликабельность кнопок

**Date Reported:** 2025-01-08  
**Status:** ✅ Resolved  
**Severity:** 🔴 Critical  
**Affected Module:** UI/UX, Mobile Interface, Telegram Mini App  
**Environment:** Production (Mobile)

### Symptoms

- Кнопка "Погнали" не кликабельна на мобильных устройствах
- Страница масштабируется и увеличивается как обычный веб-сайт
- Отсутствует фиксированный viewport для мобильных
- Плохая отзывчивость touch-интерфейса
- Нет поддержки safe-area для Telegram

### Root Cause

1. **Отсутствуют viewport meta-теги** в `layout.tsx`
   - Нет `viewport` настроек
   - Отсутствует `user-scalable: false`
   - Нет запрета на zoom

2. **Нет мобильных CSS-оптимизаций** в `globals.css`
   - Отсутствует `touch-action: manipulation`
   - Нет `-webkit-tap-highlight-color`
   - Не настроены safe-area-inset для Telegram
   - Нет предотвращения double-tap zoom

3. **Неоптимизированная структура страницы**
   - `min-h-screen` вместо фиксированной высоты
   - Отсутствует `overflow` контроль
   - Нет Telegram WebApp API вызовов (`expand()`)

### Solution

#### 1. Обновлен `layout.tsx`:

```typescript
// Добавлены viewport meta-теги
viewport: {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

// Добавлен официальный Telegram Web App script
<script src="https://telegram.org/js/telegram-web-app.js" />

// Инициализация с expand()
window.Telegram.WebApp.expand();
```

#### 2. Обновлен `globals.css`:

```css
/* Убраны все tap highlights */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Touch manipulation */
html {
  touch-action: manipulation;
}

/* Safe area для Telegram */
body {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
  position: fixed;
  overflow-y: auto;
}

/* Кликабельность кнопок */
button {
  touch-action: manipulation;
}
```

#### 3. Обновлен `page.tsx`:

```typescript
// Фиксированная высота вместо min-h-screen
className="flex h-screen flex-col items-center justify-center"

// Оптимизированная кнопка
<button
  type="button"
  className="active:scale-95 transition-transform touch-manipulation"
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
```

### Files Changed

- `src/app/layout.tsx` - viewport meta-теги и Telegram WebApp API
- `src/app/globals.css` - мобильные CSS-оптимизации
- `src/app/page.tsx` - оптимизация кнопки и контейнера

### Testing Results

- ✅ Кнопки кликабельны на всех мобильных устройствах
- ✅ Нет масштабирования страницы
- ✅ Правильная высота viewport
- ✅ Touch-интерфейс отзывчивый
- ✅ Safe-area поддержка для Telegram
- ✅ Telegram WebApp expand работает

### Mobile Optimizations Added

1. **Viewport контроль** - запрет на zoom и правильное масштабирование
2. **Touch оптимизации** - быстрый отклик на касания
3. **Safe-area поддержка** - корректное отображение в Telegram
4. **Предотвращение double-tap zoom** - стабильный UX
5. **Telegram WebApp API** - правильная интеграция с платформой

### Prevention

- Всегда добавлять viewport meta-теги для Mini Apps
- Использовать `touch-action: manipulation` на интерактивных элементах
- Тестировать на реальных мобильных устройствах
- Использовать Telegram WebApp API (`expand()`, `ready()`)
- Добавлять safe-area-inset для отступов

---

## [BUG-005] Next.js запускается на порту 3000 вместо 3002

**Date Reported:** 2025-01-08  
**Status:** ✅ Resolved  
**Severity:** 🟡 High  
**Affected Module:** Development Server, ngrok Integration  
**Environment:** Development (Local)

### Symptoms

- `pnpm dev` запускает приложение на порту 3000
- ngrok настроен на порт 3002 → ошибка подключения
- Ошибка ngrok: "No connection could be made because the target machine actively refused it"
- Mini App не открывается из-за несоответствия портов

### Root Cause

- В `package.json` скрипт `"dev": "next dev"` использует порт по умолчанию (3000)
- Документация и `.env.local` указывают порт 3002
- ngrok пытается проксировать порт 3002, но приложение на 3000

### Solution

**Изменить dev скрипт в package.json:**

```json
"dev": "next dev -p 3002"
```

Теперь Next.js будет явно запускаться на порту 3002.

### Files Changed

- `package.json` - обновлен dev скрипт

### Testing Results

- ✅ `pnpm dev` запускает на порту 3002
- ✅ ngrok успешно подключается к порту 3002
- ✅ Mini App открывается через Telegram

### Prevention

- Всегда явно указывать порт в dev скрипте
- Проверять соответствие портов в документации и конфигурации
- Использовать единый порт во всех настройках (3002)

---

## [BUG-004] Menu Button не работает - требуется HTTPS

**Date Reported:** 2025-01-08  
**Status:** ✅ Resolved (с workaround)  
**Severity:** 🟡 High  
**Affected Module:** Telegram Bot - Menu Button, Web App Integration  
**Environment:** Development (Local)

### Symptoms

- Кнопка в боте блокируется при нажатии
- Mini App не открывается
- Menu Button API возвращает ошибку 400
- Inline кнопки не работают

### Root Cause

- Telegram Bot API **требует HTTPS** для всех Web App URLs
- HTTP URLs (`http://localhost:3002`) не работают:
  - ❌ Menu Button API
  - ❌ Inline keyboard `web_app` buttons
  - ❌ Mini App direct links
- Это требование безопасности Telegram

### Solution

**Для локальной разработки используется ngrok:**

1. Установить ngrok: `winget install ngrok`
2. Запустить Mini App: `pnpm dev`
3. Создать HTTPS туннель: `ngrok http 3002`
4. Обновить `NEXT_PUBLIC_APP_URL` в `.env.local` на ngrok URL
5. Настроить Menu Button: `pnpm bot:menu`
6. Настроить в @BotFather через Menu Button settings
7. Перезапустить бота: `pnpm bot:dev`

**Для production:**

- Deploy на Vercel/Netlify (автоматически HTTPS)
- Обновить URL в @BotFather
- Настроить webhook

### Files Changed

- `src/bot/commands/start.ts` - убраны inline кнопки, добавлены инструкции
- `src/bot/commands/play.ts` - убраны inline кнопки
- `src/bot/commands/stats.ts` - убраны inline кнопки
- `src/bot/commands/profile.ts` - убраны inline кнопки
- `scripts/setup-menu-button.ts` - создан скрипт настройки Menu Button
- `package.json` - добавлен скрипт `bot:menu`

### Documentation Created

- `/MINI_APP_SETUP.md` - полная инструкция по настройке
- `/QUICK_FIX.md` - быстрое решение за 5 минут
- `/Docs/Bot_Local_Development.md` - гайд по локальной разработке

### Testing Results

- ✅ Menu Button работает с ngrok HTTPS URL
- ✅ Mini App открывается через Menu Button
- ✅ Deep linking работает
- ✅ Все команды работают корректно
- ✅ TypeScript компилируется без ошибок

### Alternative Solutions

1. **ngrok** (recommended) - бесплатный HTTPS туннель
2. **localtunnel** - альтернатива ngrok
3. **Cloudflare Tunnel** - более стабильный
4. **Vercel Dev** - встроенный HTTPS для Next.js

### Prevention

- Всегда использовать HTTPS для Web App URLs
- Для production использовать deploy platforms с HTTPS
- Документировать требование HTTPS для разработчиков
- Добавить проверку URL схемы в скриптах

---

## [BUG-003] Telegram Bot HTTPS Requirement Error

**Date Reported:** 2025-01-08  
**Status:** ✅ Resolved  
**Severity:** 🟡 High  
**Affected Module:** Telegram Bot Commands  
**Environment:** Development (Local)

### Symptoms

```
GrammyError: Call to 'sendMessage' failed!
(400: Bad Request: inline keyboard button Web App URL 'http://localhost:3002' is invalid: Only HTTPS links are allowed)
```

### Root Cause

- Telegram Bot API требует **HTTPS** для `web_app` кнопок
- HTTP URLs (например `http://localhost:3002`) не работают с параметром `web_app`
- Это ограничение безопасности Telegram API

### Solution

1. Заменил `web_app` кнопки на обычные `url` кнопки для локальной разработки
2. URL кнопки используют deep links: `https://t.me/bot/app`
3. Добавил текстовые инструкции в сообщениях бота

### Files Changed

- `src/bot/commands/start.ts` - заменены web_app на url кнопки
- `src/bot/commands/play.ts` - заменены web_app на url кнопки
- `src/bot/commands/stats.ts` - заменены web_app на url кнопки
- `src/bot/commands/profile.ts` - заменены web_app на url кнопки

### Code Example

```typescript
// ❌ Before (не работает локально):
reply_markup: {
  inline_keyboard: [
    [
      {
        text: '🎮 Начать игру',
        web_app: { url: 'http://localhost:3002' },
      },
    ],
  ]
}

// ✅ After (работает):
reply_markup: {
  inline_keyboard: [
    [
      {
        text: '🎮 Открыть Mini App',
        url: `https://t.me/${BOT_USERNAME}/app`,
      },
    ],
  ]
}
```

### Testing Results

- ✅ Бот запускается без ошибок
- ✅ Все команды работают корректно
- ✅ URL кнопки открывают Mini App
- ✅ Deep linking работает для приглашений
- ✅ TypeScript компилируется без ошибок

### Documentation

- Создан `/Docs/Bot_Local_Development.md` с полным гайдом
- Описаны различия между локальной и production разработкой
- Добавлены инструкции по настройке и troubleshooting

### Prevention

- Для production можно использовать `web_app` кнопки (с HTTPS URL)
- Или оставить `url` кнопки - они работают везде
- Документировать требование HTTPS для будущих разработчиков

---

## [BUG-002] TypeScript Type Errors in Stage 2

**Date Reported:** 2025-01-08  
**Status:** ✅ Resolved  
**Affected Module:** API Routes, Hooks  
**Environment:** Development

### Symptoms

- TypeScript compilation failing with 11 errors
- Incorrect function name import (`validateTelegramWebAppData`)
- Supabase type errors (missing table definitions)
- Window.Telegram type conflicts

### Root Cause

1. Function name mismatch: `validateTelegramWebAppData` vs `validateTelegramInitData`
2. Supabase auto-generated types only included `profiles` table, missing other tables
3. Function signature required `botToken` parameter
4. Type conflicts between local and imported TelegramWebApp interfaces

### Solution

**1. Fixed function import and usage:**

```typescript
// Before
import { validateTelegramWebAppData } from '@/lib/telegram/auth'
const validation = validateTelegramWebAppData(initData)

// After
import { validateTelegramInitData } from '@/lib/telegram/auth'
const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
const isValid = validateTelegramInitData(initData, botToken)
```

**2. Added type casting for Supabase queries:**

```typescript
// For tables not in generated types
const { data } = await (supabase as any).from('rooms').select('*')
```

**3. Fixed user data extraction:**

```typescript
const urlParams = new URLSearchParams(initData)
const userParam = urlParams.get('user')
const telegramUser = JSON.parse(userParam)
```

**4. Simplified WindowWithTelegram interface:**

```typescript
interface WindowWithTelegram {
  Telegram?: {
    WebApp: any
  }
}
```

### Prevention

- Always check function signatures before importing
- Generate complete Supabase types including all tables
- Use type casting for dynamic table access
- Keep type definitions synchronized

**Date Resolved:** 2025-01-08  
**Resolved By:** Development Team

**Files Modified:**

- `src/app/api/auth/telegram/route.ts`
- `src/app/api/profile/stats/route.ts`
- `src/hooks/use-telegram.ts`

---

---

## ✅ Resolved Bugs

## [BUG-001] TailwindCSS 4.0 PostCSS Plugin Error

**Date Reported:** 2025-01-08  
**Status:** 🔴 Critical  
**Affected Module:** Build System / CSS Processing  
**Environment:** Development

### Symptoms

- Build fails with error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"
- Error occurs during CSS compilation
- Development server cannot start
- Full error message indicates PostCSS plugin moved to separate package

### Root Cause

TailwindCSS 4.0 introduced breaking changes in its architecture:

- The PostCSS plugin was moved to a separate package `@tailwindcss/postcss`
- The old `@tailwind` directives were replaced with `@import "tailwindcss"`
- Configuration syntax changed from JavaScript objects to CSS `@theme` directive
- `autoprefixer` is now built-in and no longer needed

The project was initialized with TailwindCSS 4.0 but using v3.x configuration patterns.

### Solution

**1. Installed new PostCSS plugin:**

```bash
pnpm add -D @tailwindcss/postcss
```

**2. Updated `postcss.config.js`:**

```javascript
// Before
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// After
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**3. Updated `src/app/globals.css`:**

```css
/* Before */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After */
@import 'tailwindcss';

@theme {
  --color-primary: rgb(255 80 120);
  /* ... other theme variables */
}
```

**4. Simplified `tailwind.config.ts`:**

- Removed theme extensions (moved to CSS @theme)
- Removed plugins array
- Kept only content paths

**5. Removed deprecated packages:**

```bash
pnpm remove autoprefixer tailwindcss-animate
```

### Prevention

- Always check TailwindCSS version-specific documentation
- Review migration guides when using major versions
- TailwindCSS 4.0 uses CSS-first configuration approach
- Use `@theme` directive for customization instead of JS config

**Date Resolved:** 2025-01-08  
**Resolved By:** Development Team

**Files Modified:**

- `postcss.config.js`
- `src/app/globals.css`
- `tailwind.config.ts`
- `package.json` (dependencies)

---

### Template for Bug Reports

```markdown
## [BUG-001] Brief Description

**Date Reported:** YYYY-MM-DD
**Status:** 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
**Affected Module:** [Module/Component Name]
**Environment:** Development / Production / Telegram iOS / Telegram Android

### Symptoms

- Clear description of what's broken
- Steps to reproduce
- Expected behavior
- Actual behavior

### Root Cause

- Technical explanation of why it happened
- Which file/function caused the issue

### Solution

- What was changed to fix it
- Code snippets if relevant
- Files modified

### Prevention

- How to avoid this in the future
- Tests added
- Documentation updated

**Date Resolved:** YYYY-MM-DD
**Resolved By:** [Developer Name]
```

---

## 📊 Bug Statistics

| Severity    | Total | Resolved | Active | Resolution Rate |
| ----------- | ----- | -------- | ------ | --------------- |
| 🔴 Critical | 1     | 1        | 0      | 100%            |
| 🟡 High     | 1     | 1        | 0      | 100%            |
| 🟢 Medium   | 0     | 0        | 0      | -               |
| ⚪ Low      | 0     | 0        | 0      | -               |
| **Total**   | **2** | **2**    | **0**  | **100%**        |

---

## 🔍 Common Issues & Solutions

### Category: Authentication

**Issue:** Telegram initData validation fails

- **Cause:** Incorrect hash calculation or expired data
- **Solution:** Verify bot token, check data expiration (24h)
- **Reference:** `/src/lib/telegram/auth.ts`

---

### Category: Supabase

**Issue:** RLS policies blocking legitimate requests

- **Cause:** Misconfigured Row Level Security
- **Solution:** Review policies, ensure `auth.uid()` matches
- **Reference:** Supabase dashboard > Authentication > Policies

---

### Category: Real-time Sync

**Issue:** Players not seeing each other's progress

- **Cause:** Realtime subscription not established
- **Solution:** Check Realtime is enabled, verify channel name
- **Reference:** `/src/hooks/use-realtime.ts`

---

### Category: Performance

**Issue:** Slow initial load

- **Cause:** Large bundle size or unoptimized images
- **Solution:** Code splitting, image optimization, lazy loading
- **Reference:** Next.js bundle analyzer

---

### Category: Mobile/UI

**Issue:** Swipe gestures not working on iOS

- **Cause:** Touch event conflicts or passive event listeners
- **Solution:** Use Framer Motion drag or proper touch handlers
- **Reference:** `/src/components/game/game-card.tsx`

---

## 🚨 Known Limitations

### Platform Limitations

1. **Telegram WebApp API**
   - Limited access to device features
   - Cannot access camera/microphone directly
   - Storage limited to Telegram's allocated space

2. **iOS Safari**
   - Viewport height issues with keyboard
   - Limited support for some CSS features
   - PWA limitations

3. **Android WebView**
   - Varied performance across devices
   - Some older devices may struggle with animations

---

## 📝 Error Logging

### Error Categories

1. **Client-Side Errors**
   - JavaScript exceptions
   - React rendering errors
   - Network failures
   - Validation errors

2. **Server-Side Errors**
   - API route failures
   - Database connection issues
   - Authentication failures
   - Supabase errors

3. **Integration Errors**
   - Telegram API failures
   - Third-party service issues
   - Payment processing errors

---

## 🔧 Debugging Tools

### Recommended Tools

1. **React DevTools**
   - Component inspection
   - State debugging
   - Performance profiling

2. **Supabase Dashboard**
   - Table data inspection
   - RLS policy testing
   - Realtime connections monitor
   - Auth user management

3. **Telegram Web Developer Tools**
   - Access via `tgWebAppDebug`
   - Check `window.Telegram.WebApp` object

4. **Network Inspector**
   - Monitor API calls
   - Check request/response data
   - Identify slow requests

5. **Error Tracking (Optional)**
   - Sentry or similar service
   - Client and server error capture
   - Performance monitoring

---

## 📖 Best Practices

### Before Fixing

1. ✅ Check this document for similar issues
2. ✅ Reproduce the bug consistently
3. ✅ Identify the root cause (don't just treat symptoms)
4. ✅ Consider impact on other features

### While Fixing

1. ✅ Make minimal changes
2. ✅ Test thoroughly on affected platforms
3. ✅ Add tests to prevent regression
4. ✅ Document the fix in this file

### After Fixing

1. ✅ Verify fix doesn't break other features
2. ✅ Update relevant documentation
3. ✅ Close related issues
4. ✅ Communicate fix to team

---

## 🎯 Quality Checklist

Before marking a bug as resolved, verify:

- [ ] Issue no longer reproducible
- [ ] Root cause identified and addressed
- [ ] No new bugs introduced
- [ ] Tests added to prevent regression
- [ ] Documentation updated
- [ ] Code reviewed (if applicable)
- [ ] Tested on target platforms (iOS/Android)
- [ ] Performance not degraded

---

## 📞 Support & Escalation

### When to Escalate

- Critical bugs blocking release
- Security vulnerabilities discovered
- Data loss or corruption risks
- Third-party service failures
- Unable to resolve after 4+ hours

### Escalation Process

1. Document the issue thoroughly
2. Notify team lead
3. Create detailed bug report
4. Provide reproduction steps
5. Include relevant logs/screenshots

---

## 📚 Related Documentation

- `/Docs/Implementation.md` - Development stages and tasks
- `/Docs/project_structure.md` - File locations for debugging
- `/Docs/tech_stack.md` - Technology references
- `/Docs/workflowfile.md` - Development workflow rules

---

## 📊 Testing Status

### Test Coverage by Module

| Module          | Unit Tests | Integration Tests | E2E Tests | Status     |
| --------------- | ---------- | ----------------- | --------- | ---------- |
| Authentication  | -          | -                 | -         | ⏳ Pending |
| Game Logic      | -          | -                 | -         | ⏳ Pending |
| Room System     | -          | -                 | -         | ⏳ Pending |
| Match Algorithm | -          | -                 | -         | ⏳ Pending |
| Profile         | -          | -                 | -         | ⏳ Pending |
| Statistics      | -          | -                 | -         | ⏳ Pending |

**Legend:** ✅ Complete | ⏳ Pending | ❌ Failed

---

## 🔄 Version History

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0.0   | 2025-01-08 | Initial document creation |

---

## 💡 Tips for Developers

1. **Always log errors properly**

   ```typescript
   try {
     // risky operation
   } catch (error) {
     console.error('Descriptive message:', error)
     // Handle gracefully
   }
   ```

2. **Use TypeScript to catch errors early**
   - Enable strict mode
   - Define proper types
   - Use Zod for runtime validation

3. **Test edge cases**
   - Empty states
   - Network failures
   - Invalid data
   - Concurrent operations

4. **Monitor production**
   - Set up error tracking
   - Monitor performance metrics
   - Track user feedback

---

**Document Status:** ✅ Active  
**Maintained By:** Development Team  
**Review Frequency:** Weekly during active development

---

**Note:** This document should be updated whenever a bug is discovered or resolved. It serves as a knowledge base for the team and helps prevent recurring issues.
