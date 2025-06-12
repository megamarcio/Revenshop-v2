
export const mapFormToDbData = (vehicleData: any) => {
  console.log('mapFormToDbData - input vehicleData:', vehicleData);
  
  const dbVehicleData: any = {
    name: vehicleData.name,
    vin: vehicleData.vin,
    year: parseInt(vehicleData.year),
    model: vehicleData.model,
    miles: parseInt(vehicleData.miles) || 0,
    internal_code: vehicleData.internalCode,
    color: vehicleData.color,
    purchase_price: parseFloat(vehicleData.purchasePrice),
    sale_price: parseFloat(vehicleData.salePrice),
    min_negotiable: vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null,
    carfax_price: vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null,
    mmr_value: vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null,
    
    // Campos de título
    title_type_id: vehicleData.titleTypeId || null,
    title_location_id: vehicleData.titleLocationId || null,
    title_location_custom: vehicleData.titleLocationCustom || null,
    
    // Campos de financiamento
    financing_bank: vehicleData.financingBank || null,
    financing_type: vehicleData.financingType || null,
    original_financed_name: vehicleData.originalFinancedName || null,
    purchase_date: vehicleData.purchaseDate || null,
    due_date: vehicleData.dueDate || null,
    installment_value: vehicleData.installmentValue ? parseFloat(vehicleData.installmentValue) : null,
    down_payment: vehicleData.downPayment ? parseFloat(vehicleData.downPayment) : null,
    financed_amount: vehicleData.financedAmount ? parseFloat(vehicleData.financedAmount) : null,
    total_installments: vehicleData.totalInstallments ? parseInt(vehicleData.totalInstallments) : null,
    paid_installments: vehicleData.paidInstallments ? parseInt(vehicleData.paidInstallments) : null,
    remaining_installments: vehicleData.remainingInstallments ? parseInt(vehicleData.remainingInstallments) : null,
    total_to_pay: vehicleData.totalToPay ? parseFloat(vehicleData.totalToPay) : null,
    payoff_value: vehicleData.payoffValue ? parseFloat(vehicleData.payoffValue) : null,
    payoff_date: vehicleData.payoffDate || null,
    interest_rate: vehicleData.interestRate ? parseFloat(vehicleData.interestRate) : null,
    custom_financing_bank: vehicleData.customFinancingBank || null,
  };

  // Handle category mapping - CRITICAL FIX: Sempre mapear a categoria
  console.log('mapFormToDbData - processing category:', vehicleData.category);
  
  if (vehicleData.category === 'sold') {
    dbVehicleData.category = 'sold';
    // Limpar informações de categoria estendida se estava vendido
    const cleanDesc = (vehicleData.description || '').replace(/\[CATEGORY:[^\]]+\]\s*/, '');
    dbVehicleData.description = cleanDesc;
  } else if (vehicleData.category === 'forSale') {
    dbVehicleData.category = 'forSale';
    // Limpar informações de categoria estendida se estava à venda
    const cleanDesc = (vehicleData.description || '').replace(/\[CATEGORY:[^\]]+\]\s*/, '');
    dbVehicleData.description = cleanDesc;
  } else if (['rental', 'maintenance', 'consigned'].includes(vehicleData.category)) {
    // For rental, maintenance, consigned - store as forSale in DB and add extended category to description
    console.log('mapFormToDbData - mapping extended category to forSale:', vehicleData.category);
    dbVehicleData.category = 'forSale';
    
    // Store extended category in description
    const extendedCategory = vehicleData.category;
    const currentDesc = vehicleData.description || '';
    const cleanDesc = currentDesc.replace(/\[CATEGORY:[^\]]+\]\s*/, '');
    dbVehicleData.description = `[CATEGORY:${extendedCategory}]${cleanDesc ? ' ' + cleanDesc : ''}`;
    
    console.log('mapFormToDbData - final description with category tag:', dbVehicleData.description);
  } else {
    // Para qualquer outra categoria não reconhecida, usar forSale como padrão
    console.log('mapFormToDbData - categoria não reconhecida, usando forSale como padrão:', vehicleData.category);
    dbVehicleData.category = 'forSale';
    dbVehicleData.description = vehicleData.description || '';
  }

  // Handle consignment store info
  if (vehicleData.consignmentStore && vehicleData.category === 'consigned') {
    const currentDesc = dbVehicleData.description || '';
    const cleanDesc = currentDesc.replace(/\[STORE:[^\]]+\]\s*/, '');
    dbVehicleData.description = `[STORE:${vehicleData.consignmentStore}]${cleanDesc ? ' ' + cleanDesc : ''}`;
  }

  console.log('mapFormToDbData - final dbVehicleData:', dbVehicleData);
  console.log('mapFormToDbData - final category being sent to DB:', dbVehicleData.category);
  
  return dbVehicleData;
};
