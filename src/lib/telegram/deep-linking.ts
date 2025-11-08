/**
 * Deep Linking Helpers for Telegram Bot
 */

/**
 * Generate Telegram deep link for invitation
 * Format: https://t.me/botusername?start=invite_CODE
 * This will trigger the bot's /start command with the invitation code
 */
export function generateInvitationDeepLink(invitationCode: string): string {
  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'matchvibe_bot'
  return `https://t.me/${botUsername}?start=invite_${invitationCode}`
}

/**
 * Generate Telegram Mini App direct link
 * Format: https://t.me/botusername/appname?startapp=invite_CODE
 */
export function generateMiniAppDeepLink(invitationCode: string): string {
  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'matchvibe_bot'
  const appName = process.env.NEXT_PUBLIC_TELEGRAM_APP_NAME || 'app'
  return `https://t.me/${botUsername}/${appName}?startapp=invite_${invitationCode}`
}

/**
 * Generate invitation share text for Telegram
 */
export function generateInvitationShareText(invitationCode: string): string {
  return (
    '🎮 Присоединяйся к игре в MatchVibe!\n\n' +
    '👥 Давай узнаем, насколько совпадают наши вкусы!\n\n' +
    `🔗 Код: ${invitationCode}`
  )
}

/**
 * Parse start parameter from deep link
 * Returns type and code if valid invitation link
 */
export function parseStartParam(
  startParam: string
): { type: string; code: string } | null {
  if (startParam.startsWith('invite_')) {
    return {
      type: 'invitation',
      code: startParam.replace('invite_', ''),
    }
  }
  return null
}

/**
 * Generate direct Mini App URL for joining room
 */
export function generateJoinUrl(invitationCode: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
  return `${appUrl}/join/${invitationCode}`
}

/**
 * Generate Telegram share URL
 */
export function generateTelegramShareUrl(
  deepLink: string,
  text: string
): string {
  return `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(text)}`
}
