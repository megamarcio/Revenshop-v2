

export const mapDbDataToAppData = (dbVehicle: any) => {
  console.log('mapDbDataToAppData - input:', dbVehicle);
  
  // Extract extended category from description if present
  let category = dbVehicle.category;
  let extendedCategory = null;
  let consignmentStore = '';
  let cleanDescription = dbVehicle.description || '';
  
  if (dbVehicle.description) {
    // Extract extended category
    const categoryMatch = dbVehicle.description.match(/\[CATEGORY:([^\]]+)\]/);
    if (categoryMatch) {
      extendedCategory = categoryMatch[1];
      category = extendedCategory;
      cleanDescription = dbVehicle.description.replace(/\[CATEGORY:[^\]]+\]\s*/, '');
    }
    
    // Extract consignment store
    const storeMatch = dbVehicle.description.match(/\[STORE:([^\]]+)\]/);
    if (storeMatch) {
      consignmentStore = storeMatch[1];
      cleanDescription = cleanDescription.replace(/\[STORE:[^\]]+\]\s*/, '');
    }
  }

  // Calculate profit margin
  const profitMargin = dbVehicle.purchase_price && dbVehicle.sale_price
    ? (dbVehicle.sale_price / dbVehicle.purchase_price).toFixed(2)
    : '0.00';

  // Garantir que miles seja um número válido
  const miles = typeof dbVehicle.miles === 'number' ? dbVehicle.miles : parseInt(dbVehicle.miles) || 0;

  // Garantir que os campos de título sejam tratados corretamente
  const titleType = dbVehicle.title_type || 'clean-title';
  const titleStatus = dbVehicle.title_status || 'em-maos';

  const appData = {
    id: dbVehicle.id,
    name: dbVehicle.name,
    vin: dbVehicle.vin,
    year: dbVehicle.year,
    model: dbVehicle.model,
    miles: miles, // Garantir que seja um número
    internal_code: dbVehicle.internal_code,
    internalCode: dbVehicle.internal_code,
    color: dbVehicle.color,
    ca_note: dbVehicle.ca_note,
    caNote: dbVehicle.ca_note,
    purchase_price: dbVehicle.purchase_price,
    purchasePrice: dbVehicle.purchase_price,
    sale_price: dbVehicle.sale_price,
    salePrice: dbVehicle.sale_price,
    profit_margin: parseFloat(profitMargin),
    profitMargin: parseFloat(profitMargin),
    min_negotiable: dbVehicle.min_negotiable,
    minNegotiable: dbVehicle.min_negotiable,
    carfax_price: dbVehicle.carfax_price,
    carfaxPrice: dbVehicle.carfax_price,
    mmr_value: dbVehicle.mmr_value,
    mmrValue: dbVehicle.mmr_value,
    description: cleanDescription,
    category: category,
    consignment_store: consignmentStore,
    consignmentStore: consignmentStore,
    title_type: titleType, // Garantir que seja mapeado corretamente
    titleType: titleType, // Versão camelCase
    title_status: titleStatus, // Garantir que seja mapeado corretamente
    titleStatus: titleStatus, // Versão camelCase
    photos: dbVehicle.photos || [],
    video: dbVehicle.video,
    created_at: dbVehicle.created_at,
    updated_at: dbVehicle.updated_at,
    created_by: dbVehicle.created_by,
    
    // Campos de financiamento - garantir que todos sejam mapeados corretamente
    financing_bank: dbVehicle.financing_bank || '',
    financingBank: dbVehicle.financing_bank || '',
    financing_type: dbVehicle.financing_type || '',
    financingType: dbVehicle.financing_type || '',
    original_financed_name: dbVehicle.original_financed_name || '',
    originalFinancedName: dbVehicle.original_financed_name || '',
    purchase_date: dbVehicle.purchase_date || '',
    purchaseDate: dbVehicle.purchase_date || '',
    due_date: dbVehicle.due_date || '',
    dueDate: dbVehicle.due_date || '',
    installment_value: dbVehicle.installment_value || 0,
    installmentValue: dbVehicle.installment_value || 0,
    down_payment: dbVehicle.down_payment || 0,
    downPayment: dbVehicle.down_payment || 0,
    financed_amount: dbVehicle.financed_amount || 0,
    financedAmount: dbVehicle.financed_amount || 0,
    total_installments: dbVehicle.total_installments || 0,
    totalInstallments: dbVehicle.total_installments || 0,
    paid_installments: dbVehicle.paid_installments || 0,
    paidInstallments: dbVehicle.paid_installments || 0,
    remaining_installments: dbVehicle.remaining_installments || 0,
    remainingInstallments: dbVehicle.remaining_installments || 0,
    total_to_pay: dbVehicle.total_to_pay || 0,
    totalToPay: dbVehicle.total_to_pay || 0,
    payoff_value: dbVehicle.payoff_value || 0,
    payoffValue: dbVehicle.payoff_value || 0,
    payoff_date: dbVehicle.payoff_date || '',
    payoffDate: dbVehicle.payoff_date || '',
    interest_rate: dbVehicle.interest_rate || 0,
    interestRate: dbVehicle.interest_rate || 0,
    custom_financing_bank: dbVehicle.custom_financing_bank || '',
    customFinancingBank: dbVehicle.custom_financing_bank || ''
  };

  console.log('mapDbDataToAppData - output:', appData);
  console.log('mapDbDataToAppData - miles field mapped:', {
    originalMiles: dbVehicle.miles,
    mappedMiles: appData.miles,
    type: typeof appData.miles
  });
  console.log('mapDbDataToAppData - title fields mapped:', {
    originalTitleType: dbVehicle.title_type,
    mappedTitleType: appData.title_type,
    originalTitleStatus: dbVehicle.title_status,
    mappedTitleStatus: appData.title_status
  });
  console.log('mapDbDataToAppData - financing fields mapped:', {
    financingBank: appData.financingBank,
    financingType: appData.financingType,
    installmentValue: appData.installmentValue,
    downPayment: appData.downPayment,
    financedAmount: appData.financedAmount,
    totalInstallments: appData.totalInstallments,
    paidInstallments: appData.paidInstallments,
    remainingInstallments: appData.remainingInstallments,
    totalToPay: appData.totalToPay,
    payoffValue: appData.payoffValue,
    interestRate: appData.interestRate
  });
  
  return appData;
};
