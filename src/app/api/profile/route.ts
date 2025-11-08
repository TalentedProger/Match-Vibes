import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/profile?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { message: 'Failed to fetch profile', error: error.message },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: profile.id,
      telegramId: profile.telegram_id,
      username: profile.username,
      firstName: profile.first_name,
      lastName: profile.last_name,
      avatarUrl: profile.avatar_url,
      premiumStatus: profile.premium_status,
    })
  } catch (error) {
    console.error('Error in GET /api/profile:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

// PUT /api/profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, username } = body

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const updateData: { username?: string; updated_at: string } = {
      updated_at: new Date().toISOString(),
    }

    if (username !== undefined) {
      updateData.username = username
    }

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { message: 'Failed to update profile', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: updatedProfile.id,
      telegramId: updatedProfile.telegram_id,
      username: updatedProfile.username,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      avatarUrl: updatedProfile.avatar_url,
      premiumStatus: updatedProfile.premium_status,
    })
  } catch (error) {
    console.error('Error in PUT /api/profile:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
