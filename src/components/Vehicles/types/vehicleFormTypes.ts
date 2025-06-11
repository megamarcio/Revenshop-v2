
export interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  miles: string; // CONFIRMADO: campo miles está definido
  internalCode: string;
  color: string;
  caNote: string;
  titleInfo: string;
  titleType: string;
  titleStatus: string;
  purchasePrice: string;
  salePrice: string;
  minNegotiable: string;
  carfaxPrice: string;
  mmrValue: string;
  description: string;
  category: "forSale" | "sold" | "consigned" | "rental" | "maintenance";
  consignmentStore: string;
  seller: string;
  finalSalePrice: string;
  saleDate: string;
  saleNotes: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  financingCompany: string;
  checkDetails: string;
  otherPaymentDetails: string;
  sellerCommission: string;
}

export interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicleData: any) => Promise<void>;
  editingVehicle?: any;
  onNavigateToCustomers?: () => void;
}
