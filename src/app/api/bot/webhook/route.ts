import { NextRequest, NextResponse } from 'next/server'
import { getBotInitialized } from '@/bot'

/**
 * Verify webhook secret token
 */
function verifyWebhookSecret(request: NextRequest): boolean {
  const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

  if (!expectedSecret) {
    console.warn('TELEGRAM_WEBHOOK_SECRET not set, skipping verification')
    return true // Allow in development
  }

  return secretToken === expectedSecret
}

/**
 * Handle incoming webhook updates from Telegram
 */
export async function POST(request: NextRequest) {
  console.log('Webhook POST received')

  // Security check
  if (!verifyWebhookSecret(request)) {
    console.error('Invalid webhook secret token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const update = await request.json()

    // Log incoming update for debugging
    console.log('Received update from Telegram:', {
      update_id: update.update_id,
      type: update.message
        ? 'message'
        : update.callback_query
          ? 'callback'
          : 'other',
      message: update.message?.text || update.message?.caption,
      from:
        update.message?.from?.username || update.callback_query?.from?.username,
    })

    // Get bot instance and ensure it's initialized
    console.log('Getting bot instance...')
    const bot = await getBotInitialized()

    // Handle the update
    console.log('Processing update with bot...')
    await bot.handleUpdate(update)
    console.log('Update processed successfully')

    return NextResponse.json({ ok: true })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''

    console.error('Webhook error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
    })

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    bot: 'MatchVibe',
    timestamp: new Date().toISOString(),
  })
}
