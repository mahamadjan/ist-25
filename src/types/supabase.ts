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
      attendance: {
        Row: {
          id: string
          lesson_id: string
          student_id: string
          date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          student_id: string
          date?: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          student_id?: string
          date?: string
          status?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          role: string
        }
        Insert: {
          id: string
          full_name: string
          role?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: string
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
