
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  assigned_to?: string;
  credit_score?: number;
  income?: number;
  down_payment?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}
