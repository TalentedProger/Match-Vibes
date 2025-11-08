/**
 * Quick script to check if Telegram bot token is valid
 */

import 'dotenv/config'

const token =
  process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN

if (!token) {
  console.error('❌ No bot token found in environment variables!')
  console.error(
    'Make sure .env.local has TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_TELEGRAM_BOT_TOKEN'
  )
  process.exit(1)
}

console.log('🔍 Checking bot token...')
console.log(`Token: ${token.slice(0, 10)}...${token.slice(-10)}`)
console.log(`Length: ${token.length} chars\n`)

// Check token via Telegram API
fetch(`https://api.telegram.org/bot${token}/getMe`)
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Token is VALID!\n')
      console.log('Bot Info:')
      console.log(`  ID: ${data.result.id}`)
      console.log(`  Name: ${data.result.first_name}`)
      console.log(`  Username: @${data.result.username}`)
      console.log(`  Is Bot: ${data.result.is_bot}`)

      // Check webhook status
      return fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
    } else {
      console.error('❌ Token is INVALID!')
      console.error(`Error: ${data.description}`)
      console.error(`\nPlease create a new token via @BotFather:`)
      console.error(`  1. Open @BotFather in Telegram`)
      console.error(`  2. Send /mybots`)
      console.error(`  3. Select your bot`)
      console.error(`  4. API Token → Revoke current token`)
      console.error(`  5. Copy new token and update .env.local`)
      process.exit(1)
    }
  })
  .then(res => res?.json())
  .then(data => {
    if (!data) return

    console.log('\nWebhook Info:')
    if (data.result.url) {
      console.log(`  ⚠️  Webhook is SET: ${data.result.url}`)
      console.log(`  Pending updates: ${data.result.pending_update_count}`)
      console.log(`\n  To use polling (local dev), delete webhook:`)
      console.log(
        `  Invoke-RestMethod -Uri "https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true"`
      )
    } else {
      console.log(`  ✅ No webhook (polling mode)`)
    }

    console.log('\n✅ All checks passed! Bot is ready to use.')
  })
  .catch(err => {
    console.error('❌ Error checking token:', err.message)
    process.exit(1)
  })
