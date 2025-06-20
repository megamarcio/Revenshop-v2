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
      ai_settings: {
        Row: {
          card_image_instructions: string | null
          created_at: string
          description_instructions: string | null
          gemini_key: string | null
          id: string
          image_instructions: string | null
          openai_key: string | null
          rapidapi_key: string | null
          updated_at: string
          video_instructions: string | null
        }
        Insert: {
          card_image_instructions?: string | null
          created_at?: string
          description_instructions?: string | null
          gemini_key?: string | null
          id?: string
          image_instructions?: string | null
          openai_key?: string | null
          rapidapi_key?: string | null
          updated_at?: string
          video_instructions?: string | null
        }
        Update: {
          card_image_instructions?: string | null
          created_at?: string
          description_instructions?: string | null
          gemini_key?: string | null
          id?: string
          image_instructions?: string | null
          openai_key?: string | null
          rapidapi_key?: string | null
          updated_at?: string
          video_instructions?: string | null
        }
        Relationships: []
      }
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
          vin_number: string | null
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
          vin_number?: string | null
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
          vin_number?: string | null
        }
        Relationships: []
      }
      bank_statements: {
        Row: {
          amount: number
          balance: number | null
          created_at: string
          description: string
          id: string
          is_processed: boolean
          linked_expense_id: string | null
          linked_revenue_id: string | null
          reference_number: string | null
          transaction_date: string
        }
        Insert: {
          amount: number
          balance?: number | null
          created_at?: string
          description: string
          id?: string
          is_processed?: boolean
          linked_expense_id?: string | null
          linked_revenue_id?: string | null
          reference_number?: string | null
          transaction_date: string
        }
        Update: {
          amount?: number
          balance?: number | null
          created_at?: string
          description?: string
          id?: string
          is_processed?: boolean
          linked_expense_id?: string | null
          linked_revenue_id?: string | null
          reference_number?: string | null
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_linked_expense_id_fkey"
            columns: ["linked_expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_statements_linked_revenue_id_fkey"
            columns: ["linked_revenue_id"]
            isOneToOne: false
            referencedRelation: "revenues"
            referencedColumns: ["id"]
          },
        ]
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
      company_software: {
        Row: {
          cost: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          license_key: string | null
          name: string
          next_payment_date: string | null
          notes: string | null
          payment_type: string
          purchase_date: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          cost: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          license_key?: string | null
          name: string
          next_payment_date?: string | null
          notes?: string | null
          payment_type: string
          purchase_date?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          license_key?: string | null
          name?: string
          next_payment_date?: string | null
          notes?: string | null
          payment_type?: string
          purchase_date?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      customer_bank_statements: {
        Row: {
          customer_id: string
          id: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          customer_id: string
          id?: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          customer_id?: string
          id?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_bank_statements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "bhph_customers"
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
      customer_payment_documents: {
        Row: {
          customer_id: string
          id: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          customer_id: string
          id?: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          customer_id?: string
          id?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_payment_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "bhph_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          company_logo: string | null
          created_at: string | null
          from_email: string | null
          from_name: string | null
          id: number
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_user: string | null
          updated_at: string | null
        }
        Insert: {
          company_logo?: string | null
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: number
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string | null
        }
        Update: {
          company_logo?: string | null
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: number
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string
          due_date: string | null
          id: string
          is_paid: boolean
          notes: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          description: string
          due_date?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          due_date?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          created_at: string
          created_by: string | null
          custom_maintenance: string | null
          details: string | null
          detection_date: string
          id: string
          is_urgent: boolean
          labor: Json
          maintenance_items: string[]
          maintenance_type: string
          mechanic_name: string
          mechanic_phone: string
          parts: Json
          promised_date: string | null
          receipt_urls: string[]
          repair_date: string | null
          total_amount: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          custom_maintenance?: string | null
          details?: string | null
          detection_date: string
          id?: string
          is_urgent?: boolean
          labor?: Json
          maintenance_items?: string[]
          maintenance_type: string
          mechanic_name: string
          mechanic_phone: string
          parts?: Json
          promised_date?: string | null
          receipt_urls?: string[]
          repair_date?: string | null
          total_amount?: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          custom_maintenance?: string | null
          details?: string | null
          detection_date?: string
          id?: string
          is_urgent?: boolean
          labor?: Json
          maintenance_items?: string[]
          maintenance_type?: string
          mechanic_name?: string
          mechanic_phone?: string
          parts?: Json
          promised_date?: string | null
          receipt_urls?: string[]
          repair_date?: string | null
          total_amount?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
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
      revenues: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string
          id: string
          is_confirmed: boolean
          notes: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          description: string
          id?: string
          is_confirmed?: boolean
          notes?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          is_confirmed?: boolean
          notes?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          role: string
          screen_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          screen_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          screen_id?: string
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
          vehicle_id: string | null
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
          vehicle_id?: string | null
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
          vehicle_id?: string | null
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
          {
            foreignKeyName: "tasks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_items: {
        Row: {
          created_at: string
          extra_info: string | null
          id: string
          miles: string | null
          month: string | null
          name: string
          next_change: string | null
          status: string
          tire_brand: string | null
          type: string
          updated_at: string
          vehicle_id: string
          year: string | null
        }
        Insert: {
          created_at?: string
          extra_info?: string | null
          id?: string
          miles?: string | null
          month?: string | null
          name: string
          next_change?: string | null
          status?: string
          tire_brand?: string | null
          type: string
          updated_at?: string
          vehicle_id: string
          year?: string | null
        }
        Update: {
          created_at?: string
          extra_info?: string | null
          id?: string
          miles?: string | null
          month?: string | null
          name?: string
          next_change?: string | null
          status?: string
          tire_brand?: string | null
          type?: string
          updated_at?: string
          vehicle_id?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_items_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      title_locations: {
        Row: {
          allows_custom: boolean
          code: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          allows_custom?: boolean
          code: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          allows_custom?: boolean
          code?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      title_types: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_card_photos: {
        Row: {
          created_at: string | null
          id: string
          photo_url: string
          prompt_used: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_url: string
          prompt_used?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_url?: string
          prompt_used?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_card_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_photos: {
        Row: {
          id: string
          is_main: boolean | null
          position: number | null
          url: string
          vehicle_id: string
        }
        Insert: {
          id?: string
          is_main?: boolean | null
          position?: number | null
          url: string
          vehicle_id: string
        }
        Update: {
          id?: string
          is_main?: boolean | null
          position?: number | null
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_videos: {
        Row: {
          created_at: string
          file_name: string | null
          file_size: number | null
          id: string
          is_main: boolean | null
          prompt_used: string | null
          updated_at: string
          vehicle_id: string
          video_url: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_main?: boolean | null
          prompt_used?: string | null
          updated_at?: string
          vehicle_id: string
          video_url: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          is_main?: boolean | null
          prompt_used?: string | null
          updated_at?: string
          vehicle_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_videos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          carfax_price: number | null
          category: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at: string | null
          created_by: string | null
          custom_financing_bank: string | null
          description: string | null
          down_payment: number | null
          due_date: string | null
          financed_amount: number | null
          financing_bank: string | null
          financing_type: string | null
          id: string
          installment_value: number | null
          interest_rate: number | null
          internal_code: string
          miles: number
          min_negotiable: number | null
          mmr_value: number | null
          model: string
          name: string
          original_financed_name: string | null
          paid_installments: number | null
          payoff_date: string | null
          payoff_value: number | null
          plate: string | null
          profit_margin: number | null
          purchase_date: string | null
          purchase_price: number
          remaining_installments: number | null
          sale_price: number
          sunpass: string | null
          title_location_custom: string | null
          title_location_id: string | null
          title_type_id: string | null
          total_installments: number | null
          total_to_pay: number | null
          updated_at: string | null
          video: string | null
          vin: string
          year: number
        }
        Insert: {
          carfax_price?: number | null
          category?: Database["public"]["Enums"]["vehicle_category"]
          color: string
          created_at?: string | null
          created_by?: string | null
          custom_financing_bank?: string | null
          description?: string | null
          down_payment?: number | null
          due_date?: string | null
          financed_amount?: number | null
          financing_bank?: string | null
          financing_type?: string | null
          id?: string
          installment_value?: number | null
          interest_rate?: number | null
          internal_code: string
          miles: number
          min_negotiable?: number | null
          mmr_value?: number | null
          model: string
          name: string
          original_financed_name?: string | null
          paid_installments?: number | null
          payoff_date?: string | null
          payoff_value?: number | null
          plate?: string | null
          profit_margin?: number | null
          purchase_date?: string | null
          purchase_price: number
          remaining_installments?: number | null
          sale_price: number
          sunpass?: string | null
          title_location_custom?: string | null
          title_location_id?: string | null
          title_type_id?: string | null
          total_installments?: number | null
          total_to_pay?: number | null
          updated_at?: string | null
          video?: string | null
          vin: string
          year: number
        }
        Update: {
          carfax_price?: number | null
          category?: Database["public"]["Enums"]["vehicle_category"]
          color?: string
          created_at?: string | null
          created_by?: string | null
          custom_financing_bank?: string | null
          description?: string | null
          down_payment?: number | null
          due_date?: string | null
          financed_amount?: number | null
          financing_bank?: string | null
          financing_type?: string | null
          id?: string
          installment_value?: number | null
          interest_rate?: number | null
          internal_code?: string
          miles?: number
          min_negotiable?: number | null
          mmr_value?: number | null
          model?: string
          name?: string
          original_financed_name?: string | null
          paid_installments?: number | null
          payoff_date?: string | null
          payoff_value?: number | null
          plate?: string | null
          profit_margin?: number | null
          purchase_date?: string | null
          purchase_price?: number
          remaining_installments?: number | null
          sale_price?: number
          sunpass?: string | null
          title_location_custom?: string | null
          title_location_id?: string | null
          title_type_id?: string | null
          total_installments?: number | null
          total_to_pay?: number | null
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
          {
            foreignKeyName: "vehicles_title_location_id_fkey"
            columns: ["title_location_id"]
            isOneToOne: false
            referencedRelation: "title_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_title_type_id_fkey"
            columns: ["title_type_id"]
            isOneToOne: false
            referencedRelation: "title_types"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ai_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          image_instructions: string
          description_instructions: string
          card_image_instructions: string
          video_instructions: string
          openai_key: string
          gemini_key: string
          rapidapi_key: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      save_ai_settings: {
        Args:
          | {
              p_image_instructions: string
              p_description_instructions: string
              p_card_image_instructions?: string
              p_video_instructions?: string
              p_openai_key?: string
              p_gemini_key?: string
            }
          | {
              p_image_instructions: string
              p_description_instructions: string
              p_card_image_instructions?: string
              p_video_instructions?: string
              p_openai_key?: string
              p_gemini_key?: string
              p_rapidapi_key?: string
            }
        Returns: undefined
      }
    }
    Enums: {
      payment_method: "cash" | "financing" | "bhph" | "check" | "other"
      user_role: "admin" | "manager" | "seller" | "internal_seller"
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
      user_role: ["admin", "manager", "seller", "internal_seller"],
      vehicle_category: ["forSale", "sold"],
    },
  },
} as const
