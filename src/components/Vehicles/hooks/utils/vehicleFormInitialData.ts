
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - editingVehicle received:', editingVehicle);
  
  if (editingVehicle) {
    console.log('getInitialFormData - editing existing vehicle');
    console.log('getInitialFormData - editingVehicle.miles:', editingVehicle.miles);
    
    const result = {
      name: editingVehicle.name || '',
      vin: editingVehicle.vin || '',
      year: editingVehicle.year?.toString() || '',
      model: editingVehicle.model || '',
      miles: editingVehicle.miles?.toString() || '', // CONFIRMADO: usando miles
      internalCode: editingVehicle.internalCode || editingVehicle.internal_code || '',
      color: editingVehicle.color || '',
      titleInfo: editingVehicle.titleInfo || '',
      titleTypeId: editingVehicle.titleTypeId || editingVehicle.title_type_id || '',
      purchasePrice: editingVehicle.purchasePrice?.toString() || editingVehicle.purchase_price?.toString() || '',
      salePrice: editingVehicle.salePrice?.toString() || editingVehicle.sale_price?.toString() || '',
      minNegotiable: editingVehicle.minNegotiable?.toString() || editingVehicle.min_negotiable?.toString() || '',
      carfaxPrice: editingVehicle.carfaxPrice?.toString() || editingVehicle.carfax_price?.toString() || '',
      mmrValue: editingVehicle.mmrValue?.toString() || editingVehicle.mmr_value?.toString() || '',
      description: editingVehicle.description || '',
      category: editingVehicle.category || 'forSale',
      consignmentStore: editingVehicle.consignmentStore || editingVehicle.consignment_store || '',
      seller: editingVehicle.seller || '',
      finalSalePrice: editingVehicle.finalSalePrice?.toString() || editingVehicle.final_sale_price?.toString() || '',
      saleDate: editingVehicle.saleDate || editingVehicle.sale_date || '',
      saleNotes: editingVehicle.saleNotes || editingVehicle.sale_notes || '',
      customerName: editingVehicle.customerName || editingVehicle.customer_name || '',
      customerPhone: editingVehicle.customerPhone || editingVehicle.customer_phone || '',
      paymentMethod: editingVehicle.paymentMethod || editingVehicle.payment_method || '',
      financingCompany: editingVehicle.financingCompany || editingVehicle.financing_company || '',
      checkDetails: editingVehicle.checkDetails || editingVehicle.check_details || '',
      otherPaymentDetails: editingVehicle.otherPaymentDetails || editingVehicle.other_payment_details || '',
      sellerCommission: editingVehicle.sellerCommission?.toString() || editingVehicle.seller_commission?.toString() || '',
      
      // Campos de financiamento
      financingBank: editingVehicle.financingBank || editingVehicle.financing_bank || '',
      financingType: editingVehicle.financingType || editingVehicle.financing_type || '',
      originalFinancedName: editingVehicle.originalFinancedName || editingVehicle.original_financed_name || '',
      purchaseDate: editingVehicle.purchaseDate || editingVehicle.purchase_date || '',
      dueDate: editingVehicle.dueDate || editingVehicle.due_date || '',
      installmentValue: editingVehicle.installmentValue?.toString() || editingVehicle.installment_value?.toString() || '',
      downPayment: editingVehicle.downPayment?.toString() || editingVehicle.down_payment?.toString() || '',
      financedAmount: editingVehicle.financedAmount?.toString() || editingVehicle.financed_amount?.toString() || '',
      totalInstallments: editingVehicle.totalInstallments?.toString() || editingVehicle.total_installments?.toString() || '',
      paidInstallments: editingVehicle.paidInstallments?.toString() || editingVehicle.paid_installments?.toString() || '',
      remainingInstallments: editingVehicle.remainingInstallments?.toString() || editingVehicle.remaining_installments?.toString() || '',
      totalToPay: editingVehicle.totalToPay?.toString() || editingVehicle.total_to_pay?.toString() || '',
      payoffValue: editingVehicle.payoffValue?.toString() || editingVehicle.payoff_value?.toString() || '',
      payoffDate: editingVehicle.payoffDate || editingVehicle.payoff_date || '',
      interestRate: editingVehicle.interestRate?.toString() || editingVehicle.interest_rate?.toString() || '',
      customFinancingBank: editingVehicle.customFinancingBank || editingVehicle.custom_financing_bank || ''
    };
    
    console.log('getInitialFormData - result.miles:', result.miles);
    return result;
  }

  console.log('getInitialFormData - creating new vehicle form data');
  return {
    name: '',
    vin: '',
    year: '',
    model: '',
    miles: '', // CONFIRMADO: usando miles
    internalCode: '',
    color: '',
    titleInfo: '',
    titleTypeId: '',
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
    
    // Campos de financiamento
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
};
