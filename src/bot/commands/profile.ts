import { Context } from 'grammy'

// Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
const getAppUrl = () =>
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3002'
const isHttps = () => getAppUrl().startsWith('https://')

export async function handleProfileCommand(ctx: Context) {
  const firstName = ctx.from?.first_name || 'друг'

  const message =
    `👤 *Профиль: ${firstName}*\n\n` +
    'В профиле ты можешь:\n' +
    '• Изменить имя пользователя\n' +
    '• Посмотреть статистику\n' +
    '• Управлять настройками'

  if (isHttps()) {
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '👤 Открыть профиль',
              web_app: { url: `${getAppUrl()}/profile` },
            },
          ],
        ],
      },
    })
  } else {
    await ctx.reply(
      message +
        '\n\n' +
        '📱 Открой игру через меню (☰) и перейди в \"Профиль\"',
      { parse_mode: 'Markdown' }
    )
  }
}
