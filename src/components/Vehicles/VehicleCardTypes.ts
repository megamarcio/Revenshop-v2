
export interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: string;
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
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}
