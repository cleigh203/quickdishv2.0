export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          recipe_ids: string[] | null
          response: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          recipe_ids?: string[] | null
          response: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          recipe_ids?: string[] | null
          response?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_chat_usage: {
        Row: {
          created_at: string | null
          id: string
          last_reset: string | null
          monthly_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reset?: string | null
          monthly_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reset?: string | null
          monthly_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      generated_recipes: {
        Row: {
          cook_time: string | null
          created_at: string | null
          cuisine: string | null
          description: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: Json
          name: string
          nutrition: Json | null
          prep_time: string | null
          recipe_id: string
          servings: number | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          cook_time?: string | null
          created_at?: string | null
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: Json
          name: string
          nutrition?: Json | null
          prep_time?: string | null
          recipe_id: string
          servings?: number | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          cook_time?: string | null
          created_at?: string | null
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          name?: string
          nutrition?: Json | null
          prep_time?: string | null
          recipe_id?: string
          servings?: number | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          created_at: string
          id: string
          meal_type: string
          recipe_id: string
          scheduled_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_type: string
          recipe_id: string
          scheduled_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_type?: string
          recipe_id?: string
          scheduled_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_generations_today: number | null
          avatar_url: string | null
          created_at: string
          dietary_preferences: string[] | null
          display_name: string | null
          favorite_cuisines: string[] | null
          has_completed_onboarding: boolean | null
          id: string
          is_premium: boolean
          last_generation_date: string | null
          learning_goals: string[] | null
          pantry_items: string[] | null
          skill_level: string | null
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          theme_preference: string | null
        }
        Insert: {
          ai_generations_today?: number | null
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          display_name?: string | null
          favorite_cuisines?: string[] | null
          has_completed_onboarding?: boolean | null
          id: string
          is_premium?: boolean
          last_generation_date?: string | null
          learning_goals?: string[] | null
          pantry_items?: string[] | null
          skill_level?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          theme_preference?: string | null
        }
        Update: {
          ai_generations_today?: number | null
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          display_name?: string | null
          favorite_cuisines?: string[] | null
          has_completed_onboarding?: boolean | null
          id?: string
          is_premium?: boolean
          last_generation_date?: string | null
          learning_goals?: string[] | null
          pantry_items?: string[] | null
          skill_level?: string | null
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          theme_preference?: string | null
        }
        Relationships: []
      }
      recipe_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          ai_generated: boolean | null
          category: string
          cook_time: string | null
          created_at: string | null
          cuisine: string | null
          description: string | null
          difficulty: string | null
          generated_at: string | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: Json
          kitchen_tested: boolean | null
          name: string
          needs_validation: boolean | null
          nutrition: Json | null
          prep_time: string | null
          recipe_id: string
          servings: number | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
          validation_notes: string | null
          verified: boolean | null
        }
        Insert: {
          ai_generated?: boolean | null
          category?: string
          cook_time?: string | null
          created_at?: string | null
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          generated_at?: string | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: Json
          kitchen_tested?: boolean | null
          name: string
          needs_validation?: boolean | null
          nutrition?: Json | null
          prep_time?: string | null
          recipe_id: string
          servings?: number | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
          verified?: boolean | null
        }
        Update: {
          ai_generated?: boolean | null
          category?: string
          cook_time?: string | null
          created_at?: string | null
          cuisine?: string | null
          description?: string | null
          difficulty?: string | null
          generated_at?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: Json
          kitchen_tested?: boolean | null
          name?: string
          needs_validation?: boolean | null
          nutrition?: Json | null
          prep_time?: string | null
          recipe_id?: string
          servings?: number | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          id: string
          notes: string | null
          rating: number | null
          recipe_id: string
          saved_at: string
          times_cooked: number
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          rating?: number | null
          recipe_id: string
          saved_at?: string
          times_cooked?: number
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          rating?: number | null
          recipe_id?: string
          saved_at?: string
          times_cooked?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          id: string
          items: Json
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_recipe_rating_stats: {
        Args: { recipe_id_param: string }
        Returns: {
          average_rating: number
          recipe_id: string
          total_ratings: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
