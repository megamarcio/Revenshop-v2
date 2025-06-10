
export interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  miles: string;
  internalCode: string;
  color: string;
  caNote: string;
  titleInfo?: string;
  purchasePrice: string;
  salePrice: string;
  minNegotiable: string;
  carfaxPrice: string;
  mmrValue: string;
  description: string;
  category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
  consignmentStore?: string;
  seller?: string;
  finalSalePrice?: string;
  saleDate?: string;
  saleNotes?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  financingCompany?: string;
  checkDetails?: string;
  otherPaymentDetails?: string;
  sellerCommission?: string;
  titleStatus?: string;
}

export interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicle: any) => void;
  editingVehicle?: any;
  onNavigateToCustomers?: () => void;
  onDelete?: (id: string) => Promise<void>;
}
