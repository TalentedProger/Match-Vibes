/**
 * Development Bot Runner with Polling
 * Use this for local development when you don't have ngrok
 *
 * Usage: pnpm dev:bot
 */

import { getBot } from '../src/bot'

console.log('🤖 Starting Telegram Bot in polling mode...')
console.log('⚠️  Development only! Production uses webhook automatically.')
console.log('')

const bot = getBot()

// Delete webhook to enable polling
bot.api
  .deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    console.log('✅ Webhook deleted (polling mode enabled)')

    // Start bot (this will auto-initialize)
    bot.start({
      onStart: botInfo => {
        console.log('✅ Bot started successfully!')
        console.log(`📱 Bot: @${botInfo.username}`)
        console.log('👂 Listening for messages...')
        console.log('')
        console.log('Press Ctrl+C to stop')
      },
    })
  })
  .catch(err => {
    console.error('❌ Failed to start bot:', err.message)
    process.exit(1)
  })

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n👋 Stopping bot...')
  bot.stop()
  process.exit(0)
})

process.once('SIGTERM', () => {
  console.log('\n👋 Stopping bot...')
  bot.stop()
  process.exit(0)
})
