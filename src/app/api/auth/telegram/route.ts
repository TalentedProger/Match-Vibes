import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateTelegramInitData } from '@/lib/telegram/auth'

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()

    if (!initData) {
      return NextResponse.json(
        { message: 'Init data is required' },
        { status: 400 }
      )
    }

    // Get bot token from environment
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        { message: 'Bot token not configured' },
        { status: 500 }
      )
    }

    // Validate Telegram initData
    const isValid = validateTelegramInitData(initData, botToken)

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid Telegram data' },
        { status: 401 }
      )
    }

    // Parse user data from initData
    const urlParams = new URLSearchParams(initData)
    const userParam = urlParams.get('user')

    if (!userParam) {
      return NextResponse.json(
        { message: 'User data not found in initData' },
        { status: 400 }
      )
    }

    const telegramUser = JSON.parse(userParam)

    // Initialize Supabase client
    const supabase = await createClient()

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error
      console.error('Error fetching user:', fetchError)
      return NextResponse.json(
        { message: 'Database error', error: fetchError.message },
        { status: 500 }
      )
    }

    let user

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          avatar_url: telegramUser.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('telegram_id', telegramUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json(
          { message: 'Failed to update user', error: updateError.message },
          { status: 500 }
        )
      }

      user = updatedUser
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('profiles')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          avatar_url: telegramUser.photo_url,
          premium_status: false,
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { message: 'Failed to create user', error: createError.message },
          { status: 500 }
        )
      }

      user = newUser
    }

    return NextResponse.json({
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        premiumStatus: user.premium_status,
      },
    })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
