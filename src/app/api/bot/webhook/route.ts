import { NextRequest, NextResponse } from 'next/server'
import { webhookCallback } from 'grammy'
import { getBot } from '@/bot'

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
  // Security check
  if (!verifyWebhookSecret(request)) {
    console.error('Invalid webhook secret token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const update = await request.json()

    // Handle the update using grammy's webhook callback
    const bot = getBot()
    const handler = webhookCallback(bot, 'std/http')
    await handler(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
