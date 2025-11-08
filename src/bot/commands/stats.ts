import { Context } from 'grammy'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
const isHttps = APP_URL.startsWith('https://')

export async function handleStatsCommand(ctx: Context) {
  const message = '📊 *Твоя статистика*\n\n' +
    'В приложении ты можешь посмотреть:\n' +
    '• Количество пройденных игр\n' +
    '• Средний процент совпадений\n' +
    '• Любимые категории\n' +
    '• История игр'

  if (isHttps) {
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Открыть статистику', web_app: { url: `${APP_URL}/stats` } }]
        ]
      }
    })
  } else {
    await ctx.reply(
      message + '\n\n' +
      '📱 Открой игру через меню (☰) и перейди в \"Статистика\"',
      { parse_mode: 'Markdown' }
    )
  }
}
