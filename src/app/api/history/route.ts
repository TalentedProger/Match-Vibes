import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { GameHistoryItem } from '@/types/stats'

/**
 * GET /api/history
 * Fetch game history for a user with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch completed rooms with results
    const {
      data: rooms,
      error: roomsError,
      count,
    } = await supabase
      .from('rooms')
      .select(
        `
        id,
        host_id,
        guest_id,
        category_id,
        completed_at,
        categories (
          id,
          name,
          icon
        ),
        results (
          id,
          match_percentage,
          host_favorite,
          guest_favorite,
          shared_item
        )
      `,
        { count: 'exact' }
      )
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (roomsError) {
      console.error('Error fetching history:', roomsError)
      return NextResponse.json(
        { message: 'Failed to fetch history', error: roomsError.message },
        { status: 500 }
      )
    }

    // Collect partner IDs
    const partnerIds = new Set<string>()
    rooms?.forEach((room: any) => {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      if (partnerId) partnerIds.add(partnerId)
    })

    // Fetch partner profiles
    const { data: partners } = await supabase
      .from('profiles')
      .select('id, username, first_name, avatar_url')
      .in('id', Array.from(partnerIds))

    const partnerMap = new Map(partners?.map(p => [p.id, p]) || [])

    // Transform to GameHistoryItem
    const history: GameHistoryItem[] = (rooms || []).map((room: any) => {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      const partner = partnerMap.get(partnerId)
      const result = room.results?.[0]
      const cat = room.categories

      return {
        id: result?.id || room.id,
        roomId: room.id,
        partnerId: partnerId || '',
        partnerUsername: partner?.username || null,
        partnerFirstName: partner?.first_name || null,
        partnerAvatarUrl: partner?.avatar_url || null,
        categoryId: room.category_id,
        categoryName: cat?.name || 'Unknown',
        categoryIcon: cat?.icon || '❓',
        matchPercentage: result?.match_percentage || 0,
        hostFavorite: result?.host_favorite || '',
        guestFavorite: result?.guest_favorite || '',
        sharedItem: result?.shared_item || null,
        playedAt: room.completed_at,
        wasHost: room.host_id === userId,
      }
    })

    return NextResponse.json({
      history,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    })
  } catch (error) {
    console.error('Error in history API:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
