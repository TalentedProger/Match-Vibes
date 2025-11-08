import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
const isHttps = APP_URL.startsWith('https://')

export async function handlePlayCommand(ctx: Context) {
  const message = '🎯 *Создай комнату и пригласи друга!*\n\n' +
    'Выбери категорию и начни игру!'

  if (isHttps) {
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Создать комнату', web_app: { url: `${APP_URL}/categories` } }]
        ]
      }
    })
  } else {
    await ctx.reply(
      message + '\n\n' +
      '📱 *Как начать:*\n' +
      '1️⃣ Нажми на кнопку меню (☰) внизу\n' +
      '2️⃣ Выбери \"🎮 Открыть игру\"\n' +
      '3️⃣ Выбери категорию и создай комнату',
      { parse_mode: 'Markdown' }
    )
  }
}
