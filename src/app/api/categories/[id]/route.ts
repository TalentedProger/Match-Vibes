import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Cache category for 5 minutes
export const revalidate = 300

/**
 * GET /api/categories/[id]
 * Retrieves a single category by ID
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

    // Fetch category
    const { data: category, error } = await supabase
      .from('categories')
      .select('id, name, description, icon, color, order_index')
      .eq('id', categoryId)
      .eq('is_active', true)
      .single()

    if (error || !category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
