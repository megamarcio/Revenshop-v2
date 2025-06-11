
export interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number; // Corrigido: de string para number e mantido como miles
  internalCode: string;
  color: string;
  caNote: number;
  purchasePrice: number;
  salePrice: number;
  profitMargin: number;
  minNegotiable: number;
  carfaxPrice: number;
  mmrValue: number;
  description: string;
  category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
  consignmentStore?: string;
  seller?: string;
  finalSalePrice?: number;
  photos: string[];
  video?: string;
  
  // Campos de financiamento adicionados
  financingBank?: string;
  financingType?: string;
  originalFinancedName?: string;
  purchaseDate?: string;
  dueDate?: string;
  installmentValue?: number;
  downPayment?: number;
  financedAmount?: number;
  totalInstallments?: number;
  paidInstallments?: number;
  remainingInstallments?: number;
  totalToPay?: number;
  payoffValue?: number;
  payoffDate?: string;
  interestRate?: number;
  customFinancingBank?: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}
