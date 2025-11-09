/**
 * Set Telegram Webhook for production
 * Run this script after deploying to production
 */

import 'dotenv/config'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') // Remove trailing slash
const WEBHOOK_URL = `${APP_URL}/api/bot/webhook`
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set')
  process.exit(1)
}

if (!APP_URL) {
  console.error('❌ NEXT_PUBLIC_APP_URL is not set')
  process.exit(1)
}

async function setWebhook() {
  console.log('🔧 Setting Telegram webhook...')
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`)

  if (WEBHOOK_SECRET) {
    console.log(
      `🔒 Using webhook secret: ${WEBHOOK_SECRET.substring(0, 4)}...${WEBHOOK_SECRET.substring(WEBHOOK_SECRET.length - 4)}`
    )
  } else {
    console.log('⚠️  No webhook secret set (TELEGRAM_WEBHOOK_SECRET)')
  }

  try {
    const webhookConfig: any = {
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query', 'inline_query'],
      drop_pending_updates: true,
    }

    // Add secret_token if available
    if (WEBHOOK_SECRET) {
      webhookConfig.secret_token = WEBHOOK_SECRET
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookConfig),
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
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
