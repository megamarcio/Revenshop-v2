
export const mapFormToDbData = (formData: any) => {
  console.log('mapFormToDbData - input formData:', formData);
  
  // Prepare the description with vehicle usage and store info
  let description = formData.description || '';
  
  // Add vehicle usage to description if not already present
  if (formData.vehicleUsage && !description.includes('[USAGE:')) {
    description += ` [USAGE:${formData.vehicleUsage}]`;
  }
  
  // Add consignment store to description if consigned and store specified
  if (formData.vehicleUsage === 'consigned' && formData.consignmentStore && !description.includes('[STORE:')) {
    description += ` [STORE:${formData.consignmentStore}]`;
  }
  
  const dbData = {
    name: formData.name,
    vin: formData.vin,
    year: parseInt(formData.year) || 0,
    model: formData.model,
    miles: parseInt(formData.miles) || 0,
    internal_code: formData.internalCode,
    color: formData.color,
    
    // Financial fields
    purchase_price: parseFloat(formData.purchasePrice) || 0,
    sale_price: parseFloat(formData.salePrice) || 0,
    min_negotiable: formData.minNegotiable ? parseFloat(formData.minNegotiable) : null,
    carfax_price: formData.carfaxPrice ? parseFloat(formData.carfaxPrice) : null,
    mmr_value: formData.mmrValue ? parseFloat(formData.mmrValue) : null,
    
    description: description.trim(),
    category: formData.category,
    
    // Title fields
    title_type_id: formData.titleTypeId || null,
    title_location_id: formData.titleLocationId || null,
    title_location_custom: formData.titleLocationCustom || null,
    
    // Basic vehicle information - only fields that exist in vehicles table
    created_by: formData.seller || null,
    
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
  
  console.log('mapFormToDbData - output dbData:', dbData);
  return dbData;
};
