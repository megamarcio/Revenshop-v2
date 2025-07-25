export const mapDbDataToAppData = (dbData: any) => {
  console.log('mapDbDataToAppData - input dbData:', dbData);
  console.log('mapDbDataToAppData - dbData.description:', dbData.description);
  console.log('mapDbDataToAppData - dbData.plate:', dbData.plate);
  console.log('mapDbDataToAppData - dbData.sunpass:', dbData.sunpass);
  
  // Calculate profit margin
  const profitMargin = dbData.purchase_price && dbData.sale_price 
    ? (dbData.sale_price / dbData.purchase_price - 1) * 100
    : 0;
  
  // Extract vehicle usage and consignment store from description
  const vehicleUsage = extractVehicleUsage(dbData);
  const consignmentStore = extractConsignmentStore(dbData);
  
  console.log('mapDbDataToAppData - extracted vehicleUsage:', vehicleUsage);
  console.log('mapDbDataToAppData - extracted consignmentStore:', consignmentStore);
  
  const mappedData = {
    id: dbData.id,
    name: dbData.name,
    vin: dbData.vin,
    year: dbData.year,
    model: dbData.model,
    miles: dbData.miles,
    internal_code: dbData.internal_code,
    color: dbData.color,
    
    // CRITICAL: Ensure plate and sunpass are properly mapped
    plate: dbData.plate || '',
    sunpass: dbData.sunpass || '',
    
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
    
    // CRÍTICO: Vehicle usage information - GARANTIR campo consistente
    vehicleUsage: vehicleUsage,
    consignmentStore: consignmentStore,
    
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
    
    // Para compatibilidade com outros componentes que ainda usam 'usage'
    usage: vehicleUsage,
    extended_category: extractExtendedCategory(dbData),
    consignment_store: consignmentStore,
  };
  
  console.log('mapDbDataToAppData - final mapped vehicleUsage:', mappedData.vehicleUsage);
  console.log('mapDbDataToAppData - final mapped usage (compatibility):', mappedData.usage);
  console.log('mapDbDataToAppData - final mapped plate:', mappedData.plate);
  console.log('mapDbDataToAppData - final mapped sunpass:', mappedData.sunpass);
  console.log('mapDbDataToAppData - final output data:', mappedData);
  return mappedData;
};

const extractVehicleUsage = (dbData: any): string => {
  console.log('extractVehicleUsage - input dbData.description:', dbData.description);
  console.log('extractVehicleUsage - input dbData.category:', dbData.category);
  
  // Check if there's specific usage info in description - PRIMEIRA PRIORIDADE
  if (dbData.description) {
    const match = dbData.description.match(/\[USAGE:([^\]]+)\]/);
    if (match) {
      const extractedUsage = match[1];
      console.log('extractVehicleUsage - Found usage in description:', extractedUsage);
      return extractedUsage;
    }
  }
  
  // Default mapping based on category - SEGUNDA PRIORIDADE
  const defaultMapping = (() => {
    switch (dbData.category) {
      case 'rentalFleet': return 'rental';
      case 'consigned': return 'consigned';
      case 'maintenance': return 'maintenance';
      case 'bhph': return 'sale';
      case 'sold': return 'sale';
      case 'reserved': return 'sale';
      case 'auction': return 'sale';
      case 'logistics': return 'personal';
      default: return 'sale'; // Default para 'sale'
    }
  })();
  
  console.log('extractVehicleUsage - Using default mapping for category', dbData.category, ':', defaultMapping);
  return defaultMapping;
};

const extractConsignmentStore = (dbData: any): string => {
  console.log('extractConsignmentStore - input dbData.description:', dbData.description);
  
  if (dbData.description) {
    const match = dbData.description.match(/\[STORE:([^\]]+)\]/);
    if (match) {
      console.log('extractConsignmentStore - Found store in description:', match[1]);
      return match[1];
    }
  }
  console.log('extractConsignmentStore - No store found, returning empty string');
  return '';
};

const extractExtendedCategory = (dbData: any): "rental" | "consigned" | "maintenance" | undefined => {
  // Check for extended category in description
  if (dbData.description) {
    const match = dbData.description.match(/\[USAGE:([^\]]+)\]/);
    if (match) {
      const usage = match[1];
      switch (usage) {
        case 'rental': return 'rental';
        case 'consigned': return 'consigned';
        case 'maintenance': return 'maintenance';
        default: return undefined;
      }
    }
  }
  
  // Default mapping based on category
  switch (dbData.category) {
    case 'rentalFleet': return 'rental';
    case 'consigned': return 'consigned';
    case 'maintenance': return 'maintenance';
    default: return undefined;
  }
};
