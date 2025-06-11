
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

  const appData = {
    id: dbVehicle.id,
    name: dbVehicle.name,
    vin: dbVehicle.vin,
    year: dbVehicle.year,
    model: dbVehicle.model,
    miles: dbVehicle.miles || 0, // Ensure miles is properly mapped
    internal_code: dbVehicle.internal_code,
    internalCode: dbVehicle.internal_code, // Add camelCase alias
    color: dbVehicle.color,
    ca_note: dbVehicle.ca_note,
    caNote: dbVehicle.ca_note, // Add camelCase alias
    purchase_price: dbVehicle.purchase_price,
    purchasePrice: dbVehicle.purchase_price, // Add camelCase alias
    sale_price: dbVehicle.sale_price,
    salePrice: dbVehicle.sale_price, // Add camelCase alias
    profit_margin: parseFloat(profitMargin),
    profitMargin: parseFloat(profitMargin), // Add camelCase alias
    min_negotiable: dbVehicle.min_negotiable,
    minNegotiable: dbVehicle.min_negotiable, // Add camelCase alias
    carfax_price: dbVehicle.carfax_price,
    carfaxPrice: dbVehicle.carfax_price, // Add camelCase alias
    mmr_value: dbVehicle.mmr_value,
    mmrValue: dbVehicle.mmr_value, // Add camelCase alias
    description: cleanDescription,
    category: category,
    consignment_store: consignmentStore,
    consignmentStore: consignmentStore, // Add camelCase alias
    title_type: dbVehicle.title_type,
    titleType: dbVehicle.title_type, // Add camelCase alias
    title_status: dbVehicle.title_status,
    titleStatus: dbVehicle.title_status, // Add camelCase alias
    photos: dbVehicle.photos || [],
    video: dbVehicle.video,
    created_at: dbVehicle.created_at,
    updated_at: dbVehicle.updated_at,
    created_by: dbVehicle.created_by,
    
    // Financing fields - ensure both snake_case and camelCase are available
    financing_bank: dbVehicle.financing_bank,
    financingBank: dbVehicle.financing_bank,
    financing_type: dbVehicle.financing_type,
    financingType: dbVehicle.financing_type,
    original_financed_name: dbVehicle.original_financed_name,
    originalFinancedName: dbVehicle.original_financed_name,
    purchase_date: dbVehicle.purchase_date,
    purchaseDate: dbVehicle.purchase_date,
    due_date: dbVehicle.due_date,
    dueDate: dbVehicle.due_date,
    installment_value: dbVehicle.installment_value,
    installmentValue: dbVehicle.installment_value,
    down_payment: dbVehicle.down_payment,
    downPayment: dbVehicle.down_payment,
    financed_amount: dbVehicle.financed_amount,
    financedAmount: dbVehicle.financed_amount,
    total_installments: dbVehicle.total_installments,
    totalInstallments: dbVehicle.total_installments,
    paid_installments: dbVehicle.paid_installments,
    paidInstallments: dbVehicle.paid_installments,
    remaining_installments: dbVehicle.remaining_installments,
    remainingInstallments: dbVehicle.remaining_installments,
    total_to_pay: dbVehicle.total_to_pay,
    totalToPay: dbVehicle.total_to_pay,
    payoff_value: dbVehicle.payoff_value,
    payoffValue: dbVehicle.payoff_value,
    payoff_date: dbVehicle.payoff_date,
    payoffDate: dbVehicle.payoff_date,
    interest_rate: dbVehicle.interest_rate,
    interestRate: dbVehicle.interest_rate,
    custom_financing_bank: dbVehicle.custom_financing_bank,
    customFinancingBank: dbVehicle.custom_financing_bank
  };

  console.log('mapDbDataToAppData - output:', appData);
  console.log('mapDbDataToAppData - miles value:', appData.miles);
  
  return appData;
};
