
export interface VehicleFormData {
  // Basic info
  name: string;
  vin: string;
  year: string;
  model: string;
  miles: string;
  internalCode: string;
  color: string;
  plate: string;
  sunpass: string;
  category: string;
  vehicleUsage: string;
  consignmentStore: string;
  
  // Financial info
  purchasePrice: string;
  salePrice: string;
  minNegotiable: string;
  carfaxPrice: string;
  mmrValue: string;
  
  // Sale info
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
  
  // Financing info
  financingBank: string;
  financingType: string;
  originalFinancedName: string;
  purchaseDate: string;
  dueDate: string;
  installmentValue: string;
  downPayment: string;
  financedAmount: string;
  totalInstallments: string;
  paidInstallments: string;
  remainingInstallments: string;
  totalToPay: string;
  payoffValue: string;
  payoffDate: string;
  interestRate: string;
  customFinancingBank: string;
  
  // Media and description
  description: string;
  video: string;
}

export interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicleData: any) => Promise<void>;
  editingVehicle?: any;
  onNavigateToCustomers?: () => void;
}
