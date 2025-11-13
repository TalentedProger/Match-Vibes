import { Context } from 'grammy'
import { createClient } from '@/lib/supabase/server'

export interface UserProfile {
  id: string
  telegram_id: string
  username: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

/**
 * Check if user exists in database and create if needed
 * Returns user profile or null if creation failed
 */
export async function ensureUserExists(
  ctx: Context
): Promise<UserProfile | null> {
  try {
    const telegramUser = ctx.from
    if (!telegramUser) {
      console.error('No telegram user found in context')
      return null
    }

    const supabase = await createClient()

    // First, try to find existing user
    const { data: existingUser } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id.toString())
      .single()

    if (existingUser) {
      console.log(
        `✅ Existing user found: ${existingUser.username || existingUser.first_name}`
      )
      return existingUser
    }

    // User doesn't exist, create new one
    console.log(`👤 Creating new user for Telegram ID: ${telegramUser.id}`)

    const newUserData = {
      telegram_id: telegramUser.id.toString(),
      username: telegramUser.username || null,
      first_name: telegramUser.first_name || null,
      last_name: telegramUser.last_name || null,
    }

    const { data: newUser, error } = await (supabase as any)
      .from('profiles')
      .insert([newUserData])
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to create new user:', error)
      return null
    }

    console.log(
      `✅ New user created: ${newUser.username || newUser.first_name}`
    )
    return newUser
  } catch (error) {
    console.error('❌ Error in ensureUserExists:', error)
    return null
  }
}

/**
 * Check if user exists without creating
 */
export async function checkUserExists(telegramId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('id')
      .eq('telegram_id', telegramId)
      .single()

    return !error && !!data
  } catch (error) {
    console.error('Error checking user existence:', error)
    return false
  }
}

/**
 * Get room information by invitation code
 */
export async function getRoomByInvitationCode(invitationCode: string) {
  try {
    const supabase = await createClient()

    const { data: room, error } = await (supabase as any)
      .from('rooms')
      .select(
        `
        id,
        invitation_code,
        status,
        category_id,
        subcategory_id,
        host_id,
        guest_id,
        created_at,
        host:profiles!rooms_host_id_fkey(username, first_name),
        categories(name, icon)
      `
      )
      .eq('invitation_code', invitationCode)
      .eq('status', 'waiting')
      .single()

    if (error) {
      console.log(`❌ Room not found for code: ${invitationCode}`)
      return null
    }

    return room
  } catch (error) {
    console.error('Error getting room by invitation code:', error)
    return null
  }
}
