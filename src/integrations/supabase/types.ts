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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ip_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ip_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_listings: {
        Row: {
          cart_count: number | null
          category: string
          created_at: string
          description: string | null
          documents: string[] | null
          favorites_count: number | null
          id: string
          name: string
          price: number | null
          price_negotiable: boolean | null
          registration_number: string | null
          status: string
          submission_id: string | null
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          cart_count?: number | null
          category: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          favorites_count?: number | null
          id?: string
          name: string
          price?: number | null
          price_negotiable?: boolean | null
          registration_number?: string | null
          status?: string
          submission_id?: string | null
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          cart_count?: number | null
          category?: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          favorites_count?: number | null
          id?: string
          name?: string
          price?: number | null
          price_negotiable?: boolean | null
          registration_number?: string | null
          status?: string
          submission_id?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ip_listings_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "ip_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_requests: {
        Row: {
          admin_notes: string | null
          budget_max: number | null
          budget_min: number | null
          category: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          industries: string[] | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgent: boolean | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          description: string
          id?: string
          industries?: string[] | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgent?: boolean | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          industries?: string[] | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgent?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      ip_submissions: {
        Row: {
          admin_notes: string | null
          category: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          description: string | null
          documents: string[] | null
          hold_expires_at: string | null
          hold_reason: string | null
          id: string
          name: string
          price: number | null
          price_negotiable: boolean | null
          registration_number: string | null
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          category: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          documents?: string[] | null
          hold_expires_at?: string | null
          hold_reason?: string | null
          id?: string
          name: string
          price?: number | null
          price_negotiable?: boolean | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          category?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          documents?: string[] | null
          hold_expires_at?: string | null
          hold_reason?: string | null
          id?: string
          name?: string
          price?: number | null
          price_negotiable?: boolean | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listing_views: {
        Row: {
          id: string
          ip_address: string | null
          listing_id: string
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          listing_id: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          listing_id?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_views_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ip_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          contact_email: string | null
          created_at: string
          id: string
          listing_id: string | null
          listing_snapshot: Json
          payment_expires_at: string | null
          payment_url: string | null
          price: number
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_snapshot: Json
          payment_expires_at?: string | null
          payment_url?: string | null
          price: number
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_snapshot?: Json
          payment_expires_at?: string | null
          payment_url?: string | null
          price?: number
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "ip_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_reviews: {
        Row: {
          comment: string | null
          created_at: string
          deal_completed: boolean
          id: string
          order_id: string | null
          rating: number
          reviewer_id: string
          seller_id: string
          submission_id: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          deal_completed?: boolean
          id?: string
          order_id?: string | null
          rating: number
          reviewer_id: string
          seller_id: string
          submission_id?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          deal_completed?: boolean
          id?: string
          order_id?: string | null
          rating?: number
          reviewer_id?: string
          seller_id?: string
          submission_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "ip_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_history: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          submission_id: string
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          submission_id: string
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          submission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "ip_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pending"
        | "manager_review"
        | "payment_ready"
        | "payment_expired"
        | "paid"
        | "completed"
        | "cancelled"
      request_status: "pending" | "in_progress" | "completed" | "cancelled"
      submission_status:
        | "pending"
        | "reviewing"
        | "approved"
        | "rejected"
        | "published"
        | "sold"
        | "on_hold"
        | "cancelled"
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
    Enums: {
      app_role: ["admin", "user"],
      order_status: [
        "pending",
        "manager_review",
        "payment_ready",
        "payment_expired",
        "paid",
        "completed",
        "cancelled",
      ],
      request_status: ["pending", "in_progress", "completed", "cancelled"],
      submission_status: [
        "pending",
        "reviewing",
        "approved",
        "rejected",
        "published",
        "sold",
        "on_hold",
        "cancelled",
      ],
    },
  },
} as const
