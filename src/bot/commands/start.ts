import { Context } from 'grammy'

// Use server-side env variable (not NEXT_PUBLIC_) for dynamic reading
const getAppUrl = () =>
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3002'
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'VibesMatch_bot'

// Check if URL is HTTPS
const isHttps = () => getAppUrl().startsWith('https://')

export async function handleStartCommand(ctx: Context) {
  const startParam = ctx.match as string

  // Handle deep linking
  if (startParam && startParam.startsWith('invite_')) {
    const invitationCode = startParam.replace('invite_', '')

    const message =
      '🎉 *Тебя пригласили в игру!*\n\n' +
      '👥 Присоединяйся к комнате и начни проходить тест вместе с другом.\n\n' +
      '✨ Узнайте, насколько совпадают ваши вкусы!\n\n' +
      `🔗 Код приглашения: \`${invitationCode}\``

    if (isHttps()) {
      // HTTPS - используем web_app кнопку
      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Присоединиться к игре',
                web_app: {
                  url: `${getAppUrl()}?startapp=invite_${invitationCode}`,
                },
              },
            ],
          ],
        },
      })
    } else {
      // HTTP - показываем инструкции
      await ctx.reply(
        message +
          '\n\n' +
          '📱 *Как открыть:*\n' +
          '1️⃣ Нажми на кнопку меню (☰) внизу\n' +
          '2️⃣ Выбери "🎮 Открыть игру"\n' +
          '3️⃣ Игра откроется автоматически!',
        { parse_mode: 'Markdown' }
      )
    }
    return
  }

  // Default welcome message
  const firstName = ctx.from?.first_name || 'друг'

  const welcomeMessage =
    `👋 *Привет, ${firstName}!*\n\n` +
    '🎮 Добро пожаловать в *MatchVibe* — игру для проверки совместимости!\n\n' +
    '✨ *Как это работает:*\n' +
    '• Создай комнату и выбери категорию\n' +
    '• Отправь ссылку другу\n' +
    '• Свайпайте карточки вместе\n' +
    '• Узнайте результаты!\n\n' +
    '🎯 Готов начать?'

  if (isHttps()) {
    // HTTPS - используем web_app кнопку
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
  } else {
    // HTTP - показываем инструкции
    await ctx.reply(
      welcomeMessage +
        '\n\n' +
        '📱 *Как открыть игру:*\n' +
        '1️⃣ Нажми на кнопку меню (☰) внизу\n' +
        '2️⃣ Выбери "🎮 Открыть игру"\n' +
        '3️⃣ Начни играть!\n\n' +
        '💡 Команды: /play, /help, /stats',
      { parse_mode: 'Markdown' }
    )
  }
}
