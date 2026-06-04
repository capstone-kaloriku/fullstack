export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
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
      chat_history: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          image_url: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      consumption_logs: {
        Row: {
          consumed_portion: number | null
          food_id: string | null
          log_id: string
          logged_at: string | null
          meal_type: Database["public"]["Enums"]["meal_category"] | null
          raw_input_text: string | null
          total_calories: number | null
          user_id: string | null
        }
        Insert: {
          consumed_portion?: number | null
          food_id?: string | null
          log_id?: string
          logged_at?: string | null
          meal_type?: Database["public"]["Enums"]["meal_category"] | null
          raw_input_text?: string | null
          total_calories?: number | null
          user_id?: string | null
        }
        Update: {
          consumed_portion?: number | null
          food_id?: string | null
          log_id?: string
          logged_at?: string | null
          meal_type?: Database["public"]["Enums"]["meal_category"] | null
          raw_input_text?: string | null
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
      conversations: {
        Row: {
          created_at: string
          id: string
          message_count: number
          preview: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          preview?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          preview?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_components: {
        Row: {
          calories: number | null
          carbs_gram: number | null
          component_id: string
          component_type: Database["public"]["Enums"]["component_type"]
          created_at: string | null
          fat_gram: number | null
          food_id: string
          name: string
          portion_gram: number | null
          protein_gram: number | null
        }
        Insert: {
          calories?: number | null
          carbs_gram?: number | null
          component_id?: string
          component_type?: Database["public"]["Enums"]["component_type"]
          created_at?: string | null
          fat_gram?: number | null
          food_id: string
          name: string
          portion_gram?: number | null
          protein_gram?: number | null
        }
        Update: {
          calories?: number | null
          carbs_gram?: number | null
          component_id?: string
          component_type?: Database["public"]["Enums"]["component_type"]
          created_at?: string | null
          fat_gram?: number | null
          food_id?: string
          name?: string
          portion_gram?: number | null
          protein_gram?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_components_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["food_id"]
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
            isOneToOne: true
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
      component_type: "utama" | "lauk" | "pelengkap"
      meal_category: "makanan_berat" | "makanan_ringan" | "minuman" | "camilan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      component_type: ["utama", "lauk", "pelengkap"],
      meal_category: ["makanan_berat", "makanan_ringan", "minuman", "camilan"],
    },
  },
} as const
