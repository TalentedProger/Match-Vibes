import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Cache subcategories for 5 minutes
export const revalidate = 300

/**
 * GET /api/categories/[id]/subcategories
 * Retrieves subcategories for a specific category
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

    const supabase = await createClient()

    // Fetch subcategories for the category
    const { data: subcategories, error } = await supabase
      .from('subcategories')
      .select('id, name, description, icon, order_index')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching subcategories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subcategories' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      subcategories: subcategories || [],
      count: subcategories?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
