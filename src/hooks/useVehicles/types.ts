
export interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number;
  internal_code: string;
  color: string;
  ca_note: number;
  purchase_price: number;
  sale_price: number;
  profit_margin: number;
  min_negotiable?: number;
  carfax_price?: number;
  mmr_value?: number;
  description?: string;
  category: 'forSale' | 'sold';
  title_type?: 'clean-title' | 'rebuilt';
  title_status?: 'em-maos' | 'em-transito';
  photos: string[];
  video?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}
