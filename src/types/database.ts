// Supabase Database Types
// This file will be generated after database schema is created

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          premium_status: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          premium_status?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          premium_status?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          image_url: string | null
          color: string | null
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          color?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          image_url?: string | null
          color?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          category_id: string
          text: string
          image_url: string
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          text: string
          image_url: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          text?: string
          image_url?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
