
export interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  miles: string;
  internalCode: string;
  color: string;
  purchasePrice: string;
  salePrice: string;
  minNegotiable: string;
  carfaxPrice: string;
  mmrValue: string;
  description: string;
  category: "forSale" | "sold";
  
  // Novo campo para uso do veículo
  vehicleUsage: "rental" | "personal" | "sale" | "consigned" | "sale-rental" | "maintenance" | "";
  consignmentStore: string;
  
  // Novos campos adicionados
  plate?: string;
  sunpass?: string;
  
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
  
  // Campos de financiamento
  financingBank: string;
  financingType: 'comprou-direto' | 'assumiu-financiamento' | '';
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
}

export interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicleData: any) => Promise<void>;
  editingVehicle?: any;
  onNavigateToCustomers?: () => void;
}
