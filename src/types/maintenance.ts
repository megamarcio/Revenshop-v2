
export interface MaintenancePart {
  id: string;
  name: string;
  value: number;
}

export interface MaintenanceLabor {
  id: string;
  description: string;
  value: number;
}

export interface MaintenanceRecord {
  id?: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_internal_code: string;
  detection_date: string;
  repair_date?: string;
  promised_date?: string;
  maintenance_type: 'preventive' | 'corrective' | 'bodyshop';
  maintenance_items: string[];
  custom_maintenance?: string;
  details: string;
  mechanic_name: string;
  mechanic_phone: string;
  parts: MaintenancePart[];
  labor: MaintenanceLabor[];
  total_amount: number;
  receipt_urls: string[];
  created_at?: string;
  created_by?: string;
}

export interface MaintenanceFormData {
  vehicle_id: string;
  detection_date: string;
  repair_date: string;
  promised_date: string;
  maintenance_type: 'preventive' | 'corrective' | 'bodyshop';
  maintenance_items: string[];
  custom_maintenance: string;
  details: string;
  mechanic_name: string;
  mechanic_phone: string;
  parts: MaintenancePart[];
  labor: MaintenanceLabor[];
  receipt_urls: string[];
}

export const MAINTENANCE_ITEMS = {
  preventive: [
    'Troca de óleo',
    'Filtro de óleo',
    'Filtro de ar',
    'Filtro de cabine',
    'Alinhamento',
    'Balanceamento',
    'Pastilhas de freios',
    'Fluido de freio',
    'Fluido da direção hidráulica',
    'Fluido de arrefecimento',
    'Luzes e lâmpadas',
    'Calibração de pneus',
    'Limpeza do ar-condicionado',
    'Outros'
  ],
  corrective: [
    'Bateria descarregada',
    'Alternador',
    'Rolamento estourado',
    'Vazamento de óleo',
    'Oil Cooling Hose',
    'Vazamento de água',
    'Junta do cabeçote',
    'Injeção eletrônica',
    'Bobina de ignição',
    'Motor de arranque',
    'Reparo no câmbio',
    'Ar-condicionado com defeito',
    'Amortecedor estourado',
    'Escapamento furado',
    'Sonda lambda',
    'Central eletrônica',
    'Bomba de combustível',
    'ABS com falha',
    'Sensor de rotação',
    'Vidro elétrico com defeito',
    'Trava elétrica quebrada',
    'Coxins danificados',
    'Painel digital com falha',
    'Direção elétrica travada',
    'Outros'
  ],
  bodyshop: [
    'Pintura total',
    'Pintura parcial',
    'Polimento técnico',
    'Retrovisor quebrado',
    'Para-choque danificado',
    'Para-lama amassado',
    'Pintura de rodas',
    'Capô amassado',
    'Retoque de pintura',
    'Porta desalinhada',
    'Farol trincado',
    'Lanterna quebrada',
    'Para-brisa rachado',
    'Vidros laterais quebrados',
    'Teto queimado de sol',
    'Martelinho de ouro',
    'Ferrugem na lataria',
    'Maçaneta quebrada',
    'Fechadura com defeito',
    'Moldura solta',
    'Aplicação de película Insulfime',
    'Lavagem técnica (Detailing)',
    'Hidratação dos bancos',
    'Reparo em estofamento',
    'Outros'
  ]
};
