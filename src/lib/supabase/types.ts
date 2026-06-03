export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_id: string
          alert_type: string | null
          is_read: boolean | null
          message: string | null
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_id?: string
          alert_type?: string | null
          is_read?: boolean | null
          message?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_id?: string
          alert_type?: string | null
          is_read?: boolean | null
          message?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consumption_logs: {
        Row: {
          consumed_portion: number | null
          food_id: string | null
          log_id: string
          logged_at: string | null
          meal_type: string | null
          raw_input_text: string | null
          side_dishes: Json | null
          total_calories: number | null
          user_id: string | null
        }
        Insert: {
          consumed_portion?: number | null
          food_id?: string | null
          log_id?: string
          logged_at?: string | null
          meal_type?: string | null
          raw_input_text?: string | null
          side_dishes?: Json | null
          total_calories?: number | null
          user_id?: string | null
        }
        Update: {
          consumed_portion?: number | null
          food_id?: string | null
          log_id?: string
          logged_at?: string | null
          meal_type?: string | null
          raw_input_text?: string | null
          side_dishes?: Json | null
          total_calories?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumption_logs_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["food_id"]
          },
          {
            foreignKeyName: "consumption_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      food_items: {
        Row: {
          base_portion_gram: number | null
          calories: number | null
          carbs_gram: number | null
          category: string | null
          fat_gram: number | null
          food_id: string
          image_url: string | null
          is_verified: boolean | null
          name: string
          portion: number | null
          protein_gram: number | null
          slug: string | null
        }
        Insert: {
          base_portion_gram?: number | null
          calories?: number | null
          carbs_gram?: number | null
          category?: string | null
          fat_gram?: number | null
          food_id?: string
          image_url?: string | null
          is_verified?: boolean | null
          name: string
          portion?: number | null
          protein_gram?: number | null
          slug?: string | null
        }
        Update: {
          base_portion_gram?: number | null
          calories?: number | null
          carbs_gram?: number | null
          category?: string | null
          fat_gram?: number | null
          food_id?: string
          image_url?: string | null
          is_verified?: boolean | null
          name?: string
          portion?: number | null
          protein_gram?: number | null
          slug?: string | null
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          activity_level: string | null
          bmr: number | null
          date_of_birth: string | null
          goal_type: string | null
          height_cm: number | null
          profile_id: string
          recorded_at: string | null
          target_calories: number | null
          tdee: number | null
          user_id: string | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          bmr?: number | null
          date_of_birth?: string | null
          goal_type?: string | null
          height_cm?: number | null
          profile_id?: string
          recorded_at?: string | null
          target_calories?: number | null
          tdee?: number | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          bmr?: number | null
          date_of_birth?: string | null
          goal_type?: string | null
          height_cm?: number | null
          profile_id?: string
          recorded_at?: string | null
          target_calories?: number | null
          tdee?: number | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      recommendations: {
        Row: {
          acceptance_status: string | null
          food_id: string | null
          generated_at: string | null
          reason: string | null
          rec_id: string
          user_id: string | null
        }
        Insert: {
          acceptance_status?: string | null
          food_id?: string | null
          generated_at?: string | null
          reason?: string | null
          rec_id?: string
          user_id?: string | null
        }
        Update: {
          acceptance_status?: string | null
          food_id?: string | null
          generated_at?: string | null
          reason?: string | null
          rec_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["food_id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          gender: string | null
          is_active: boolean | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          gender?: string | null
          is_active?: boolean | null
          name?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          gender?: string | null
          is_active?: boolean | null
          name?: string | null
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
