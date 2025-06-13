
export const mapDbDataToAppData = (dbData: any) => {
  console.log('mapDbDataToAppData - input:', dbData);
  
  // Calculate profit margin
  const profitMargin = dbData.purchase_price && dbData.sale_price 
    ? ((dbData.sale_price - dbData.purchase_price) / dbData.purchase_price * 100)
    : 0;
  
  const mappedData = {
    id: dbData.id,
    name: dbData.name,
    vin: dbData.vin,
    year: dbData.year,
    model: dbData.model,
    miles: dbData.miles,
    internal_code: dbData.internal_code,
    color: dbData.color,
    
    // Financial fields - use snake_case to match Vehicle type
    purchase_price: dbData.purchase_price,
    sale_price: dbData.sale_price,
    profit_margin: profitMargin,
    min_negotiable: dbData.min_negotiable,
    carfax_price: dbData.carfax_price,
    mmr_value: dbData.mmr_value,
    
    description: dbData.description,
    category: dbData.category,
    
    // Title fields
    title_type_id: dbData.title_type_id,
    title_location_id: dbData.title_location_id,
    title_location_custom: dbData.title_location_custom,
    
    // Sale information
    created_by: dbData.created_by,
    
    // Financing information
    financing_bank: dbData.financing_bank,
    financing_type: dbData.financing_type,
    original_financed_name: dbData.original_financed_name,
    purchase_date: dbData.purchase_date,
    due_date: dbData.due_date,
    installment_value: dbData.installment_value,
    down_payment: dbData.down_payment,
    financed_amount: dbData.financed_amount,
    total_installments: dbData.total_installments,
    paid_installments: dbData.paid_installments,
    remaining_installments: dbData.remaining_installments,
    total_to_pay: dbData.total_to_pay,
    payoff_value: dbData.payoff_value,
    payoff_date: dbData.payoff_date,
    interest_rate: dbData.interest_rate,
    custom_financing_bank: dbData.custom_financing_bank,
    
    // Media - Extract photos from vehicle_photos relationship
    photos: dbData.vehicle_photos?.map((photo: any) => photo.url) || [],
    video: dbData.video,
    
    // Timestamps
    created_at: dbData.created_at,
    updated_at: dbData.updated_at,
    
    // Add camelCase versions for compatibility with form components
    internalCode: dbData.internal_code,
    purchasePrice: dbData.purchase_price,
    salePrice: dbData.sale_price,
    profitMargin: profitMargin,
    minNegotiable: dbData.min_negotiable,
    carfaxPrice: dbData.carfax_price,
    mmrValue: dbData.mmr_value,
    titleTypeId: dbData.title_type_id,
    titleLocationId: dbData.title_location_id,
    titleLocationCustom: dbData.title_location_custom,
    finalSalePrice: dbData.final_sale_price,
    saleDate: dbData.sale_date,
    saleNotes: dbData.sale_notes,
    customerName: dbData.customer_name,
    customerPhone: dbData.customer_phone,
    paymentMethod: dbData.payment_method,
    financingCompany: dbData.financing_company,
    checkDetails: dbData.check_details,
    otherPaymentDetails: dbData.other_payment_details,
    sellerCommission: dbData.seller_commission,
    financingBank: dbData.financing_bank,
    financingType: dbData.financing_type,
    originalFinancedName: dbData.original_financed_name,
    purchaseDate: dbData.purchase_date,
    dueDate: dbData.due_date,
    installmentValue: dbData.installment_value,
    downPayment: dbData.down_payment,
    financedAmount: dbData.financed_amount,
    totalInstallments: dbData.total_installments,
    paidInstallments: dbData.paid_installments,
    remainingInstallments: dbData.remaining_installments,
    totalToPay: dbData.total_to_pay,
    payoffValue: dbData.payoff_value,
    payoffDate: dbData.payoff_date,
    interestRate: dbData.interest_rate,
    customFinancingBank: dbData.custom_financing_bank,
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at,
    
    // Vehicle usage information
    vehicleUsage: extractVehicleUsage(dbData),
    consignmentStore: extractConsignmentStore(dbData),
    
    // Extended category for backward compatibility
    extended_category: extractExtendedCategory(dbData),
    consignment_store: extractConsignmentStore(dbData),
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

const extractExtendedCategory = (dbData: any): string => {
  return extractVehicleUsage(dbData);
};
