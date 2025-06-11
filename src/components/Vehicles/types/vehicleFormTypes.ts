
export interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  miles: string; // CONFIRMADO: campo miles está definido
  internalCode: string;
  color: string;
  titleTypeId: string; // Campo para tipo de título
  titleLocationId: string; // Novo campo para local do título
  titleLocationCustom: string; // Novo campo para local customizado
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
  
  // Novos campos de financiamento
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
