
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  return {
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    miles: editingVehicle?.miles?.toString() || '',
    internalCode: editingVehicle?.internal_code || '',
    color: editingVehicle?.color || '',
    titleTypeId: editingVehicle?.title_type_id || '',
    titleLocationId: editingVehicle?.title_location_id || '',
    titleLocationCustom: editingVehicle?.title_location_custom || '',
    purchasePrice: editingVehicle?.purchase_price?.toString() || '',
    salePrice: editingVehicle?.sale_price?.toString() || '',
    minNegotiable: editingVehicle?.min_negotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfax_price?.toString() || '',
    mmrValue: editingVehicle?.mmr_value?.toString() || '',
    description: editingVehicle?.description || '',
    category: editingVehicle?.category || 'forSale',
    
    // Mapear a categoria estendida para o novo campo de uso
    vehicleUsage: getVehicleUsage(editingVehicle),
    consignmentStore: editingVehicle?.consignment_store || '',
    
    seller: editingVehicle?.created_by || '',
    finalSalePrice: editingVehicle?.final_sale_price?.toString() || '',
    saleDate: editingVehicle?.sale_date || '',
    saleNotes: editingVehicle?.sale_notes || '',
    customerName: editingVehicle?.customer_name || '',
    customerPhone: editingVehicle?.customer_phone || '',
    paymentMethod: editingVehicle?.payment_method || '',
    financingCompany: editingVehicle?.financing_company || '',
    checkDetails: editingVehicle?.check_details || '',
    otherPaymentDetails: editingVehicle?.other_payment_details || '',
    sellerCommission: editingVehicle?.seller_commission?.toString() || '',
    
    // Campos de financiamento
    financingBank: editingVehicle?.financing_bank || '',
    financingType: editingVehicle?.financing_type || '',
    originalFinancedName: editingVehicle?.original_financed_name || '',
    purchaseDate: editingVehicle?.purchase_date || '',
    dueDate: editingVehicle?.due_date || '',
    installmentValue: editingVehicle?.installment_value?.toString() || '',
    downPayment: editingVehicle?.down_payment?.toString() || '',
    financedAmount: editingVehicle?.financed_amount?.toString() || '',
    totalInstallments: editingVehicle?.total_installments?.toString() || '',
    paidInstallments: editingVehicle?.paid_installments?.toString() || '',
    remainingInstallments: editingVehicle?.remaining_installments?.toString() || '',
    totalToPay: editingVehicle?.total_to_pay?.toString() || '',
    payoffValue: editingVehicle?.payoff_value?.toString() || '',
    payoffDate: editingVehicle?.payoff_date || '',
    interestRate: editingVehicle?.interest_rate?.toString() || '',
    customFinancingBank: editingVehicle?.custom_financing_bank || '',
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
  
  // Default mapping based on category
  switch (vehicle.category) {
    case 'rental': return 'rental';
    case 'consigned': return 'consigned';
    case 'maintenance': return 'personal';
    default: return 'sale';
  }
};
