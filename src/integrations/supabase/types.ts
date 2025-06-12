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
      earthquake_data: {
        Row: {
          created_at: string
          depth: number
          id: string
          latitude: number
          location_name: string | null
          longitude: number
          magnitude: number
          occurred_at: string
          prefecture: string | null
        }
        Insert: {
          created_at?: string
          depth: number
          id?: string
          latitude: number
          location_name?: string | null
          longitude: number
          magnitude: number
          occurred_at: string
          prefecture?: string | null
        }
        Update: {
          created_at?: string
          depth?: number
          id?: string
          latitude?: number
          location_name?: string | null
          longitude?: number
          magnitude?: number
          occurred_at?: string
          prefecture?: string | null
        }
        Relationships: []
      }
      earthquake_zones: {
        Row: {
          average_magnitude: number | null
          center_latitude: number
          center_longitude: number
          created_at: string
          id: string
          last_major_earthquake: string | null
          prefecture: string
          radius_km: number
          risk_category: string
          zone_name: string
        }
        Insert: {
          average_magnitude?: number | null
          center_latitude: number
          center_longitude: number
          created_at?: string
          id?: string
          last_major_earthquake?: string | null
          prefecture: string
          radius_km: number
          risk_category: string
          zone_name: string
        }
        Update: {
          average_magnitude?: number | null
          center_latitude?: number
          center_longitude?: number
          created_at?: string
          id?: string
          last_major_earthquake?: string | null
          prefecture?: string
          radius_km?: number
          risk_category?: string
          zone_name?: string
        }
        Relationships: []
      }
      japan_earthquake_data: {
        Row: {
          avg_magnitude: number
          city: string
          created_at: string
          days_since_last_eq: number
          depth_km: number
          id: string
          latitude: number
          longitude: number
        }
        Insert: {
          avg_magnitude: number
          city: string
          created_at?: string
          days_since_last_eq: number
          depth_km: number
          id?: string
          latitude: number
          longitude: number
        }
        Update: {
          avg_magnitude?: number
          city?: string
          created_at?: string
          days_since_last_eq?: number
          depth_km?: number
          id?: string
          latitude?: number
          longitude?: number
        }
        Relationships: []
      }
      risk_predictions: {
        Row: {
          confidence: number
          days_since_last: number
          depth: number
          id: string
          latitude: number
          longitude: number
          magnitude: number
          predicted_at: string
          prediction_details: string | null
          risk_level: string
          warning_en: string | null
          warning_jp: string | null
        }
        Insert: {
          confidence: number
          days_since_last: number
          depth: number
          id?: string
          latitude: number
          longitude: number
          magnitude: number
          predicted_at?: string
          prediction_details?: string | null
          risk_level: string
          warning_en?: string | null
          warning_jp?: string | null
        }
        Update: {
          confidence?: number
          days_since_last?: number
          depth?: number
          id?: string
          latitude?: number
          longitude?: number
          magnitude?: number
          predicted_at?: string
          prediction_details?: string | null
          risk_level?: string
          warning_en?: string | null
          warning_jp?: string | null
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
