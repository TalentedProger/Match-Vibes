import { Context } from 'grammy'
import {
  ensureUserExists,
  getRoomByInvitationCode,
} from '../utils/user-manager'

// Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
const getAppUrl = () =>
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3002'
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'VibesMatch_bot'

export async function handleStartCommand(ctx: Context) {
  const startParam = ctx.match as string

  // Handle invitation deep linking
  if (startParam && startParam.startsWith('invite_')) {
    const invitationCode = startParam.replace('invite_', '')

    // Ensure user exists in database (create if needed)
    const user = await ensureUserExists(ctx)
    if (!user) {
      await ctx.reply(
        '❌ *Ошибка регистрации*\n\n' +
          'Не удалось создать профиль. Попробуйте еще раз через несколько секунд.',
        { parse_mode: 'Markdown' }
      )
      return
    }

    // Get room information
    const room = await getRoomByInvitationCode(invitationCode)
    if (!room) {
      await ctx.reply(
        '❌ *Приглашение недействительно*\n\n' +
          '• Комната не найдена или игра уже началась\n' +
          '• Попросите новое приглашение\n\n' +
          '💡 Создайте свою игру командой /play',
        { parse_mode: 'Markdown' }
      )
      return
    }

    const hostName =
      room.host?.username || room.host?.first_name || 'Пользователь'
    const categoryName = room.categories?.name || 'Неизвестная категория'

    const firstName = ctx.from?.first_name || 'друг'
    const isNewUser =
      !user.created_at ||
      new Date().getTime() - new Date(user.created_at).getTime() < 60000 // Created in last minute

    let message = '🎉 *Приглашение в игру!*\n\n'

    if (isNewUser) {
      message += `👋 Привет, ${firstName}! Добро пожаловать в MatchVibe!\n\n`
    }

    message += `👤 *${hostName}* пригласил вас в комнату\n`
    message += `🎯 *Тема:* ${categoryName}\n\n`
    message += '✨ Узнайте, насколько совпадают ваши вкусы!\n\n'
    message += `🔗 Код: \`${invitationCode}\``

    // Always use inline button for Mini App (works for both HTTP/HTTPS)
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎮 Присоединиться к игре',
              web_app: {
                url: `${getAppUrl()}/join/${invitationCode}`,
              },
            },
          ],
          [
            {
              text: '❓ Как играть?',
              callback_data: 'help',
            },
          ],
        ],
      },
    })
    return
  }

  // Default welcome message - ensure user exists
  const user = await ensureUserExists(ctx)
  if (!user) {
    await ctx.reply(
      '❌ *Ошибка регистрации*\n\n' +
        'Не удалось создать профиль. Попробуйте еще раз через несколько секунд.',
      { parse_mode: 'Markdown' }
    )
    return
  }

  const firstName = ctx.from?.first_name || 'друг'
  const isNewUser =
    !user.created_at ||
    new Date().getTime() - new Date(user.created_at).getTime() < 60000 // Created in last minute

  let welcomeMessage = `👋 *Привет, ${firstName}!*\n\n`

  if (isNewUser) {
    welcomeMessage += '🎉 *Добро пожаловать в MatchVibe!*\n\n'
    welcomeMessage += 'Это игра для проверки совместимости с друзьями.\n\n'
  } else {
    welcomeMessage += 'С возвращением в *MatchVibe*!\n\n'
  }

  welcomeMessage += '✨ *Как это работает:*\n'
  welcomeMessage += '• Создай комнату и выбери категорию\n'
  welcomeMessage += '• Отправь ссылку другу\n'
  welcomeMessage += '• Свайпайте карточки вместе\n'
  welcomeMessage += '• Узнайте результаты!\n\n'
  welcomeMessage += '🎯 Готов начать?'

  // Always use inline buttons (works for both HTTP/HTTPS in Telegram app)
  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Начать игру', web_app: { url: getAppUrl() } }],
        [
          { text: '❓ Помощь', callback_data: 'help' },
          { text: '📊 Статистика', callback_data: 'stats' },
        ],
      ],
    },
  })
}
