export interface Response {
  id: string
  room_id: string
  user_id: string
  question_id: string
  answer: 0 | 1 // 0 = dislike, 1 = like
  timestamp: string
}

export interface GameResult {
  id: string
  room_id: string
  host_id: string
  guest_id: string
  category_id: string
  match_percentage: number
  host_favorite: string
  guest_favorite: string
  shared_item: string
  created_at: string
}

export interface GameState {
  room_id: string
  current_question: number
  total_questions: number
  responses: Response[]
  is_complete: boolean
}

export interface Favorite {
  id: string
  user_id: string
  item_name: string
  category_id: string
  image_url: string | null
  added_at: string
}
