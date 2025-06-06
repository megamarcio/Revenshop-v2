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
      auctions: {
        Row: {
          actual_auction_fees: number | null
          actual_freight_fee: number | null
          auction_city: string | null
          auction_date: string | null
          auction_house: string
          bid_accepted: boolean | null
          bid_value: number | null
          buyer_name: string | null
          car_link: string
          car_name: string
          car_year: number
          carfax_link: string | null
          carfax_value: number | null
          created_at: string
          created_by: string | null
          estimated_auction_fees: number | null
          estimated_freight_fee: number | null
          estimated_repair_value: number | null
          id: string
          max_payment_value: number | null
          mmr_value: number | null
          observations: string | null
          purchase_date: string | null
          purchase_value: number | null
          total_vehicle_cost: number | null
          updated_at: string
        }
        Insert: {
          actual_auction_fees?: number | null
          actual_freight_fee?: number | null
          auction_city?: string | null
          auction_date?: string | null
          auction_house?: string
          bid_accepted?: boolean | null
          bid_value?: number | null
          buyer_name?: string | null
          car_link: string
          car_name: string
          car_year: number
          carfax_link?: string | null
          carfax_value?: number | null
          created_at?: string
          created_by?: string | null
          estimated_auction_fees?: number | null
          estimated_freight_fee?: number | null
          estimated_repair_value?: number | null
          id?: string
          max_payment_value?: number | null
          mmr_value?: number | null
          observations?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          total_vehicle_cost?: number | null
          updated_at?: string
        }
        Update: {
          actual_auction_fees?: number | null
          actual_freight_fee?: number | null
          auction_city?: string | null
          auction_date?: string | null
          auction_house?: string
          bid_accepted?: boolean | null
          bid_value?: number | null
          buyer_name?: string | null
          car_link?: string
          car_name?: string
          car_year?: number
          carfax_link?: string | null
          carfax_value?: number | null
          created_at?: string
          created_by?: string | null
          estimated_auction_fees?: number | null
          estimated_freight_fee?: number | null
          estimated_repair_value?: number | null
          id?: string
          max_payment_value?: number | null
          mmr_value?: number | null
          observations?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          total_vehicle_cost?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      bhph_customers: {
        Row: {
          address: string | null
          bank_statements: string[] | null
          created_at: string | null
          credit_score: number | null
          current_job: string | null
          deal_status: string | null
          document_photo: string | null
          email: string | null
          employer_name: string | null
          employer_phone: string | null
          employment_duration: string | null
          employment_info: string | null
          id: string
          income: number | null
          interested_vehicle_id: string | null
          monthly_income: number | null
          name: string
          payment_details: Json | null
          payment_proof_documents: string[] | null
          payment_type: string | null
          phone: string
          reference1_address: string | null
          reference1_email: string | null
          reference1_name: string | null
          reference1_phone: string | null
          reference2_address: string | null
          reference2_email: string | null
          reference2_name: string | null
          reference2_phone: string | null
          responsible_seller_id: string | null
          social_security_number: string | null
          social_security_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bank_statements?: string[] | null
          created_at?: string | null
          credit_score?: number | null
          current_job?: string | null
          deal_status?: string | null
          document_photo?: string | null
          email?: string | null
          employer_name?: string | null
          employer_phone?: string | null
          employment_duration?: string | null
          employment_info?: string | null
          id?: string
          income?: number | null
          interested_vehicle_id?: string | null
          monthly_income?: number | null
          name: string
          payment_details?: Json | null
          payment_proof_documents?: string[] | null
          payment_type?: string | null
          phone: string
          reference1_address?: string | null
          reference1_email?: string | null
          reference1_name?: string | null
          reference1_phone?: string | null
          reference2_address?: string | null
          reference2_email?: string | null
          reference2_name?: string | null
          reference2_phone?: string | null
          responsible_seller_id?: string | null
          social_security_number?: string | null
          social_security_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bank_statements?: string[] | null
          created_at?: string | null
          credit_score?: number | null
          current_job?: string | null
          deal_status?: string | null
          document_photo?: string | null
          email?: string | null
          employer_name?: string | null
          employer_phone?: string | null
          employment_duration?: string | null
          employment_info?: string | null
          id?: string
          income?: number | null
          interested_vehicle_id?: string | null
          monthly_income?: number | null
          name?: string
          payment_details?: Json | null
          payment_proof_documents?: string[] | null
          payment_type?: string | null
          phone?: string
          reference1_address?: string | null
          reference1_email?: string | null
          reference1_name?: string | null
          reference1_phone?: string | null
          reference2_address?: string | null
          reference2_email?: string | null
          reference2_name?: string | null
          reference2_phone?: string | null
          responsible_seller_id?: string | null
          social_security_number?: string | null
          social_security_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bhph_customers_interested_vehicle_id_fkey"
            columns: ["interested_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bhph_customers_responsible_seller_id_fkey"
            columns: ["responsible_seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bhph_deals: {
        Row: {
          created_at: string | null
          customer_id: string | null
          down_payment: number
          financed_amount: number
          id: string
          interest_rate: number
          monthly_payment: number
          status: string | null
          term_months: number
          total_amount: number
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          down_payment: number
          financed_amount: number
          id?: string
          interest_rate: number
          monthly_payment: number
          status?: string | null
          term_months: number
          total_amount: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          down_payment?: number
          financed_amount?: number
          id?: string
          interest_rate?: number
          monthly_payment?: number
          status?: string | null
          term_months?: number
          total_amount?: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bhph_deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "bhph_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bhph_deals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_deals: {
        Row: {
          created_at: string | null
          customer_id: string
          deal_details: Json | null
          deal_type: string
          id: string
          payment_method: string | null
          seller_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deal_details?: Json | null
          deal_type: string
          id?: string
          payment_method?: string | null
          seller_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deal_details?: Json | null
          deal_type?: string
          id?: string
          payment_method?: string | null
          seller_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "bhph_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_deals_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_deals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          commission_client_brought: number | null
          commission_client_referral: number | null
          commission_full_sale: number | null
          created_at: string | null
          email: string
          facebook: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          photo: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          commission_client_brought?: number | null
          commission_client_referral?: number | null
          commission_full_sale?: number | null
          created_at?: string | null
          email: string
          facebook?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          photo?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          commission_client_brought?: number | null
          commission_client_referral?: number | null
          commission_full_sale?: number | null
          created_at?: string | null
          email?: string
          facebook?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          photo?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          check_details: string | null
          created_at: string | null
          customer_name: string
          customer_phone: string
          final_sale_price: number
          financing_company: string | null
          id: string
          other_payment_details: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          sale_date: string
          sale_notes: string | null
          seller_commission: number | null
          seller_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          check_details?: string | null
          created_at?: string | null
          customer_name: string
          customer_phone: string
          final_sale_price: number
          financing_company?: string | null
          id?: string
          other_payment_details?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          sale_date: string
          sale_notes?: string | null
          seller_commission?: number | null
          seller_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          check_details?: string | null
          created_at?: string | null
          customer_name?: string
          customer_phone?: string
          final_sale_price?: number
          financing_company?: string | null
          id?: string
          other_payment_details?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          sale_date?: string
          sale_notes?: string | null
          seller_commission?: number | null
          seller_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          ca_note: number
          carfax_price: number | null
          category: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          internal_code: string
          miles: number
          min_negotiable: number | null
          mmr_value: number | null
          model: string
          name: string
          photos: string[] | null
          profit_margin: number | null
          purchase_price: number
          sale_price: number
          title_status: Database["public"]["Enums"]["title_status"] | null
          title_type: Database["public"]["Enums"]["title_type"] | null
          updated_at: string | null
          video: string | null
          vin: string
          year: number
        }
        Insert: {
          ca_note: number
          carfax_price?: number | null
          category?: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          internal_code: string
          miles: number
          min_negotiable?: number | null
          mmr_value?: number | null
          model: string
          name: string
          photos?: string[] | null
          profit_margin?: number | null
          purchase_price: number
          sale_price: number
          title_status?: Database["public"]["Enums"]["title_status"] | null
          title_type?: Database["public"]["Enums"]["title_type"] | null
          updated_at?: string | null
          video?: string | null
          vin: string
          year: number
        }
        Update: {
          ca_note?: number
          carfax_price?: number | null
          category?: Database["public"]["Enums"]["vehicle_category"]
          color?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          internal_code?: string
          miles?: number
          min_negotiable?: number | null
          mmr_value?: number | null
          model?: string
          name?: string
          photos?: string[] | null
          profit_margin?: number | null
          purchase_price?: number
          sale_price?: number
          title_status?: Database["public"]["Enums"]["title_status"] | null
          title_type?: Database["public"]["Enums"]["title_type"] | null
          updated_at?: string | null
          video?: string | null
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      payment_method: "cash" | "financing" | "bhph" | "check" | "other"
      title_status: "em-maos" | "em-transito"
      title_type: "clean-title" | "rebuilt"
      user_role: "admin" | "manager" | "seller"
      vehicle_category: "forSale" | "sold"
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
    Enums: {
      payment_method: ["cash", "financing", "bhph", "check", "other"],
      title_status: ["em-maos", "em-transito"],
      title_type: ["clean-title", "rebuilt"],
      user_role: ["admin", "manager", "seller"],
      vehicle_category: ["forSale", "sold"],
    },
  },
} as const
