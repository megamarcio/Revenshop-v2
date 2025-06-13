
export const mapDbDataToAppData = (dbData: any) => {
  console.log('mapDbDataToAppData - input:', dbData);
  
  const mappedData = {
    id: dbData.id,
    name: dbData.name,
    vin: dbData.vin,
    year: dbData.year,
    model: dbData.model,
    miles: dbData.miles,
    internalCode: dbData.internal_code,
    internal_code: dbData.internal_code, // Keep both formats for compatibility
    color: dbData.color,
    
    // Financial fields - preserve both snake_case and camelCase
    purchasePrice: dbData.purchase_price,
    purchase_price: dbData.purchase_price,
    salePrice: dbData.sale_price,
    sale_price: dbData.sale_price,
    minNegotiable: dbData.min_negotiable,
    min_negotiable: dbData.min_negotiable,
    carfaxPrice: dbData.carfax_price,
    carfax_price: dbData.carfax_price,
    mmrValue: dbData.mmr_value,
    mmr_value: dbData.mmr_value,
    
    // Calculate profit margin if both prices exist
    profitMargin: dbData.purchase_price && dbData.sale_price 
      ? ((dbData.sale_price - dbData.purchase_price) / dbData.purchase_price * 100)
      : 0,
    
    description: dbData.description,
    category: dbData.category,
    
    // Title fields
    titleTypeId: dbData.title_type_id,
    title_type_id: dbData.title_type_id,
    titleLocationId: dbData.title_location_id,
    title_location_id: dbData.title_location_id,
    titleLocationCustom: dbData.title_location_custom,
    title_location_custom: dbData.title_location_custom,
    
    // Sale information
    seller: dbData.created_by,
    created_by: dbData.created_by,
    finalSalePrice: dbData.final_sale_price,
    final_sale_price: dbData.final_sale_price,
    saleDate: dbData.sale_date,
    sale_date: dbData.sale_date,
    saleNotes: dbData.sale_notes,
    sale_notes: dbData.sale_notes,
    customerName: dbData.customer_name,
    customer_name: dbData.customer_name,
    customerPhone: dbData.customer_phone,
    customer_phone: dbData.customer_phone,
    paymentMethod: dbData.payment_method,
    payment_method: dbData.payment_method,
    financingCompany: dbData.financing_company,
    financing_company: dbData.financing_company,
    checkDetails: dbData.check_details,
    check_details: dbData.check_details,
    otherPaymentDetails: dbData.other_payment_details,
    other_payment_details: dbData.other_payment_details,
    sellerCommission: dbData.seller_commission,
    seller_commission: dbData.seller_commission,
    
    // Financing information
    financingBank: dbData.financing_bank,
    financing_bank: dbData.financing_bank,
    financingType: dbData.financing_type,
    financing_type: dbData.financing_type,
    originalFinancedName: dbData.original_financed_name,
    original_financed_name: dbData.original_financed_name,
    purchaseDate: dbData.purchase_date,
    purchase_date: dbData.purchase_date,
    dueDate: dbData.due_date,
    due_date: dbData.due_date,
    installmentValue: dbData.installment_value,
    installment_value: dbData.installment_value,
    downPayment: dbData.down_payment,
    down_payment: dbData.down_payment,
    financedAmount: dbData.financed_amount,
    financed_amount: dbData.financed_amount,
    totalInstallments: dbData.total_installments,
    total_installments: dbData.total_installments,
    paidInstallments: dbData.paid_installments,
    paid_installments: dbData.paid_installments,
    remainingInstallments: dbData.remaining_installments,
    remaining_installments: dbData.remaining_installments,
    totalToPay: dbData.total_to_pay,
    total_to_pay: dbData.total_to_pay,
    payoffValue: dbData.payoff_value,
    payoff_value: dbData.payoff_value,
    payoffDate: dbData.payoff_date,
    payoff_date: dbData.payoff_date,
    interestRate: dbData.interest_rate,
    interest_rate: dbData.interest_rate,
    customFinancingBank: dbData.custom_financing_bank,
    custom_financing_bank: dbData.custom_financing_bank,
    
    // Media
    photos: dbData.photos || [],
    video: dbData.video,
    videos: dbData.video ? [dbData.video] : [],
    
    // Vehicle usage information
    vehicleUsage: extractVehicleUsage(dbData),
    consignmentStore: extractConsignmentStore(dbData),
    
    // Timestamps
    createdAt: dbData.created_at,
    created_at: dbData.created_at,
    updatedAt: dbData.updated_at,
    updated_at: dbData.updated_at,
    
    // Title relationships
    title_types: dbData.title_types,
    title_locations: dbData.title_locations,
  };
  
  console.log('mapDbDataToAppData - output:', mappedData);
  return mappedData;
};

const extractVehicleUsage = (dbData: any): string => {
  // Check if there's specific usage info in description
  if (dbData.description) {
    const match = dbData.description.match(/\[USAGE:([^\]]+)\]/);
    if (match) {
      return match[1];
    }
  }
  
  // Default mapping based on category
  switch (dbData.category) {
    case 'rental': return 'rental';
    case 'consigned': return 'consigned';
    case 'maintenance': return 'personal';
    default: return 'sale';
  }
};

const extractConsignmentStore = (dbData: any): string => {
  if (dbData.description) {
    const match = dbData.description.match(/\[STORE:([^\]]+)\]/);
    if (match) {
      return match[1];
    }
  }
  return '';
};
