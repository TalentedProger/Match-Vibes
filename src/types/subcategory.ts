export interface Subcategory {
  id: string
  category_id: string
  name: string
  description?: string | null
  icon?: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}
