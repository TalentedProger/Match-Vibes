/**
 * Setup Menu Button for Telegram Bot
 * This creates a permanent "Open Mini App" button in the bot's menu
 */

import 'dotenv/config'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set')
  process.exit(1)
}

async function setupMenuButton() {
  console.log('🔧 Setting up Menu Button...')
  console.log(`📱 Web App URL: ${APP_URL}`)

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menu_button: {
            type: 'web_app',
            text: '🎮 Открыть игру',
            web_app: {
              url: APP_URL,
            },
          },
        }),
      }
    )

    const data = await response.json()

    if (data.ok) {
      console.log('✅ Menu Button configured successfully!')
      console.log('\n📱 Теперь в боте появится кнопка меню "🎮 Открыть игру"')
      console.log('👉 Пользователи смогут открыть Mini App через эту кнопку\n')
    } else {
      console.error('❌ Failed to setup menu button:')
      console.error(data)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error setting menu button:', error)
    process.exit(1)
  }
}

async function getMenuButton() {
  console.log('📊 Getting current menu button info...\n')

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMenuButton`
    )

    const data = await response.json()

    if (data.ok) {
      console.log('Current menu button:')
      console.log(JSON.stringify(data.result, null, 2))
    }
  } catch (error) {
    console.error('❌ Error getting menu button:', error)
  }
}

// Run
setupMenuButton()
  .then(() => getMenuButton())
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
