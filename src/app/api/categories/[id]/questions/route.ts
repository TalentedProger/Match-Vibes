import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/categories/[id]/questions
 * Retrieves questions for a specific category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Fetch questions for the category
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

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
