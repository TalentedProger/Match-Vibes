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

    // Build query based on whether subcategoryId is provided
    let query

    if (subcategoryId) {
      // Filter by specific subcategory
      query = supabase
        .from('questions')
        .select('id, text, image_url, order_index, subcategory_id')
        .eq('subcategory_id', subcategoryId)
        .eq('is_active', true)
    } else {
      // Get all questions from all subcategories of this category
      const { data: subcategories } = await supabase
        .from('subcategories')
        .select('id')
        .eq('category_id', categoryId)

      const subcategoryIds = subcategories?.map(s => s.id) || []

      query = supabase
        .from('questions')
        .select('id, text, image_url, order_index, subcategory_id')
        .in('subcategory_id', subcategoryIds)
        .eq('is_active', true)
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

    // Return questions even if empty array (let frontend handle it)
    return NextResponse.json({
      questions: questions || [],
      count: questions?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
