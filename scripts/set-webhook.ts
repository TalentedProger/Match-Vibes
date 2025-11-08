/**
 * Set Telegram Webhook for production
 * Run this script after deploying to production
 */

import 'dotenv/config'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/bot/webhook`
const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set')
  process.exit(1)
}

if (!WEBHOOK_URL) {
  console.error('❌ NEXT_PUBLIC_APP_URL is not set')
  process.exit(1)
}

if (!SECRET_TOKEN) {
  console.warn('⚠️  TELEGRAM_WEBHOOK_SECRET is not set (not recommended)')
}

async function setWebhook() {
  console.log('🔧 Setting Telegram webhook...')
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`)

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          secret_token: SECRET_TOKEN,
          allowed_updates: ['message', 'callback_query', 'inline_query'],
          drop_pending_updates: true,
        }),
      }
    )

    const data = await response.json()

    if (data.ok) {
      console.log('✅ Webhook set successfully!')
      console.log(data)
    } else {
      console.error('❌ Failed to set webhook:')
      console.error(data)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error)
    process.exit(1)
  }
}

async function getWebhookInfo() {
  console.log('\n📊 Getting webhook info...')

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
    )

    const data = await response.json()

    if (data.ok) {
      console.log('✅ Webhook info:')
      console.log(JSON.stringify(data.result, null, 2))
    } else {
      console.error('❌ Failed to get webhook info:')
      console.error(data)
    }
  } catch (error) {
    console.error('❌ Error getting webhook info:', error)
  }
}

// Run
setWebhook()
  .then(() => getWebhookInfo())
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
