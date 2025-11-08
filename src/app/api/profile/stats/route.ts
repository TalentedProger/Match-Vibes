import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Count total games played (as host or guest)
    const { count: gamesPlayed, error: gamesError } = await (supabase as any)
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')

    if (gamesError) {
      console.error('Error counting games:', gamesError)
    }

    // Count total matches
    const { count: matches, error: matchesError } = await (supabase as any)
      .from('results')
      .select('*', { count: 'exact', head: true })
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)

    if (matchesError) {
      console.error('Error counting matches:', matchesError)
    }

    // Count unique friends (unique partner IDs)
    const { data: roomsData, error: roomsError } = await (supabase as any)
      .from('rooms')
      .select('host_id, guest_id')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')

    let friends = 0
    if (!roomsError && roomsData) {
      const partnerIds = new Set<string>()
      roomsData.forEach((room: any) => {
        const partnerId =
          room.host_id === userId ? room.guest_id : room.host_id
        if (partnerId) {
          partnerIds.add(partnerId)
        }
      })
      friends = partnerIds.size
    }

    // Get achievements count
    const { count: achievementsCount, error: achievementsError } =
      await (supabase as any)
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (achievementsError) {
      console.error('Error counting achievements:', achievementsError)
    }

    // Calculate average compatibility
    const { data: resultsData, error: resultsAvgError } = await (supabase as any)
      .from('results')
      .select('match_percentage')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)

    let avgCompatibility = 0
    if (!resultsAvgError && resultsData && resultsData.length > 0) {
      const sum = resultsData.reduce(
        (acc: number, result: any) => acc + Number(result.match_percentage),
        0
      )
      avgCompatibility = Math.round((sum / resultsData.length) * 100) / 100
    }

    return NextResponse.json({
      gamesPlayed: gamesPlayed || 0,
      matches: matches || 0,
      friends: friends,
      achievementsUnlocked: achievementsCount || 0,
      avgCompatibility,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}
