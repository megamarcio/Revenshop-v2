
export const mapFormToDbData = (formData: any) => {
  console.log('mapFormToDbData - START - input formData:', formData);
  console.log('mapFormToDbData - vehicleUsage from formData:', formData.vehicleUsage);
  console.log('mapFormToDbData - consignmentStore from formData:', formData.consignmentStore);
  
  // Prepare the description with vehicle usage and store info
  let description = formData.description || '';
  
  // Remove existing usage and store info from description to avoid duplicates
  description = description.replace(/\[USAGE:[^\]]+\]/g, '').replace(/\[STORE:[^\]]+\]/g, '').trim();
  
  // Add vehicle usage to description - CRÍTICO: sempre adicionar se presente
  if (formData.vehicleUsage) {
    description += ` [USAGE:${formData.vehicleUsage}]`;
    console.log('mapFormToDbData - added vehicleUsage to description:', formData.vehicleUsage);
  } else {
    console.log('mapFormToDbData - WARNING: No vehicleUsage found in formData!');
  }
  
  // Add consignment store to description if consigned and store specified
  if (formData.vehicleUsage === 'consigned' && formData.consignmentStore) {
    description += ` [STORE:${formData.consignmentStore}]`;
    console.log('mapFormToDbData - added consignmentStore to description:', formData.consignmentStore);
  }
  
  console.log('mapFormToDbData - final description with usage/store:', description);
  
  const dbData = {
    name: formData.name,
    vin: formData.vin,
    year: parseInt(formData.year) || 0,
    model: formData.model,
    miles: parseInt(formData.miles) || 0,
    internal_code: formData.internalCode,
    color: formData.color,
    plate: formData.plate || null,
    sunpass: formData.sunpass || null,
    
    // Financial fields
    purchase_price: parseFloat(formData.purchasePrice) || 0,
    sale_price: parseFloat(formData.salePrice) || 0,
    min_negotiable: formData.minNegotiable ? parseFloat(formData.minNegotiable) : null,
    carfax_price: formData.carfaxPrice ? parseFloat(formData.carfaxPrice) : null,
    mmr_value: formData.mmrValue ? parseFloat(formData.mmrValue) : null,
    
    description: description.trim(),
    category: formData.category,
    
    // Financing information - these exist in vehicles table
    financing_bank: formData.financingBank || null,
    financing_type: formData.financingType || null,
    original_financed_name: formData.originalFinancedName || null,
    purchase_date: formData.purchaseDate || null,
    due_date: formData.dueDate || null,
    installment_value: formData.installmentValue ? parseFloat(formData.installmentValue) : null,
    down_payment: formData.downPayment ? parseFloat(formData.downPayment) : null,
    financed_amount: formData.financedAmount ? parseFloat(formData.financedAmount) : null,
    total_installments: formData.totalInstallments ? parseInt(formData.totalInstallments) : null,
    paid_installments: formData.paidInstallments ? parseInt(formData.paidInstallments) : null,
    remaining_installments: formData.remainingInstallments ? parseInt(formData.remainingInstallments) : null,
    total_to_pay: formData.totalToPay ? parseFloat(formData.totalToPay) : null,
    payoff_value: formData.payoffValue ? parseFloat(formData.payoffValue) : null,
    payoff_date: formData.payoffDate || null,
    interest_rate: formData.interestRate ? parseFloat(formData.interestRate) : null,
    custom_financing_bank: formData.customFinancingBank || null,
    
    // Media
    video: formData.video || null,
  };
  
  console.log('mapFormToDbData - END - output dbData with encoded usage/store:', dbData);
  console.log('mapFormToDbData - final description in dbData:', dbData.description);
  console.log('mapFormToDbData - vehicleUsage encoded in description:', formData.vehicleUsage);
  return dbData;
};
