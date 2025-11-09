import { Bot } from 'grammy'
import { handleStartCommand } from './commands/start'
import { handlePlayCommand } from './commands/play'
import { handleHelpCommand } from './commands/help'
import { handleStatsCommand } from './commands/stats'
import { handleProfileCommand } from './commands/profile'

let botInstance: Bot | null = null
let botInitPromise: Promise<void> | null = null

/**
 * Initialize bot (fetch bot info from Telegram)
 * This is called once when bot is first accessed
 */
async function initializeBot(bot: Bot): Promise<void> {
  if (!botInitPromise) {
    botInitPromise = bot.init().then(() => {
      console.log('Bot info fetched successfully')
    })
  }
  return botInitPromise
}

/**
 * Get or create bot instance (lazy initialization)
 * This prevents bot initialization during Next.js build
 */
export function getBot(): Bot {
  if (!botInstance) {
    const token = process.env.TELEGRAM_BOT_TOKEN

    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN is not set in environment variables')
      throw new Error('TELEGRAM_BOT_TOKEN is not set')
    }

    console.log('Creating bot instance...')
    botInstance = new Bot(token)

    // Register commands
    console.log('Registering bot commands...')
    botInstance.command('start', handleStartCommand)
    botInstance.command('play', handlePlayCommand)
    botInstance.command('help', handleHelpCommand)
    botInstance.command('stats', handleStatsCommand)
    botInstance.command('profile', handleProfileCommand)

    // Error handler
    botInstance.catch(err => {
      console.error('Bot command error:', err)
    })

    console.log('Bot instance created successfully')
  }

  return botInstance
}

/**
 * Get bot instance and ensure it's initialized
 * Use this in webhook handler
 */
export async function getBotInitialized(): Promise<Bot> {
  const bot = getBot()
  await initializeBot(bot)
  return bot
}

// Default export
export default getBot
