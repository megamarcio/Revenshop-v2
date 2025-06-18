
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - editingVehicle received:', editingVehicle);
  console.log('getInitialFormData - editingVehicle has ID:', editingVehicle?.id);

  // Only use editing vehicle data if it has a valid ID (indicating it's actually being edited)
  if (editingVehicle && editingVehicle.id) {
    console.log('getInitialFormData - editing existing vehicle with ID:', editingVehicle.id);
    console.log('getInitialFormData - miles from editingVehicle:', editingVehicle.miles);
    console.log('getInitialFormData - vehicleUsage from editingVehicle:', editingVehicle.vehicleUsage);
    
    const initialData: VehicleFormData = {
      name: editingVehicle.name || '',
      vin: editingVehicle.vin || '',
      year: editingVehicle.year?.toString() || '',
      model: editingVehicle.model || '',
      miles: editingVehicle.miles?.toString() || '0',
      internalCode: editingVehicle.internalCode || '',
      color: editingVehicle.color || '',
      plate: editingVehicle.plate || '',
      sunpass: editingVehicle.sunpass || '',
      purchasePrice: editingVehicle.purchasePrice?.toString() || '',
      salePrice: editingVehicle.salePrice?.toString() || '',
      minNegotiable: editingVehicle.minNegotiable?.toString() || '',
      carfaxPrice: editingVehicle.carfaxPrice?.toString() || '',
      mmrValue: editingVehicle.mmrValue?.toString() || '',
      description: editingVehicle.description || '',
      category: editingVehicle.category || 'forSale',
      
      // CRÍTICO: Garantir que vehicleUsage seja corretamente mapeado
      vehicleUsage: editingVehicle.vehicleUsage || editingVehicle.usage || 'sale',
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
      
      // Campos de financiamento
      financingBank: editingVehicle.financingBank || '',
      financingType: editingVehicle.financingType || '',
      originalFinancedName: editingVehicle.originalFinancedName || '',
      purchaseDate: editingVehicle.purchaseDate || '',
      dueDate: editingVehicle.dueDate || '',
      installmentValue: editingVehicle.installmentValue?.toString() || '',
      downPayment: editingVehicle.downPayment?.toString() || '',
      financedAmount: editingVehicle.financedAmount?.toString() || '',
      totalInstallments: editingVehicle.totalInstallments?.toString() || '',
      paidInstallments: editingVehicle.paidInstallments?.toString() || '',
      remainingInstallments: editingVehicle.remainingInstallments?.toString() || '',
      totalToPay: editingVehicle.totalToPay?.toString() || '',
      payoffValue: editingVehicle.payoffValue?.toString() || '',
      payoffDate: editingVehicle.payoffDate || '',
      interestRate: editingVehicle.interestRate?.toString() || '',
      customFinancingBank: editingVehicle.customFinancingBank || '',
      
      // Campo de vídeo
      video: editingVehicle.video || '',
    };

    console.log('getInitialFormData - miles converted to string:', initialData.miles);
    console.log('getInitialFormData - vehicleUsage mapped:', initialData.vehicleUsage);
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
