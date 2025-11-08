export interface Room {
  id: string
  host_id: string
  guest_id: string | null
  category_id: string
  status: 'waiting' | 'ready' | 'playing' | 'completed' | 'cancelled'
  invitation_code: string
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export interface RoomState {
  room: Room | null
  isHost: boolean
  isReady: boolean
  currentStep: number
  totalSteps: number
}
