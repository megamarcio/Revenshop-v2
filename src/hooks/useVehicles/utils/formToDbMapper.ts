
export const mapFormToDbData = (formData: any) => {
  console.log('mapFormToDbData - input formData:', formData);
  
  // Build description with category and store info if needed
  let description = formData.description || '';
  
  if (formData.category && !['forSale', 'sold'].includes(formData.category)) {
    description = `[CATEGORY:${formData.category}] ${description}`;
  }
  
  if (formData.consignmentStore) {
    description = `[STORE:${formData.consignmentStore}] ${description}`;
  }

  const dbData = {
    name: formData.name,
    vin: formData.vin,
    year: formData.year,
    model: formData.model,
    miles: formData.miles || 0, // Garantir que miles seja tratado corretamente
    internal_code: formData.internalCode,
    color: formData.color,
    ca_note: formData.caNote,
    purchase_price: formData.purchasePrice,
    sale_price: formData.salePrice,
    min_negotiable: formData.minNegotiable,
    carfax_price: formData.carfaxPrice,
    mmr_value: formData.mmrValue,
    description: description.trim(),
    category: ['forSale', 'sold'].includes(formData.category) ? formData.category : 'forSale',
    
    // Garantir que title_type e title_status sejam mapeados corretamente
    title_type: formData.titleType || 'clean-title',
    title_status: formData.titleStatus || 'em-maos',
    
    video: formData.video,
    
    // Campos de financiamento - garantir mapeamento correto
    financing_bank: formData.financingBank || '',
    financing_type: formData.financingType || '',
    original_financed_name: formData.originalFinancedName || '',
    purchase_date: formData.purchaseDate || null,
    due_date: formData.dueDate || null,
    installment_value: formData.installmentValue || null,
    down_payment: formData.downPayment || null,
    financed_amount: formData.financedAmount || null,
    total_installments: formData.totalInstallments || null,
    paid_installments: formData.paidInstallments || null,
    remaining_installments: formData.remainingInstallments || null,
    total_to_pay: formData.totalToPay || null,
    payoff_value: formData.payoffValue || null,
    payoff_date: formData.payoffDate || null,
    interest_rate: formData.interestRate || null,
    custom_financing_bank: formData.customFinancingBank || ''
  };

  console.log('mapFormToDbData - output dbData:', dbData);
  console.log('mapFormToDbData - title fields mapped:', {
    inputTitleType: formData.titleType,
    outputTitleType: dbData.title_type,
    inputTitleStatus: formData.titleStatus,
    outputTitleStatus: dbData.title_status
  });
  console.log('mapFormToDbData - financing fields mapped:', {
    financingBank: dbData.financing_bank,
    financingType: dbData.financing_type,
    installmentValue: dbData.installment_value,
    downPayment: dbData.down_payment,
    financedAmount: dbData.financed_amount,
    totalInstallments: dbData.total_installments,
    paidInstallments: dbData.paid_installments,
    remainingInstallments: dbData.remaining_installments,
    totalToPay: dbData.total_to_pay,
    payoffValue: dbData.payoff_value,
    interestRate: dbData.interest_rate
  });
  
  return dbData;
};
