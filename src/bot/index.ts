import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'
import { handleHelpCommand } from './commands/help'
import { handleStatsCommand } from './commands/stats'
import { handleProfileCommand } from './commands/profile'

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set')
}

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

// Register commands
bot.command('start', handleStartCommand)
bot.command('play', handlePlayCommand)
bot.command('help', handleHelpCommand)
bot.command('stats', handleStatsCommand)
bot.command('profile', handleProfileCommand)

// Error handler
bot.catch((err) => {
  console.error('Bot error:', err)
})

export default bot
