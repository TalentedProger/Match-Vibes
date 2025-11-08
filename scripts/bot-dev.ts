/**
 * Run Telegram Bot in development mode (polling)
 * Use this script to test bot locally without deploying
 */

import 'dotenv/config'
import { getBot } from '../src/bot'

console.log('🤖 Starting MatchVibe bot in polling mode...')
console.log('📍 Environment:', process.env.NODE_ENV || 'development')

// Get bot instance
const bot = getBot()

// Start the bot in polling mode
bot
  .start({
    drop_pending_updates: true,
    onStart: (botInfo) => {
      console.log('✅ Bot started successfully!')
      console.log(`📱 Bot username: @${botInfo.username}`)
      console.log('\n💡 Send /start to the bot to test')
      console.log('🛑 Press Ctrl+C to stop\n')
    },
  })
  .catch((error) => {
    console.error('❌ Failed to start bot:', error)
    process.exit(1)
  })

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n\n🛑 Stopping bot...')
  bot.stop()
  console.log('✅ Bot stopped')
  process.exit(0)
})

process.once('SIGTERM', () => {
  console.log('\n\n🛑 Stopping bot...')
  bot.stop()
  console.log('✅ Bot stopped')
  process.exit(0)
})
