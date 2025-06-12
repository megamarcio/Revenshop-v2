
import { VehicleFormData } from '../../types/vehicleFormTypes';

// Função para extrair categoria estendida da descrição
const extractExtendedCategory = (description: string): string => {
  const match = description?.match(/\[CATEGORY:([^\]]+)\]/);
  return match ? match[1] : '';
};

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - editingVehicle:', editingVehicle);
  
  if (!editingVehicle) {
    return {
      name: '',
      vin: '',
      year: '',
      model: '',
      miles: '',
      internalCode: '',
      color: '',
      titleTypeId: '',
      titleLocationId: '',
      titleLocationCustom: '',
      purchasePrice: '',
      salePrice: '',
      minNegotiable: '',
      carfaxPrice: '',
      mmrValue: '',
      description: '',
      category: 'forSale',
      consignmentStore: '',
      seller: '',
      finalSalePrice: '',
      saleDate: '',
      saleNotes: '',
      customerName: '',
      customerPhone: '',
      paymentMethod: '',
      financingCompany: '',
      checkDetails: '',
      otherPaymentDetails: '',
      sellerCommission: '',
      financingBank: '',
      financingType: '',
      originalFinancedName: '',
      purchaseDate: '',
      dueDate: '',
      installmentValue: '',
      downPayment: '',
      financedAmount: '',
      totalInstallments: '',
      paidInstallments: '',
      remainingInstallments: '',
      totalToPay: '',
      payoffValue: '',
      payoffDate: '',
      interestRate: '',
      customFinancingBank: ''
    };
  }

  // Determinar a categoria correta do veículo
  let vehicleCategory = editingVehicle.category || 'forSale';
  
  // Se a categoria no BD é 'forSale', verificar se há categoria estendida na descrição
  if (vehicleCategory === 'forSale' && editingVehicle.description) {
    const extendedCategory = extractExtendedCategory(editingVehicle.description);
    if (extendedCategory && ['rental', 'maintenance', 'consigned'].includes(extendedCategory)) {
      vehicleCategory = extendedCategory;
    }
  }

  console.log('getInitialFormData - determined category:', vehicleCategory);

  return {
    name: editingVehicle.name || '',
    vin: editingVehicle.vin || '',
    year: editingVehicle.year?.toString() || '',
    model: editingVehicle.model || '',
    miles: editingVehicle.miles?.toString() || '',
    internalCode: editingVehicle.internal_code || editingVehicle.internalCode || '',
    color: editingVehicle.color || '',
    titleTypeId: editingVehicle.title_type_id || editingVehicle.titleTypeId || '',
    titleLocationId: editingVehicle.title_location_id || editingVehicle.titleLocationId || '',
    titleLocationCustom: editingVehicle.title_location_custom || editingVehicle.titleLocationCustom || '',
    purchasePrice: editingVehicle.purchase_price?.toString() || editingVehicle.purchasePrice?.toString() || '',
    salePrice: editingVehicle.sale_price?.toString() || editingVehicle.salePrice?.toString() || '',
    minNegotiable: editingVehicle.min_negotiable?.toString() || editingVehicle.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle.carfax_price?.toString() || editingVehicle.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle.mmr_value?.toString() || editingVehicle.mmrValue?.toString() || '',
    description: editingVehicle.description || '',
    category: vehicleCategory,
    consignmentStore: editingVehicle.consignmentStore || '',
    seller: editingVehicle.seller || '',
    finalSalePrice: editingVehicle.finalSalePrice?.toString() || '',
    saleDate: editingVehicle.saleDate || '',
    saleNotes: editingVehicle.saleNotes || '',
    customerName: editingVehicle.customerName || '',
    customerPhone: editingVehicle.customerPhone || '',
    paymentMethod: editingVehicle.paymentMethod || '',
    financingCompany: editingVehicle.financingCompany || '',
    checkDetails: editingVehicle.checkDetails || '',
    otherPaymentDetails: editingVehicle.otherPaymentDetails || '',
    sellerCommission: editingVehicle.sellerCommission?.toString() || '',
    financingBank: editingVehicle.financing_bank || editingVehicle.financingBank || '',
    financingType: editingVehicle.financing_type || editingVehicle.financingType || '',
    originalFinancedName: editingVehicle.original_financed_name || editingVehicle.originalFinancedName || '',
    purchaseDate: editingVehicle.purchase_date || editingVehicle.purchaseDate || '',
    dueDate: editingVehicle.due_date || editingVehicle.dueDate || '',
    installmentValue: editingVehicle.installment_value?.toString() || editingVehicle.installmentValue?.toString() || '',
    downPayment: editingVehicle.down_payment?.toString() || editingVehicle.downPayment?.toString() || '',
    financedAmount: editingVehicle.financed_amount?.toString() || editingVehicle.financedAmount?.toString() || '',
    totalInstallments: editingVehicle.total_installments?.toString() || editingVehicle.totalInstallments?.toString() || '',
    paidInstallments: editingVehicle.paid_installments?.toString() || editingVehicle.paidInstallments?.toString() || '',
    remainingInstallments: editingVehicle.remaining_installments?.toString() || editingVehicle.remainingInstallments?.toString() || '',
    totalToPay: editingVehicle.total_to_pay?.toString() || editingVehicle.totalToPay?.toString() || '',
    payoffValue: editingVehicle.payoff_value?.toString() || editingVehicle.payoffValue?.toString() || '',
    payoffDate: editingVehicle.payoff_date || editingVehicle.payoffDate || '',
    interestRate: editingVehicle.interest_rate?.toString() || editingVehicle.interestRate?.toString() || '',
    customFinancingBank: editingVehicle.custom_financing_bank || editingVehicle.customFinancingBank || ''
  };
};
