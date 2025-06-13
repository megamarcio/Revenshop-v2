
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - editingVehicle received:', editingVehicle);
  
  return {
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    miles: editingVehicle?.miles?.toString() || '',
    internalCode: editingVehicle?.internal_code || editingVehicle?.internalCode || '',
    color: editingVehicle?.color || '',
    titleTypeId: editingVehicle?.title_type_id || editingVehicle?.titleTypeId || '',
    titleLocationId: editingVehicle?.title_location_id || editingVehicle?.titleLocationId || '',
    titleLocationCustom: editingVehicle?.title_location_custom || editingVehicle?.titleLocationCustom || '',
    
    // Corrigir o mapeamento dos valores financeiros
    purchasePrice: editingVehicle?.purchase_price?.toString() || editingVehicle?.purchasePrice?.toString() || '',
    salePrice: editingVehicle?.sale_price?.toString() || editingVehicle?.salePrice?.toString() || '',
    minNegotiable: editingVehicle?.min_negotiable?.toString() || editingVehicle?.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfax_price?.toString() || editingVehicle?.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle?.mmr_value?.toString() || editingVehicle?.mmrValue?.toString() || '',
    
    description: editingVehicle?.description || '',
    category: editingVehicle?.category || 'forSale',
    
    // Mapear a categoria estendida para o novo campo de uso
    vehicleUsage: getVehicleUsage(editingVehicle),
    consignmentStore: getConsignmentStore(editingVehicle),
    
    seller: editingVehicle?.created_by || editingVehicle?.seller || '',
    finalSalePrice: editingVehicle?.final_sale_price?.toString() || editingVehicle?.finalSalePrice?.toString() || '',
    saleDate: editingVehicle?.sale_date || editingVehicle?.saleDate || '',
    saleNotes: editingVehicle?.sale_notes || editingVehicle?.saleNotes || '',
    customerName: editingVehicle?.customer_name || editingVehicle?.customerName || '',
    customerPhone: editingVehicle?.customer_phone || editingVehicle?.customerPhone || '',
    paymentMethod: editingVehicle?.payment_method || editingVehicle?.paymentMethod || '',
    financingCompany: editingVehicle?.financing_company || editingVehicle?.financingCompany || '',
    checkDetails: editingVehicle?.check_details || editingVehicle?.checkDetails || '',
    otherPaymentDetails: editingVehicle?.other_payment_details || editingVehicle?.otherPaymentDetails || '',
    sellerCommission: editingVehicle?.seller_commission?.toString() || editingVehicle?.sellerCommission?.toString() || '',
    
    // Campos de financiamento
    financingBank: editingVehicle?.financing_bank || editingVehicle?.financingBank || '',
    financingType: editingVehicle?.financing_type || editingVehicle?.financingType || '',
    originalFinancedName: editingVehicle?.original_financed_name || editingVehicle?.originalFinancedName || '',
    purchaseDate: editingVehicle?.purchase_date || editingVehicle?.purchaseDate || '',
    dueDate: editingVehicle?.due_date || editingVehicle?.dueDate || '',
    installmentValue: editingVehicle?.installment_value?.toString() || editingVehicle?.installmentValue?.toString() || '',
    downPayment: editingVehicle?.down_payment?.toString() || editingVehicle?.downPayment?.toString() || '',
    financedAmount: editingVehicle?.financed_amount?.toString() || editingVehicle?.financedAmount?.toString() || '',
    totalInstallments: editingVehicle?.total_installments?.toString() || editingVehicle?.totalInstallments?.toString() || '',
    paidInstallments: editingVehicle?.paid_installments?.toString() || editingVehicle?.paidInstallments?.toString() || '',
    remainingInstallments: editingVehicle?.remaining_installments?.toString() || editingVehicle?.remainingInstallments?.toString() || '',
    totalToPay: editingVehicle?.total_to_pay?.toString() || editingVehicle?.totalToPay?.toString() || '',
    payoffValue: editingVehicle?.payoff_value?.toString() || editingVehicle?.payoffValue?.toString() || '',
    payoffDate: editingVehicle?.payoff_date || editingVehicle?.payoffDate || '',
    interestRate: editingVehicle?.interest_rate?.toString() || editingVehicle?.interestRate?.toString() || '',
    customFinancingBank: editingVehicle?.custom_financing_bank || editingVehicle?.customFinancingBank || '',
  };
};

const getVehicleUsage = (vehicle?: any): "rental" | "personal" | "sale" | "consigned" | "" => {
  if (!vehicle) return '';
  
  // Check for extended category in description
  if (vehicle.description) {
    const match = vehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
    if (match) {
      const extendedCategory = match[1];
      switch (extendedCategory) {
        case 'rental': return 'rental';
        case 'consigned': return 'consigned';
        default: return 'sale';
      }
    }
  }
  
  // Check extended_category field if available
  if (vehicle.extended_category) {
    switch (vehicle.extended_category) {
      case 'rental': return 'rental';
      case 'consigned': return 'consigned';
      default: return 'sale';
    }
  }
  
  // Check vehicleUsage field directly
  if (vehicle.vehicleUsage) {
    return vehicle.vehicleUsage;
  }
  
  // Default mapping based on category
  switch (vehicle.category) {
    case 'rental': return 'rental';
    case 'consigned': return 'consigned';
    case 'maintenance': return 'personal';
    default: return 'sale';
  }
};

const getConsignmentStore = (vehicle?: any): string => {
  if (!vehicle) return '';
  
  // Check for store info in description
  if (vehicle.description) {
    const match = vehicle.description.match(/\[STORE:([^\]]+)\]/);
    if (match) {
      return match[1];
    }
  }
  
  // Check direct field
  if (vehicle.consignmentStore) {
    // Handle cases where consignmentStore might be an object with _type and value
    if (typeof vehicle.consignmentStore === 'object' && vehicle.consignmentStore.value !== 'undefined') {
      return vehicle.consignmentStore.value || '';
    }
    if (typeof vehicle.consignmentStore === 'string') {
      return vehicle.consignmentStore;
    }
  }
  
  return vehicle.consignment_store || '';
};
