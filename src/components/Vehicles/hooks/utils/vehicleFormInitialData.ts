import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - START - editingVehicle received:', editingVehicle);
  console.log('getInitialFormData - editingVehicle has ID:', editingVehicle?.id);
  console.log('getInitialFormData - editingVehicle.vehicleUsage:', editingVehicle?.vehicleUsage);
  console.log('getInitialFormData - editingVehicle.usage:', editingVehicle?.usage);
  console.log('getInitialFormData - editingVehicle.description:', editingVehicle?.description);
  console.log('getInitialFormData - editingVehicle.plate:', editingVehicle?.plate);
  console.log('getInitialFormData - editingVehicle.sunpass:', editingVehicle?.sunpass);

  // Only use editing vehicle data if it has a valid ID (indicating it's actually being edited)
  if (editingVehicle && editingVehicle.id) {
    console.log('getInitialFormData - editing existing vehicle with ID:', editingVehicle.id);
    console.log('getInitialFormData - miles from editingVehicle:', editingVehicle.miles);
    console.log('getInitialFormData - plate from editingVehicle:', editingVehicle.plate);
    console.log('getInitialFormData - sunpass from editingVehicle:', editingVehicle.sunpass);
    
    // CRÍTICO: Tentar múltiplas fontes para vehicleUsage para garantir que encontremos o valor
    let vehicleUsage = 'sale'; // Default
    
    // 1. Tentar editingVehicle.vehicleUsage primeiro (campo principal)
    if (editingVehicle.vehicleUsage) {
      vehicleUsage = editingVehicle.vehicleUsage;
      console.log('getInitialFormData - using editingVehicle.vehicleUsage:', vehicleUsage);
    }
    // 2. Tentar editingVehicle.usage como fallback (compatibilidade)
    else if (editingVehicle.usage) {
      vehicleUsage = editingVehicle.usage;
      console.log('getInitialFormData - using editingVehicle.usage as fallback:', vehicleUsage);
    }
    // 3. Tentar extrair da descrição como último recurso
    else if (editingVehicle.description) {
      const match = editingVehicle.description.match(/\[USAGE:([^\]]+)\]/);
      if (match) {
        vehicleUsage = match[1];
        console.log('getInitialFormData - extracted from description:', vehicleUsage);
      } else {
        console.log('getInitialFormData - no usage found in description, using default:', vehicleUsage);
      }
    } else {
      console.log('getInitialFormData - no vehicleUsage sources found, using default:', vehicleUsage);
    }
    
    // Extrair consignmentStore da descrição se necessário
    let consignmentStore = '';
    if (editingVehicle.consignmentStore) {
      consignmentStore = editingVehicle.consignmentStore;
    } else if (editingVehicle.description) {
      const match = editingVehicle.description.match(/\[STORE:([^\]]+)\]/);
      if (match) {
        consignmentStore = match[1];
      }
    }
    
    const initialData: VehicleFormData = {
      name: editingVehicle.name || '',
      vin: editingVehicle.vin || '',
      year: editingVehicle.year?.toString() || '',
      model: editingVehicle.model || '',
      miles: editingVehicle.miles?.toString() || '0',
      internalCode: editingVehicle.internalCode || editingVehicle.internal_code || '',
      color: editingVehicle.color || '',
      
      // CRITICAL: Ensure plate and sunpass are properly loaded
      plate: editingVehicle.plate || '',
      sunpass: editingVehicle.sunpass || '',
      
      purchasePrice: editingVehicle.purchasePrice?.toString() || editingVehicle.purchase_price?.toString() || '',
      salePrice: editingVehicle.salePrice?.toString() || editingVehicle.sale_price?.toString() || '',
      minNegotiable: editingVehicle.minNegotiable?.toString() || editingVehicle.min_negotiable?.toString() || '',
      carfaxPrice: editingVehicle.carfaxPrice?.toString() || editingVehicle.carfax_price?.toString() || '',
      mmrValue: editingVehicle.mmrValue?.toString() || editingVehicle.mmr_value?.toString() || '',
      description: editingVehicle.description || '',
      category: editingVehicle.category || 'forSale',
      
      // CRÍTICO: Usar o vehicleUsage determinado acima
      vehicleUsage: vehicleUsage,
      consignmentStore: consignmentStore,
      
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
      customFinancingBank: editingVehicle.customFinancingBank || editingVehicle.custom_financing_bank || '',
      
      // Campo de vídeo
      video: editingVehicle.video || '',
    };

    console.log('getInitialFormData - miles converted to string:', initialData.miles);
    console.log('getInitialFormData - FINAL vehicleUsage mapped:', initialData.vehicleUsage);
    console.log('getInitialFormData - FINAL consignmentStore mapped:', initialData.consignmentStore);
    console.log('getInitialFormData - FINAL plate mapped:', initialData.plate);
    console.log('getInitialFormData - FINAL sunpass mapped:', initialData.sunpass);
    console.log('getInitialFormData - final initialData for editing:', initialData);
    
    return initialData;
  }

  // Dados iniciais LIMPOS para novo veículo
  console.log('getInitialFormData - creating clean data for NEW vehicle');
  const newVehicleData: VehicleFormData = {
    name: '',
    vin: '',
    year: '',
    model: '',
    miles: '',
    internalCode: '',
    color: '',
    plate: '',
    sunpass: '',
    purchasePrice: '',
    salePrice: '',
    minNegotiable: '',
    carfaxPrice: '',
    mmrValue: '',
    description: '',
    category: 'forSale',
    vehicleUsage: 'sale',
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
    customFinancingBank: '',
    
    // Campo de vídeo
    video: '',
  };

  console.log('getInitialFormData - clean new vehicle data created:', newVehicleData);
  return newVehicleData;
};
