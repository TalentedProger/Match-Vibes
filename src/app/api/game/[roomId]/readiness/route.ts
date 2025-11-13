import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/game/[roomId]/readiness
 * Check if both players have completed all questions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Fetch room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('host_id, guest_id, category_id, subcategory_id, status')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (!room.host_id || !room.guest_id) {
      return NextResponse.json({
        ready: false,
        reason: 'Both players must be present',
        hostPresent: !!room.host_id,
        guestPresent: !!room.guest_id,
      })
    }

    // 2. Get total questions count
    let questionsQuery

    if (room.subcategory_id) {
      questionsQuery = supabase
        .from('questions')
        .select('id')
        .eq('subcategory_id', room.subcategory_id)
        .eq('is_active', true)
    } else {
      const { data: subcategories } = await supabase
        .from('subcategories')
        .select('id')
        .eq('category_id', room.category_id)

      const subcategoryIds = subcategories?.map(s => s.id) || []
      questionsQuery = supabase
        .from('questions')
        .select('id')
        .in('subcategory_id', subcategoryIds)
        .eq('is_active', true)
    }

    const { data: questions } = await questionsQuery
    const expectedCount = questions?.length || 0

    if (expectedCount === 0) {
      return NextResponse.json({
        ready: false,
        reason: 'No questions available for this category',
        expectedCount: 0,
      })
    }

    // 3. Get responses count for both players
    const { data: allResponses } = await supabase
      .from('responses')
      .select('user_id')
      .eq('room_id', roomId)

    const hostResponseCount = (allResponses || []).filter(
      r => r.user_id === room.host_id
    ).length

    const guestResponseCount = (allResponses || []).filter(
      r => r.user_id === room.guest_id
    ).length

    // 4. Check if both players completed all questions
    const hostCompleted = hostResponseCount >= expectedCount
    const guestCompleted = guestResponseCount >= expectedCount
    const bothCompleted = hostCompleted && guestCompleted

    // 5. Check if result already exists
    const { data: existingResult } = await supabase
      .from('results')
      .select('id')
      .eq('room_id', roomId)
      .maybeSingle()

    return NextResponse.json({
      ready: bothCompleted,
      resultExists: !!existingResult,
      progress: {
        host: {
          completed: hostCompleted,
          count: hostResponseCount,
          percentage: Math.round((hostResponseCount / expectedCount) * 100),
        },
        guest: {
          completed: guestCompleted,
          count: guestResponseCount,
          percentage: Math.round((guestResponseCount / expectedCount) * 100),
        },
        total: expectedCount,
      },
      room: {
        status: room.status,
        hostId: room.host_id,
        guestId: room.guest_id,
      },
    })
  } catch (error) {
    console.error('Error checking readiness:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
