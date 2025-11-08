/**
 * Telegram Bot Notifications
 * Send push notifications via Telegram Bot API
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

interface InlineKeyboardButton {
  text: string
  web_app?: { url: string }
  url?: string
  callback_data?: string
}

interface ReplyMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

/**
 * Send message to Telegram user
 */
async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: ReplyMarkup
) {
  if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN not set, skipping notification')
    return null
  }

  try {
    const response = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Telegram API error: ${JSON.stringify(error)}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
    throw error
  }
}

/**
 * Notify host that partner has joined the room
 */
export async function notifyPartnerJoined(
  hostTelegramId: number,
  roomId: string
) {
  // Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3002'

  await sendTelegramMessage(
    hostTelegramId,
    '✅ *Партнёр присоединился!*\n\nИгра начинается...',
    {
      inline_keyboard: [
        [
          {
            text: '🎮 Открыть игру',
            web_app: { url: `${appUrl}/game/${roomId}` },
          },
        ],
      ],
    }
  )
}

/**
 * Notify both players that game results are ready
 */
export async function notifyGameResults(
  userTelegramId: number,
  gameId: string,
  matchPercentage: number
) {
  // Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3002'

  await sendTelegramMessage(
    userTelegramId,
    `🎉 *Результаты готовы!*\n\n💯 Совпадение: ${matchPercentage}%\n\nПосмотри полные результаты в приложении!`,
    {
      inline_keyboard: [
        [
          {
            text: '📊 Смотреть результаты',
            web_app: { url: `${appUrl}/results/${gameId}` },
          },
        ],
        [{ text: '🎮 Играть ещё раз', web_app: { url: appUrl } }],
      ],
    }
  )
}

/**
 * Send invitation reminder to guest
 */
export async function sendInvitationReminder(
  guestTelegramId: number,
  invitationCode: string
) {
  // Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3002'

  await sendTelegramMessage(
    guestTelegramId,
    '⏰ *Напоминание*\n\nТебя ждут в игре! Не забудь присоединиться.',
    {
      inline_keyboard: [
        [
          {
            text: '🎮 Присоединиться',
            web_app: { url: `${appUrl}/join/${invitationCode}` },
          },
        ],
      ],
    }
  )
}

/**
 * Get Telegram user ID from database profile
 */
export async function getUserTelegramId(
  userId: string
): Promise<number | null> {
  // This should be implemented to fetch telegram_id from profiles table
  // For now, return null as placeholder
  console.warn('getUserTelegramId not implemented yet')
  return null
}
