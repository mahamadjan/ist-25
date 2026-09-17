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
      schedule: {
        Row: {
          id: string
          group_name: string
          day_of_week: number
          lesson_date: string | null
          lesson_number: number
          start_time: string
          end_time: string
          subject: string
          teacher: string
          room: string
          lesson_type: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_name?: string
          day_of_week: number
          lesson_date?: string | null
          lesson_number: number
          start_time: string
          end_time: string
          subject: string
          teacher: string
          room: string
          lesson_type: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_name?: string
          day_of_week?: number
          lesson_date?: string | null
          lesson_number?: number
          start_time?: string
          end_time?: string
          subject?: string
          teacher?: string
          room?: string
          lesson_type?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
