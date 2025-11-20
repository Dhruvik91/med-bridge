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
      users: {
        Row: {
          id: string
          email: string
          role: 'doctor' | 'hospital' | 'admin'
          name: string | null
          created_at: string
          profile_id: string | null
          is_verified: boolean
        }
        Insert: {
          id?: string
          email: string
          role: 'doctor' | 'hospital' | 'admin'
          name?: string | null
          created_at?: string
          profile_id?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          role?: 'doctor' | 'hospital' | 'admin'
          name?: string | null
          created_at?: string
          profile_id?: string | null
          is_verified?: boolean
        }
      }
      doctor_profiles: {
        Row: {
          id: string
          user_id: string
          specialties: string[]
          license_numbers: string[]
          bio: string | null
          cv_url: string | null
          locations: string[]
          verified: boolean
          rating: number | null
          experience_years: number | null
          availability: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialties?: string[]
          license_numbers?: string[]
          bio?: string | null
          cv_url?: string | null
          locations?: string[]
          verified?: boolean
          rating?: number | null
          experience_years?: number | null
          availability?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialties?: string[]
          license_numbers?: string[]
          bio?: string | null
          cv_url?: string | null
          locations?: string[]
          verified?: boolean
          rating?: number | null
          experience_years?: number | null
          availability?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hospital_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          contact_email: string | null
          logo_url: string | null
          verified: boolean
          description: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          contact_email?: string | null
          logo_url?: string | null
          verified?: boolean
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string | null
          contact_email?: string | null
          logo_url?: string | null
          verified?: boolean
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          hospital_id: string
          title: string
          description: string
          requirements: string[]
          salary_min: number | null
          salary_max: number | null
          location: string
          remote: boolean
          shift: string | null
          department: string | null
          contract_type: string | null
          status: 'active' | 'closed' | 'draft'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hospital_id: string
          title: string
          description: string
          requirements?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location: string
          remote?: boolean
          shift?: string | null
          department?: string | null
          contract_type?: string | null
          status?: 'active' | 'closed' | 'draft'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hospital_id?: string
          title?: string
          description?: string
          requirements?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location?: string
          remote?: boolean
          shift?: string | null
          department?: string | null
          contract_type?: string | null
          status?: 'active' | 'closed' | 'draft'
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          doctor_id: string
          cover_letter: string | null
          status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          doctor_id: string
          cover_letter?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          doctor_id?: string
          cover_letter?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
          applied_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          thread_id: string | null
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          thread_id?: string | null
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          thread_id?: string | null
          created_at?: string
          read_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          payload: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          payload: Json
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          payload?: Json
          read?: boolean
          created_at?: string
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
  }
}
