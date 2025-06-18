export interface MaintenancePart {
  id: string;
  name: string;
  priceQuotes: PartPriceQuote[];
}

export interface PartPriceQuote {
  id: string;
  website: string;
  websiteUrl: string;
  partUrl: string;
  estimatedPrice: number;
  purchased?: boolean;
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
  is_urgent: boolean;
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
  is_urgent: boolean;
}

export const PARTS_WEBSITES = [
  { name: '1A Auto', url: 'https://www.1aauto.com' },
  { name: 'Advance Auto Parts', url: 'https://www.advanceautoparts.com' },
  { name: 'Amazon Automotive', url: 'https://www.amazon.com/automotive' },
  { name: 'AutoZone', url: 'https://www.autozone.com' },
  { name: 'Car-Part.com', url: 'https://www.car-part.com' },
  { name: 'CarParts.com', url: 'https://www.carparts.com' },
  { name: 'eBay Motors', url: 'https://www.ebay.com/motors' },
  { name: 'LKQ Online', url: 'https://www.lkqonline.com' },
  { name: "O'Reilly Auto Parts", url: 'https://www.oreillyauto.com' },
  { name: 'PartsGeek', url: 'https://www.partsgeek.com' },
  { name: 'RepairLink', url: 'https://www.repairlink.com' },
  { name: 'RockAuto', url: 'https://www.rockauto.com' },
  { name: 'Summit Racing', url: 'https://www.summitracing.com' },
  { name: 'Tire Rack', url: 'https://www.tirerack.com' },
  { name: 'Outros', url: '' }
];

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
