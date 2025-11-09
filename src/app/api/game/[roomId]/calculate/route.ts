import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  calculateMatch,
  validateResponses,
} from '@/lib/algorithms/match-calculator'
import type { Response, Question } from '@/types/game'

/**
 * POST /api/game/[roomId]/calculate
 * Calculate match results for a completed game room
 */
export async function POST(
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

    // Create Supabase client
    const supabase = await createClient()

    // 1. Fetch room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if room is in correct state
    if (room.status === 'completed') {
      // Already calculated, fetch existing result
      const { data: existingResult } = await supabase
        .from('results')
        .select('*')
        .eq('room_id', roomId)
        .single()

      if (existingResult) {
        return NextResponse.json({
          message: 'Result already calculated',
          result: existingResult,
          cached: true,
        })
      }
    }

    if (room.status !== 'playing' && room.status !== 'completed') {
      return NextResponse.json(
        { error: `Room is not ready for calculation (status: ${room.status})` },
        { status: 400 }
      )
    }

    // Validate both players exist
    if (!room.host_id || !room.guest_id) {
      return NextResponse.json(
        { error: 'Both players must be present' },
        { status: 400 }
      )
    }

    // 2. Fetch all questions for this category/subcategory
    let questionsQuery = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)

    // Filter by subcategory if present, otherwise by category
    if (room.subcategory_id) {
      questionsQuery = questionsQuery.eq('subcategory_id', room.subcategory_id)
    } else {
      questionsQuery = questionsQuery.eq('category_id', room.category_id)
    }

    const { data: questions, error: questionsError } =
      await questionsQuery.order('order_index', { ascending: true })

    if (questionsError || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions not found for this category' },
        { status: 404 }
      )
    }

    // 3. Fetch responses from both players
    const { data: allResponses, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('room_id', roomId)

    if (responsesError) {
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      )
    }

    // Separate responses by player
    const hostResponses = (allResponses || []).filter(
      r => r.user_id === room.host_id
    )
    const guestResponses = (allResponses || []).filter(
      r => r.user_id === room.guest_id
    )

    // 4. Validate responses
    const validation = validateResponses(
      hostResponses,
      guestResponses,
      questions.length
    )

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Incomplete responses',
          details: validation.error,
          hostCount: hostResponses.length,
          guestCount: guestResponses.length,
          expectedCount: questions.length,
        },
        { status: 400 }
      )
    }

    // 5. Calculate match
    const matchResult = calculateMatch({
      hostResponses,
      guestResponses,
      questions: questions as Question[],
    })

    // 6. Store result in database
    const { data: savedResult, error: saveError } = await supabase
      .from('results')
      .insert({
        room_id: roomId,
        host_id: room.host_id,
        guest_id: room.guest_id,
        category_id: room.category_id,
        match_percentage: matchResult.matchPercentage,
        host_favorite: matchResult.hostFavorite,
        guest_favorite: matchResult.guestFavorite,
        shared_item: matchResult.sharedItem,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save result:', saveError)
      return NextResponse.json(
        { error: 'Failed to save result' },
        { status: 500 }
      )
    }

    // 7. Update room status to completed
    const { error: updateError } = await supabase
      .from('rooms')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', roomId)

    if (updateError) {
      console.error('Failed to update room status:', updateError)
      // Don't fail the request, result is already saved
    }

    // 8. Add favorites to user profiles (optional enhancement)
    await addFavoritesToProfiles(
      supabase,
      room.host_id,
      room.guest_id,
      room.category_id,
      matchResult.hostFavorite,
      matchResult.guestFavorite
    )

    // 9. Return result
    return NextResponse.json({
      message: 'Match calculated successfully',
      result: savedResult,
      details: {
        totalQuestions: matchResult.totalQuestions,
        matchedQuestions: matchResult.matchedQuestions,
        hostLikes: matchResult.hostLikes,
        guestLikes: matchResult.guestLikes,
      },
    })
  } catch (error) {
    console.error('Error calculating match:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/game/[roomId]/calculate
 * Fetch existing calculation result
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

    // Fetch result
    const { data: result, error } = await supabase
      .from('results')
      .select('*')
      .eq('room_id', roomId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching result:', error)
      return NextResponse.json(
        { error: 'Failed to fetch result' },
        { status: 500 }
      )
    }

    if (!result) {
      // Result doesn't exist yet - return null instead of 404
      return NextResponse.json({
        result: null,
        message: 'Result not calculated yet',
      })
    }

    return NextResponse.json({
      result,
    })
  } catch (error) {
    console.error('Error fetching result:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper: Add favorite items to user profiles
 */
async function addFavoritesToProfiles(
  supabase: any,
  hostId: string,
  guestId: string,
  categoryId: string,
  hostFavorite: string,
  guestFavorite: string
) {
  try {
    const favorites = [
      {
        user_id: hostId,
        item_name: hostFavorite,
        category_id: categoryId,
      },
      {
        user_id: guestId,
        item_name: guestFavorite,
        category_id: categoryId,
      },
    ]

    // Insert with ON CONFLICT DO NOTHING (won't duplicate)
    await supabase.from('favorites').upsert(favorites, {
      onConflict: 'user_id,item_name,category_id',
      ignoreDuplicates: true,
    })
  } catch (error) {
    console.error('Failed to add favorites:', error)
    // Non-critical, don't throw
  }
}
