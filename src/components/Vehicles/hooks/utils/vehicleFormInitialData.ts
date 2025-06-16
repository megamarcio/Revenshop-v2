
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const getInitialFormData = (editingVehicle?: any): VehicleFormData => {
  console.log('getInitialFormData - editingVehicle received:', editingVehicle);

  if (editingVehicle) {
    console.log('getInitialFormData - miles from editingVehicle:', editingVehicle.miles);
    
    const initialData: VehicleFormData = {
      name: editingVehicle.name || '',
      vin: editingVehicle.vin || '',
      year: editingVehicle.year?.toString() || '',
      model: editingVehicle.model || '',
      miles: editingVehicle.miles?.toString() || '0',
      internalCode: editingVehicle.internalCode || '',
      color: editingVehicle.color || '',
      
      // Novos campos adicionados
      plate: editingVehicle.plate || '',
      sunpass: editingVehicle.sunpass || '',
      
      purchasePrice: editingVehicle.purchasePrice?.toString() || '',
      salePrice: editingVehicle.salePrice?.toString() || '',
      minNegotiable: editingVehicle.minNegotiable?.toString() || '',
      carfaxPrice: editingVehicle.carfaxPrice?.toString() || '',
      mmrValue: editingVehicle.mmrValue?.toString() || '',
      description: editingVehicle.description || '',
      category: editingVehicle.category || 'forSale',
      
      // Novo campo para uso do veículo
      vehicleUsage: editingVehicle.vehicleUsage || editingVehicle.usage || 'personal',
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
    };

    console.log('getInitialFormData - miles converted to string:', initialData.miles);
    console.log('getInitialFormData - final initialData:', initialData);
    
    return initialData;
  }

  // Dados iniciais para novo veículo
  const newVehicleData: VehicleFormData = {
    name: '',
    vin: '',
    year: '',
    model: '',
    miles: '0',
    internalCode: '',
    color: '',
    
    // Novos campos
    plate: '',
    sunpass: '',
    
    purchasePrice: '',
    salePrice: '',
    minNegotiable: '',
    carfaxPrice: '',
    mmrValue: '',
    description: '',
    category: 'forSale',
    vehicleUsage: 'personal',
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
  };

  console.log('getInitialFormData - new vehicle data:', newVehicleData);
  return newVehicleData;
};
