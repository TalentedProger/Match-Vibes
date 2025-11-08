export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  color: string
  order: number
  is_active: boolean
  created_at: string
}

export interface Question {
  id: string
  category_id: string
  text: string
  image_url: string
  order: number
  is_active: boolean
  created_at: string
}
