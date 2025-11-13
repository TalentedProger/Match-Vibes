import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/rooms/[roomId]/join - Join room by invitation code
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const params = await props.params
    const invitationCode = params.roomId // roomId is actually the invitation code in this route
    const { userId } = await request.json()

    if (!invitationCode || !userId) {
      return NextResponse.json(
        { message: 'Invitation code and User ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify user exists (important for new users from bot)
    const { data: userProfile, error: userError } = await (supabase as any)
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !userProfile) {
      return NextResponse.json(
        { message: 'User not found. Please restart from the bot.' },
        { status: 404 }
      )
    }

    // Find room by invitation code
    const { data: room, error: findError } = await (supabase as any)
      .from('rooms')
      .select('*')
      .eq('invitation_code', invitationCode)
      .single()

    if (findError || !room) {
      return NextResponse.json(
        { message: 'Invalid invitation code' },
        { status: 404 }
      )
    }

    // Check if room is available
    if (room.status !== 'waiting') {
      return NextResponse.json(
        { message: 'Room is not available' },
        { status: 400 }
      )
    }

    // Check if room already has a guest
    if (room.guest_id) {
      return NextResponse.json(
        { message: 'Room is already full' },
        { status: 400 }
      )
    }

    // Check if user is trying to join their own room
    if (room.host_id === userId) {
      return NextResponse.json(
        { message: 'Cannot join your own room' },
        { status: 400 }
      )
    }

    // Join room
    const { data: updatedRoom, error: updateError } = await (supabase as any)
      .from('rooms')
      .update({
        guest_id: userId,
        status: 'ready',
      })
      .eq('id', room.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to join room:', updateError)
      return NextResponse.json(
        { message: 'Failed to join room', error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ room: updatedRoom }, { status: 200 })
  } catch (error) {
    console.error('Room join error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
