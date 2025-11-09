import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Cache questions for 5 minutes to improve performance
export const revalidate = 300

/**
 * GET /api/categories/[id]/questions
 * Retrieves questions for a specific category or subcategory
 * Query params: subcategoryId (optional)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id
    const { searchParams } = new URL(request.url)
    const subcategoryId = searchParams.get('subcategoryId')

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('questions')
      .select('id, text, image_url, order_index, subcategory_id')
      .eq('is_active', true)

    // Filter by subcategory if provided, otherwise by category
    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId)
    } else {
      query = query.eq('category_id', categoryId)
    }

    // Fetch questions
    const { data: questions, error } = await query.order('order_index', {
      ascending: true,
    })

    if (error) {
      console.error('Error fetching questions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      )
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for this category' },
        { status: 404 }
      )
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
