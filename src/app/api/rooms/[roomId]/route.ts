import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/rooms/[roomId] - Get room by ID
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const params = await props.params
    const { roomId } = params

    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: room, error } = await (supabase as any)
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !room) {
      return NextResponse.json(
        { message: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ room }, { status: 200 })
  } catch (error) {
    console.error('Room fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/rooms/[roomId] - Update room status
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ roomId: string }> }
) {
  try {
    const params = await props.params
    const { roomId } = params
    const { status } = await request.json()

    if (!roomId || !status) {
      return NextResponse.json(
        { message: 'Room ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const updates: any = { status }

    // Set timestamps based on status
    if (status === 'playing' && !updates.started_at) {
      updates.started_at = new Date().toISOString()
    } else if (status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString()
    }

    const { data: room, error } = await (supabase as any)
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { message: 'Failed to update room', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ room }, { status: 200 })
  } catch (error) {
    console.error('Room update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
