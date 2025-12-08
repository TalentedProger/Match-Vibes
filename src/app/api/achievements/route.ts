import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  ACHIEVEMENTS,
  type AchievementWithProgress,
} from '@/types/achievements'

/**
 * GET /api/achievements
 * Fetch user achievements with progress
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

    // Fetch user stats for calculating progress
    const stats = await calculateUserStats(supabase, userId)

    // Map achievements with progress
    const achievementsWithProgress: AchievementWithProgress[] =
      ACHIEVEMENTS.map(achievement => {
        const progress = getProgressForAchievement(achievement.id, stats)
        const isUnlocked = progress >= achievement.requirement
        const progressPercentage = Math.min(
          100,
          Math.round((progress / achievement.requirement) * 100)
        )

        return {
          ...achievement,
          progress,
          isUnlocked,
          unlockedAt: isUnlocked
            ? stats.achievementDates[achievement.id] || null
            : null,
          progressPercentage,
        }
      })

    // Sort: unlocked first (by date), then by progress percentage
    achievementsWithProgress.sort((a, b) => {
      if (a.isUnlocked && !b.isUnlocked) return -1
      if (!a.isUnlocked && b.isUnlocked) return 1
      if (a.isUnlocked && b.isUnlocked) {
        return (
          new Date(b.unlockedAt || 0).getTime() -
          new Date(a.unlockedAt || 0).getTime()
        )
      }
      return b.progressPercentage - a.progressPercentage
    })

    const unlockedCount = achievementsWithProgress.filter(
      a => a.isUnlocked
    ).length
    const totalXP = achievementsWithProgress
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.rewardXP, 0)

    return NextResponse.json({
      achievements: achievementsWithProgress,
      stats: {
        total: ACHIEVEMENTS.length,
        unlocked: unlockedCount,
        totalXP,
        completionPercentage: Math.round(
          (unlockedCount / ACHIEVEMENTS.length) * 100
        ),
      },
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

interface UserStats {
  totalGames: number
  uniquePartners: number
  uniqueCategories: number
  roomsCreated: number
  roomsJoined: number
  highMatchCount: number // 80%+
  perfectMatchCount: number // 100%
  favoritesCount: number
  totalSwipes: number
  currentStreak: number
  maxStreak: number
  gamesWithSamePartnerMax: number
  fastGamesCount: number // games < 2 min
  earlyBirdGames: number // before 8am
  nightOwlGames: number // after midnight
  dailyGamesMax: number
  achievementDates: Record<string, string>
}

async function calculateUserStats(
  supabase: any,
  userId: string
): Promise<UserStats> {
  const stats: UserStats = {
    totalGames: 0,
    uniquePartners: 0,
    uniqueCategories: 0,
    roomsCreated: 0,
    roomsJoined: 0,
    highMatchCount: 0,
    perfectMatchCount: 0,
    favoritesCount: 0,
    totalSwipes: 0,
    currentStreak: 0,
    maxStreak: 0,
    gamesWithSamePartnerMax: 0,
    fastGamesCount: 0,
    earlyBirdGames: 0,
    nightOwlGames: 0,
    dailyGamesMax: 0,
    achievementDates: {},
  }

  // Fetch completed rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select(
      `
      id,
      host_id,
      guest_id,
      category_id,
      created_at,
      completed_at,
      results (
        match_percentage
      )
    `
    )
    .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
    .eq('status', 'completed')
    .order('completed_at', { ascending: true })

  if (rooms && rooms.length > 0) {
    stats.totalGames = rooms.length

    const partners = new Set<string>()
    const categories = new Set<string>()
    const partnerCounts: Record<string, number> = {}
    const dailyGames: Record<string, number> = {}
    const playDates: Date[] = []

    rooms.forEach((room: any) => {
      const partnerId = room.host_id === userId ? room.guest_id : room.host_id
      if (partnerId) {
        partners.add(partnerId)
        partnerCounts[partnerId] = (partnerCounts[partnerId] || 0) + 1
      }

      if (room.category_id) {
        categories.add(room.category_id)
      }

      // Count rooms created vs joined
      if (room.host_id === userId) {
        stats.roomsCreated++
      } else {
        stats.roomsJoined++
      }

      // Match percentage stats
      const matchPct = room.results?.[0]?.match_percentage || 0
      if (matchPct >= 80) stats.highMatchCount++
      if (matchPct === 100) stats.perfectMatchCount++

      // Time-based achievements
      if (room.completed_at) {
        const completedDate = new Date(room.completed_at)
        playDates.push(completedDate)

        const hour = completedDate.getHours()
        if (hour < 8) stats.earlyBirdGames++
        if (hour >= 0 && hour < 5) stats.nightOwlGames++

        // Daily games count
        const dateKey = completedDate.toISOString().split('T')[0]
        dailyGames[dateKey] = (dailyGames[dateKey] || 0) + 1

        // Fast game check (< 2 min)
        if (room.created_at && room.completed_at) {
          const duration =
            completedDate.getTime() - new Date(room.created_at).getTime()
          if (duration < 2 * 60 * 1000) {
            stats.fastGamesCount++
          }
        }
      }
    })

    stats.uniquePartners = partners.size
    stats.uniqueCategories = categories.size
    stats.gamesWithSamePartnerMax = Math.max(...Object.values(partnerCounts), 0)
    stats.dailyGamesMax = Math.max(...Object.values(dailyGames), 0)

    // Calculate streak
    if (playDates.length > 0) {
      const sortedDates = [
        ...new Set(playDates.map(d => d.toISOString().split('T')[0])),
      ].sort()
      let currentStreak = 1
      let maxStreak = 1

      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1])
        const curr = new Date(sortedDates[i])
        const diffDays = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diffDays === 1) {
          currentStreak++
          maxStreak = Math.max(maxStreak, currentStreak)
        } else if (diffDays > 1) {
          currentStreak = 1
        }
      }

      // Check if streak is current (played today or yesterday)
      const lastPlayDate = new Date(sortedDates[sortedDates.length - 1])
      const today = new Date()
      const diffFromToday = Math.round(
        (today.getTime() - lastPlayDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      stats.currentStreak = diffFromToday <= 1 ? currentStreak : 0
      stats.maxStreak = maxStreak
    }
  }

  // Fetch favorites count
  const { count: favCount } = await supabase
    .from('favorites' as any)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  stats.favoritesCount = favCount || 0

  // Fetch total responses (swipes)
  const { count: swipeCount } = await supabase
    .from('responses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  stats.totalSwipes = swipeCount || 0

  // Set achievement unlock dates based on when milestones were reached
  // This is simplified - in production you'd track actual unlock times
  if (stats.totalGames >= 1)
    stats.achievementDates['first_game'] = rooms?.[0]?.completed_at
  if (stats.uniquePartners >= 1)
    stats.achievementDates['first_friend'] = rooms?.[0]?.completed_at
  if (stats.uniqueCategories >= 1)
    stats.achievementDates['first_category'] = rooms?.[0]?.completed_at

  return stats
}

function getProgressForAchievement(
  achievementId: string,
  stats: UserStats
): number {
  switch (achievementId) {
    // Games
    case 'first_game':
    case 'games_5':
    case 'games_10':
    case 'games_25':
    case 'games_50':
    case 'games_100':
      return stats.totalGames
    case 'perfect_match':
      return stats.perfectMatchCount
    case 'high_match_5':
    case 'high_match_20':
      return stats.highMatchCount
    case 'speed_demon':
      return stats.fastGamesCount

    // Social
    case 'first_friend':
    case 'partners_3':
    case 'partners_10':
    case 'partners_25':
      return stats.uniquePartners
    case 'best_friend':
      return stats.gamesWithSamePartnerMax
    case 'invite_master':
    case 'invite_legend':
      return stats.roomsCreated
    case 'joiner':
      return stats.roomsJoined

    // Exploration
    case 'first_category':
    case 'categories_3':
    case 'categories_all':
      return stats.uniqueCategories
    case 'favorites_10':
    case 'favorites_50':
      return stats.favoritesCount
    case 'swipes_500':
      return stats.totalSwipes

    // Streaks
    case 'streak_3':
    case 'streak_7':
    case 'streak_30':
      return stats.maxStreak
    case 'daily_games_3':
      return stats.dailyGamesMax

    // Special
    case 'early_bird':
      return stats.earlyBirdGames
    case 'night_owl':
      return stats.nightOwlGames

    default:
      return 0
  }
}
