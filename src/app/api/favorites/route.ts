import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type {
  Favorite,
  FavoritesByCategory,
  FavoritesResponse,
} from '@/types/favorites'

// GET - получить избранное пользователя
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const categoryId = searchParams.get('categoryId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Use raw query since favorites table might not be in types
    let query = supabase
      .from('favorites' as any)
      .select(
        `
        id,
        user_id,
        item_name,
        category_id,
        image_url,
        added_at,
        categories (
          name,
          icon
        )
      `
      )
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching favorites:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data
    const favorites: Favorite[] = (data || []).map((item: any) => ({
      id: item.id as string,
      userId: item.user_id as string,
      itemName: item.item_name as string,
      categoryId: item.category_id as string,
      imageUrl: item.image_url as string | null,
      categoryName: item.categories?.name || 'Без категории',
      categoryIcon: item.categories?.icon || '📁',
      addedAt: item.added_at as string,
    }))

    // Group by category
    const categoryMap = new Map<string, FavoritesByCategory>()

    for (const fav of favorites) {
      if (!categoryMap.has(fav.categoryId)) {
        categoryMap.set(fav.categoryId, {
          categoryId: fav.categoryId,
          categoryName: fav.categoryName || 'Без категории',
          categoryIcon: fav.categoryIcon || '📁',
          items: [],
        })
      }
      categoryMap.get(fav.categoryId)!.items.push(fav)
    }

    const response: FavoritesResponse = {
      favorites,
      totalCount: favorites.length,
      byCategory: Array.from(categoryMap.values()),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Favorites GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - добавить в избранное
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { userId, itemName, categoryId, imageUrl } = body

    if (!userId || !itemName || !categoryId) {
      return NextResponse.json(
        { error: 'userId, itemName and categoryId are required' },
        { status: 400 }
      )
    }

    // Проверяем, нет ли уже такого элемента в избранном
    const { data: existing } = await supabase
      .from('favorites' as any)
      .select('id')
      .eq('user_id', userId)
      .eq('item_name', itemName)
      .eq('category_id', categoryId)
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'Already in favorites', favorite: existing },
        { status: 200 }
      )
    }

    const { data, error } = await supabase
      .from('favorites' as any)
      .insert({
        user_id: userId,
        item_name: itemName,
        category_id: categoryId,
        image_url: imageUrl || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, favorite: data })
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - удалить из избранного
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const favoriteId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!favoriteId || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('favorites' as any)
      .delete()
      .eq('id', favoriteId)
      .eq('user_id', userId) // Защита: пользователь может удалить только свои избранные

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Favorites DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
