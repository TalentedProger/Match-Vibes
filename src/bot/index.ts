import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'
import { handleHelpCommand } from './commands/help'
import { handleStatsCommand } from './commands/stats'
import { handleProfileCommand } from './commands/profile'

let botInstance: Bot | null = null

/**
 * Get or create bot instance (lazy initialization)
 * This prevents bot initialization during Next.js build
 */
export function getBot(): Bot {
  if (!botInstance) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set')
    }

    botInstance = new Bot(token)

    // Register commands
    botInstance.command('start', handleStartCommand)
    botInstance.command('play', handlePlayCommand)
    botInstance.command('help', handleHelpCommand)
    botInstance.command('stats', handleStatsCommand)
    botInstance.command('profile', handleProfileCommand)

    // Error handler
    botInstance.catch((err) => {
      console.error('Bot error:', err)
    })
  }

  return botInstance
}

// Default export
export default getBot
