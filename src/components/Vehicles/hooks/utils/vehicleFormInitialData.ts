
import { VehicleFormData } from '../../types/vehicleFormTypes';
import { getTitleInfo } from '../../utils/vehicleFormUtils';

export const getInitialInternalCode = (editingVehicle?: any, isEditing?: boolean) => {
  if (isEditing && (editingVehicle?.internal_code || editingVehicle?.internalCode)) {
    return editingVehicle.internal_code || editingVehicle.internalCode;
  }
  return ''; // Start with blank for new vehicles
};

export const getMilesValue = (editingVehicle?: any) => {
  if (editingVehicle?.miles !== undefined) {
    const miles = typeof editingVehicle.miles === 'number' 
      ? editingVehicle.miles 
      : parseInt(editingVehicle.miles) || 0;
    return miles.toString();
  }
  return '0';
};

export const getTitleTypeValue = (editingVehicle?: any) => {
  return editingVehicle?.title_type || editingVehicle?.titleType || 'clean-title';
};

export const getTitleStatusValue = (editingVehicle?: any) => {
  return editingVehicle?.title_status || editingVehicle?.titleStatus || 'em-maos';
};

export const createInitialFormData = (editingVehicle?: any, isEditing?: boolean): VehicleFormData => {
  return {
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    miles: getMilesValue(editingVehicle),
    internalCode: getInitialInternalCode(editingVehicle, isEditing),
    color: editingVehicle?.color || '',
    caNote: editingVehicle?.ca_note?.toString() || editingVehicle?.caNote?.toString() || '',
    titleInfo: getTitleInfo(editingVehicle),
    titleType: getTitleTypeValue(editingVehicle),
    titleStatus: getTitleStatusValue(editingVehicle),
    purchasePrice: editingVehicle?.purchase_price?.toString() || editingVehicle?.purchasePrice?.toString() || '',
    salePrice: editingVehicle?.sale_price?.toString() || editingVehicle?.salePrice?.toString() || '',
    minNegotiable: editingVehicle?.min_negotiable?.toString() || editingVehicle?.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfax_price?.toString() || editingVehicle?.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle?.mmr_value?.toString() || editingVehicle?.mmrValue?.toString() || '',
    description: editingVehicle?.description || '',
    category: editingVehicle?.category || 'forSale',
    consignmentStore: editingVehicle?.consignment_store || editingVehicle?.consignmentStore || '',
    seller: editingVehicle?.seller || '',
    finalSalePrice: editingVehicle?.finalSalePrice?.toString() || '',
    saleDate: editingVehicle?.saleDate || '',
    saleNotes: editingVehicle?.saleNotes || '',
    customerName: editingVehicle?.customerName || '',
    customerPhone: editingVehicle?.customerPhone || '',
    paymentMethod: editingVehicle?.paymentMethod || '',
    financingCompany: editingVehicle?.financingCompany || '',
    checkDetails: editingVehicle?.checkDetails || '',
    otherPaymentDetails: editingVehicle?.otherPaymentDetails || '',
    sellerCommission: editingVehicle?.sellerCommission?.toString() || '',
    
    // Financing fields
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
    customFinancingBank: editingVehicle?.custom_financing_bank || editingVehicle?.customFinancingBank || ''
  };
};
