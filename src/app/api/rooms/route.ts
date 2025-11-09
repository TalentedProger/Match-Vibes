import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const { categoryId, userId, subcategoryId } = await request.json()

    if (!categoryId || !userId) {
      return NextResponse.json(
        { message: 'Category ID and User ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generate unique invitation code
    const invitationCode = nanoid(10)

    // Create room with optional subcategory
    const roomData: any = {
      host_id: userId,
      category_id: categoryId,
      status: 'waiting',
      invitation_code: invitationCode,
    }

    if (subcategoryId) {
      roomData.subcategory_id = subcategoryId
    }

    // Create room
    const { data: room, error } = await (supabase as any)
      .from('rooms')
      .insert(roomData)
      .select()
      .single()

    if (error) {
      console.error('Failed to create room:', error)
      return NextResponse.json(
        { message: 'Failed to create room', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ room }, { status: 201 })
  } catch (error) {
    console.error('Room creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
