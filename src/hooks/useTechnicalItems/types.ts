
export interface TechnicalItem {
  id: string;
  vehicle_id: string;
  name: string;
  type: string;
  status: 'em-dia' | 'proximo-troca' | 'trocar';
  month?: string;
  year?: string;
  miles?: string;
  extraInfo?: string;
  tireBrand?: string;
  next_change?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTechnicalItem {
  id: string;
  vehicle_id: string;
  name: string;
  type: string;
  status: string;
  month?: string;
  year?: string;
  miles?: string;
  extra_info?: string;
  tire_brand?: string;
  next_change?: string;
  created_at: string;
  updated_at: string;
}
