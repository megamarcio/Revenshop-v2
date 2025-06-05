
export interface Customer {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  assigned_to: string | null;
  credit_score: number | null;
  income: number | null;
  down_payment: number;
  notes: string;
  deal_status: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
  assigned_user?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}
