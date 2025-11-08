import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/game/[roomId]/response
 * Submit a player's response to a question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId
    const body = await request.json()
    const { question_id, answer, user_id } = body

    // Validate input
    if (!roomId || !question_id || answer === undefined || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (answer !== 0 && answer !== 1) {
      return NextResponse.json(
        { error: 'Answer must be 0 (dislike) or 1 (like)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if room exists and user is part of it
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Verify user is part of the room
    if (room.host_id !== user_id && room.guest_id !== user_id) {
      return NextResponse.json(
        { error: 'User is not part of this room' },
        { status: 403 }
      )
    }

    // Insert or update response
    const { data: response, error: responseError } = await supabase
      .from('responses')
      .upsert(
        {
          room_id: roomId,
          user_id,
          question_id,
          answer,
        },
        {
          onConflict: 'room_id,user_id,question_id',
        }
      )
      .select()
      .single()

    if (responseError) {
      console.error('Error saving response:', responseError)
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      )
    }

    // Check if both players have completed all questions
    const { data: questions } = await supabase
      .from('questions')
      .select('id')
      .eq('category_id', room.category_id)
      .eq('is_active', true)

    const totalQuestions = questions?.length || 0

    // Count responses for both players
    const { data: hostResponses } = await supabase
      .from('responses')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', room.host_id)

    const { data: guestResponses } = await supabase
      .from('responses')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', room.guest_id)

    const hostCount = hostResponses?.length || 0
    const guestCount = guestResponses?.length || 0

    // If both players completed, update room status
    if (hostCount >= totalQuestions && guestCount >= totalQuestions) {
      await supabase
        .from('rooms')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', roomId)

      return NextResponse.json({
        success: true,
        response,
        game_completed: true,
      })
    }

    return NextResponse.json({
      success: true,
      response,
      game_completed: false,
      progress: {
        host: hostCount,
        guest: guestCount,
        total: totalQuestions,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
