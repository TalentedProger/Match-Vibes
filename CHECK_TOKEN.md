# 🔍 Проверка токена бота

## Быстрая проверка токена

Выполните в PowerShell (замените `ВАШ_ТОКЕН` на настоящий токен):

```powershell
# Проверка токена
Invoke-RestMethod -Uri "https://api.telegram.org/botВАШ_ТОКЕН/getMe" | ConvertTo-Json

# Если токен правильный, вы увидите:
# {
#   "ok": true,
#   "result": {
#     "id": 8110389649,
#     "is_bot": true,
#     "first_name": "VibesMatch",
#     "username": "VibesMatch_bot"
#   }
# }

# Если токен неправильный:
# {
#   "ok": false,
#   "error_code": 401,
#   "description": "Unauthorized"
# }
```

## Проверка переменных окружения

```powershell
# В папке проекта создайте файл test-env.js:
```

```javascript
// test-env.js
require('dotenv').config({ path: '.env.local' })

console.log('Environment variables check:')
console.log(
  'TELEGRAM_BOT_TOKEN:',
  process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'
)
console.log(
  'NEXT_PUBLIC_TELEGRAM_BOT_TOKEN:',
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'
)
console.log(
  'NEXT_PUBLIC_SUPABASE_URL:',
  process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'
)

// Show first/last 10 chars of token (for verification without exposing)
if (process.env.TELEGRAM_BOT_TOKEN) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  console.log(`Token format: ${token.slice(0, 10)}...${token.slice(-10)}`)
  console.log(`Token length: ${token.length} chars (should be ~45)`)
}
```

Затем запустите:

```powershell
node test-env.js
```

## Удаление webhook (если нужно)

Если бот не запускается из-за существующего webhook:

```powershell
# Удалите webhook
Invoke-RestMethod -Uri "https://api.telegram.org/botВАШ_ТОКЕН/deleteWebhook?drop_pending_updates=true"

# Проверьте что webhook удален
Invoke-RestMethod -Uri "https://api.telegram.org/botВАШ_ТОКЕН/getWebhookInfo"
```

Должно вернуться:

```json
{
  "ok": true,
  "result": {
    "url": "",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```
