
export interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number;
  internal_code: string;
  color: string;
  purchase_price: number;
  sale_price: number;
  profit_margin: number;
  min_negotiable?: number;
  carfax_price?: number;
  mmr_value?: number;
  description?: string;
  category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
  consignment_store?: string;
  photos: string[];
  video?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Campos de financiamento adicionados
  financing_bank?: string;
  financing_type?: string;
  original_financed_name?: string;
  purchase_date?: string;
  due_date?: string;
  installment_value?: number;
  down_payment?: number;
  financed_amount?: number;
  total_installments?: number;
  paid_installments?: number;
  remaining_installments?: number;
  total_to_pay?: number;
  payoff_value?: number;
  payoff_date?: string;
  interest_rate?: number;
  custom_financing_bank?: string;
  
  // Additional field to store extended category info
  extended_category?: 'rental' | 'maintenance' | 'consigned';
}
