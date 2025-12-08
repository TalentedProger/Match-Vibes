import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  ExtendedStats,
  PartnerStats,
  CategoryStats,
  FunFact,
  GameHistoryItem,
  CompatibilityDistribution,
} from '@/types/stats'

/**
 * GET /api/stats/extended
 * Fetch extended statistics for a user including charts, fun facts, and history
 */
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

    // Fetch all completed rooms for the user
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(
        `
        id,
        host_id,
        guest_id,
        category_id,
        created_at,
        completed_at,
        categories (
          id,
          name,
          icon
        )
      `
      )
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError)
    }

    // Fetch all results for the user
    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select('*')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (resultsError) {
      console.error('Error fetching results:', resultsError)
    }

    // Fetch all responses for the user
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('user_id', userId)

    if (responsesError) {
      console.error('Error fetching responses:', responsesError)
    }

    // Fetch achievements
    const { count: achievementsCount } = await supabase
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Calculate basic stats
    const gamesPlayed = rooms?.length || 0
    const matches = results?.length || 0

    // Calculate unique friends
    const partnerIds = new Set<string>()
    rooms?.forEach((room: any) => {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      if (partnerId) partnerIds.add(partnerId)
    })
    const friends = partnerIds.size

    // Calculate likes/dislikes
    const totalLikes = responses?.filter((r: any) => r.answer === 1).length || 0
    const totalDislikes =
      responses?.filter((r: any) => r.answer === 0).length || 0
    const likeRatio = responses?.length
      ? Math.round((totalLikes / responses.length) * 100)
      : 0

    // Calculate average compatibility
    let avgCompatibility = 0
    let bestMatchPercentage = 0
    let worstMatchPercentage = 100

    if (results && results.length > 0) {
      const sum = results.reduce(
        (acc: number, r: any) => acc + Number(r.match_percentage),
        0
      )
      avgCompatibility = Math.round(sum / results.length)
      bestMatchPercentage = Math.max(
        ...results.map((r: any) => Number(r.match_percentage))
      )
      worstMatchPercentage = Math.min(
        ...results.map((r: any) => Number(r.match_percentage))
      )
    }

    // Calculate time-based stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const gamesThisWeek =
      rooms?.filter((r: any) => new Date(r.completed_at) >= weekAgo).length || 0

    const gamesThisMonth =
      rooms?.filter((r: any) => new Date(r.completed_at) >= monthAgo).length ||
      0

    // Calculate streaks (simplified - consecutive days with games)
    const gameDates =
      rooms?.map((r: any) => new Date(r.completed_at).toDateString()) || []
    const uniqueDates = [...new Set(gameDates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i])
      const nextDate =
        i < uniqueDates.length - 1 ? new Date(uniqueDates[i + 1]) : null

      if (nextDate) {
        const diffDays = Math.floor(
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 1) {
          tempStreak++
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Current streak (from today backwards)
    const today = new Date().toDateString()
    if (uniqueDates[0] === today) {
      currentStreak = 1
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = Math.floor(
          (new Date(uniqueDates[i - 1]).getTime() -
            new Date(uniqueDates[i]).getTime()) /
            (1000 * 60 * 60 * 24)
        )
        if (diff === 1) currentStreak++
        else break
      }
    }

    // Category statistics
    const categoryMap = new Map<string, any>()
    rooms?.forEach((room: any) => {
      const catId = room.category_id
      const cat = room.categories as any
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          categoryId: catId,
          categoryName: cat?.name || 'Unknown',
          categoryIcon: cat?.icon || '❓',
          gamesPlayed: 0,
          totalCompatibility: 0,
        })
      }
      const stats = categoryMap.get(catId)
      stats.gamesPlayed++

      const result = results?.find((r: any) => r.room_id === room.id)
      if (result) {
        stats.totalCompatibility += Number(result.match_percentage)
      }
    })

    const categoryStats: CategoryStats[] = Array.from(categoryMap.values())
      .map(cat => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        categoryIcon: cat.categoryIcon,
        gamesPlayed: cat.gamesPlayed,
        avgCompatibility:
          cat.gamesPlayed > 0
            ? Math.round(cat.totalCompatibility / cat.gamesPlayed)
            : 0,
        totalLikes: 0, // Would need question-level data
        totalDislikes: 0,
      }))
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed)

    // Partner statistics
    const partnerMap = new Map<string, any>()
    for (const room of rooms || []) {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      if (!partnerId) continue

      if (!partnerMap.has(partnerId)) {
        // Fetch partner profile
        const { data: partnerProfile } = await supabase
          .from('profiles')
          .select('id, username, first_name, avatar_url')
          .eq('id', partnerId)
          .single()

        partnerMap.set(partnerId, {
          id: partnerId,
          username: partnerProfile?.username || null,
          firstName: partnerProfile?.first_name || null,
          avatarUrl: partnerProfile?.avatar_url || null,
          gamesPlayed: 0,
          totalCompatibility: 0,
          lastPlayedAt: room.completed_at,
        })
      }

      const stats = partnerMap.get(partnerId)
      stats.gamesPlayed++

      const result = results?.find((r: any) => r.room_id === room.id)
      if (result) {
        stats.totalCompatibility += Number(result.match_percentage)
      }

      if (new Date(room.completed_at) > new Date(stats.lastPlayedAt)) {
        stats.lastPlayedAt = room.completed_at
      }
    }

    const topPartners: PartnerStats[] = Array.from(partnerMap.values())
      .map(p => ({
        id: p.id,
        username: p.username,
        firstName: p.firstName,
        avatarUrl: p.avatarUrl,
        gamesPlayed: p.gamesPlayed,
        avgCompatibility:
          p.gamesPlayed > 0
            ? Math.round(p.totalCompatibility / p.gamesPlayed)
            : 0,
        lastPlayedAt: p.lastPlayedAt,
      }))
      .sort((a, b) => b.avgCompatibility - a.avgCompatibility)
      .slice(0, 5)

    // Best match partner
    const bestMatchPartner = topPartners.length > 0 ? topPartners[0] : null

    // Compatibility distribution
    const distribution: CompatibilityDistribution[] = [
      { range: '0-20%', count: 0, percentage: 0 },
      { range: '21-40%', count: 0, percentage: 0 },
      { range: '41-60%', count: 0, percentage: 0 },
      { range: '61-80%', count: 0, percentage: 0 },
      { range: '81-100%', count: 0, percentage: 0 },
    ]

    results?.forEach((r: any) => {
      const pct = Number(r.match_percentage)
      if (pct <= 20) distribution[0].count++
      else if (pct <= 40) distribution[1].count++
      else if (pct <= 60) distribution[2].count++
      else if (pct <= 80) distribution[3].count++
      else distribution[4].count++
    })

    const totalResults = results?.length || 1
    distribution.forEach(d => {
      d.percentage = Math.round((d.count / totalResults) * 100)
    })

    // Generate fun facts
    const funFacts: FunFact[] = generateFunFacts({
      gamesPlayed,
      avgCompatibility,
      likeRatio,
      bestMatchPercentage,
      topPartners,
      categoryStats,
      currentStreak,
      longestStreak,
    })

    // Recent games (last 10)
    const recentGames: GameHistoryItem[] = []
    for (const room of (rooms || []).slice(0, 10)) {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      const partner = partnerMap.get(partnerId)
      const result = results?.find((r: any) => r.room_id === room.id)
      const cat = room.categories as any

      if (result) {
        recentGames.push({
          id: result.id,
          roomId: room.id,
          partnerId: partnerId || '',
          partnerUsername: partner?.username || null,
          partnerFirstName: partner?.firstName || null,
          partnerAvatarUrl: partner?.avatarUrl || null,
          categoryId: room.category_id,
          categoryName: cat?.name || 'Unknown',
          categoryIcon: cat?.icon || '❓',
          matchPercentage: Number(result.match_percentage),
          hostFavorite: result.host_favorite || '',
          guestFavorite: result.guest_favorite || '',
          sharedItem: result.shared_item,
          playedAt: room.completed_at,
          wasHost: room.host_id === userId,
        })
      }
    }

    const extendedStats: ExtendedStats = {
      // Basic
      gamesPlayed,
      matches,
      friends,
      achievementsUnlocked: achievementsCount || 0,
      avgCompatibility,

      // Extended
      totalLikes,
      totalDislikes,
      likeRatio,

      // Time-based
      gamesThisWeek,
      gamesThisMonth,
      longestStreak,
      currentStreak,

      // Best/worst
      bestMatchPercentage,
      worstMatchPercentage: gamesPlayed > 0 ? worstMatchPercentage : 0,
      bestMatchPartner,

      // Breakdowns
      categoryStats,
      topPartners,
      compatibilityDistribution: distribution,

      // Fun facts
      funFacts,

      // Recent
      recentGames,
    }

    return NextResponse.json(extendedStats)
  } catch (error) {
    console.error('Error fetching extended stats:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Generate fun facts based on user statistics
 */
function generateFunFacts(data: {
  gamesPlayed: number
  avgCompatibility: number
  likeRatio: number
  bestMatchPercentage: number
  topPartners: PartnerStats[]
  categoryStats: CategoryStats[]
  currentStreak: number
  longestStreak: number
}): FunFact[] {
  const facts: FunFact[] = []
  let factId = 1

  // Like ratio fact
  if (data.gamesPlayed > 0) {
    if (data.likeRatio >= 70) {
      facts.push({
        id: String(factId++),
        type: 'preference',
        icon: '💖',
        title: 'Позитивный настрой!',
        description: `Вы лайкаете ${data.likeRatio}% карточек. Вы настоящий оптимист!`,
        value: data.likeRatio,
      })
    } else if (data.likeRatio <= 30) {
      facts.push({
        id: String(factId++),
        type: 'preference',
        icon: '🤔',
        title: 'Разборчивый вкус',
        description: `Вы лайкаете только ${data.likeRatio}% карточек. У вас очень избирательный вкус!`,
        value: data.likeRatio,
      })
    }
  }

  // Compatibility fact
  if (data.avgCompatibility >= 70) {
    facts.push({
      id: String(factId++),
      type: 'compatibility',
      icon: '🌟',
      title: 'Душа компании!',
      description: `Средняя совместимость ${data.avgCompatibility}%. Вы отлично находите общий язык!`,
      value: data.avgCompatibility,
    })
  } else if (data.avgCompatibility >= 50 && data.avgCompatibility < 70) {
    facts.push({
      id: String(factId++),
      type: 'compatibility',
      icon: '🎯',
      title: 'Золотая середина',
      description: `Средняя совместимость ${data.avgCompatibility}%. Хороший баланс!`,
      value: data.avgCompatibility,
    })
  }

  // Best match fact
  if (data.bestMatchPercentage >= 90) {
    facts.push({
      id: String(factId++),
      type: 'compatibility',
      icon: '🎉',
      title: 'Идеальное совпадение!',
      description: `Ваш лучший результат — ${data.bestMatchPercentage}%! Это почти телепатия!`,
      value: data.bestMatchPercentage,
    })
  }

  // Best partner fact
  if (
    data.topPartners.length > 0 &&
    data.topPartners[0].avgCompatibility >= 60
  ) {
    const partner = data.topPartners[0]
    const name = partner.firstName || partner.username || 'партнёр'
    facts.push({
      id: String(factId++),
      type: 'compatibility',
      icon: '👥',
      title: 'Лучший дуэт',
      description: `С ${name} у вас совместимость ${partner.avgCompatibility}%!`,
      value: partner.avgCompatibility,
    })
  }

  // Favorite category fact
  if (data.categoryStats.length > 0) {
    const topCategory = data.categoryStats[0]
    if (topCategory.gamesPlayed >= 3) {
      facts.push({
        id: String(factId++),
        type: 'category',
        icon: topCategory.categoryIcon,
        title: 'Любимая тема',
        description: `Вы играли в "${topCategory.categoryName}" ${topCategory.gamesPlayed} раз!`,
        category: topCategory.categoryName,
        value: topCategory.gamesPlayed,
      })
    }
  }

  // Streak facts
  if (data.currentStreak >= 3) {
    facts.push({
      id: String(factId++),
      type: 'streak',
      icon: '🔥',
      title: 'В ударе!',
      description: `Вы играете ${data.currentStreak} дней подряд!`,
      value: data.currentStreak,
    })
  }

  if (data.longestStreak >= 5) {
    facts.push({
      id: String(factId++),
      type: 'streak',
      icon: '⚡',
      title: 'Рекордная серия',
      description: `Ваш рекорд — ${data.longestStreak} дней подряд!`,
      value: data.longestStreak,
    })
  }

  // Activity facts
  if (data.gamesPlayed >= 50) {
    facts.push({
      id: String(factId++),
      type: 'activity',
      icon: '🏆',
      title: 'Ветеран игры',
      description: `Вы сыграли ${data.gamesPlayed} игр! Впечатляет!`,
      value: data.gamesPlayed,
    })
  } else if (data.gamesPlayed >= 10) {
    facts.push({
      id: String(factId++),
      type: 'activity',
      icon: '🎮',
      title: 'Активный игрок',
      description: `Уже ${data.gamesPlayed} игр за плечами!`,
      value: data.gamesPlayed,
    })
  }

  return facts.slice(0, 5) // Return max 5 facts
}
