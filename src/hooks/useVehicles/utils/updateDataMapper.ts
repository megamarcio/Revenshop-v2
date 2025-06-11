
export const mapUpdateDataToDbData = (vehicleData: Partial<any>) => {
  console.log('mapUpdateDataToDbData - input:', vehicleData);
  
  const dbUpdateData: any = {};
  
  if (vehicleData.name) dbUpdateData.name = vehicleData.name;
  if (vehicleData.vin) dbUpdateData.vin = vehicleData.vin;
  if (vehicleData.year) dbUpdateData.year = parseInt(vehicleData.year);
  if (vehicleData.model) dbUpdateData.model = vehicleData.model;
  if (vehicleData.miles !== undefined) dbUpdateData.miles = parseInt(vehicleData.miles) || 0;
  if (vehicleData.internalCode) dbUpdateData.internal_code = vehicleData.internalCode;
  if (vehicleData.color !== undefined) {
    dbUpdateData.color = vehicleData.color || null;
    console.log('mapUpdateDataToDbData - color being updated:', dbUpdateData.color);
  }
  if (vehicleData.caNote) dbUpdateData.ca_note = parseInt(vehicleData.caNote);
  if (vehicleData.purchasePrice) dbUpdateData.purchase_price = parseFloat(vehicleData.purchasePrice);
  if (vehicleData.salePrice) dbUpdateData.sale_price = parseFloat(vehicleData.salePrice);
  if (vehicleData.minNegotiable !== undefined) dbUpdateData.min_negotiable = vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null;
  if (vehicleData.carfaxPrice !== undefined) dbUpdateData.carfax_price = vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null;
  if (vehicleData.mmrValue !== undefined) dbUpdateData.mmr_value = vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null;
  
  // Campos de financiamento - corrigido o campo due_date para ser string
  if (vehicleData.financingBank !== undefined) dbUpdateData.financing_bank = vehicleData.financingBank || null;
  if (vehicleData.financingType !== undefined) dbUpdateData.financing_type = vehicleData.financingType || null;
  if (vehicleData.originalFinancedName !== undefined) dbUpdateData.original_financed_name = vehicleData.originalFinancedName || null;
  if (vehicleData.purchaseDate !== undefined) dbUpdateData.purchase_date = vehicleData.purchaseDate || null;
  if (vehicleData.dueDate !== undefined) dbUpdateData.due_date = vehicleData.dueDate || null; // Mantém como string
  if (vehicleData.installmentValue !== undefined) dbUpdateData.installment_value = vehicleData.installmentValue ? parseFloat(vehicleData.installmentValue) : null;
  if (vehicleData.downPayment !== undefined) dbUpdateData.down_payment = vehicleData.downPayment ? parseFloat(vehicleData.downPayment) : null;
  if (vehicleData.financedAmount !== undefined) dbUpdateData.financed_amount = vehicleData.financedAmount ? parseFloat(vehicleData.financedAmount) : null;
  if (vehicleData.totalInstallments !== undefined) dbUpdateData.total_installments = vehicleData.totalInstallments ? parseInt(vehicleData.totalInstallments) : null;
  if (vehicleData.paidInstallments !== undefined) dbUpdateData.paid_installments = vehicleData.paidInstallments ? parseInt(vehicleData.paidInstallments) : null;
  if (vehicleData.remainingInstallments !== undefined) dbUpdateData.remaining_installments = vehicleData.remainingInstallments ? parseInt(vehicleData.remainingInstallments) : null;
  if (vehicleData.totalToPay !== undefined) dbUpdateData.total_to_pay = vehicleData.totalToPay ? parseFloat(vehicleData.totalToPay) : null;
  if (vehicleData.payoffValue !== undefined) dbUpdateData.payoff_value = vehicleData.payoffValue ? parseFloat(vehicleData.payoffValue) : null;
  if (vehicleData.payoffDate !== undefined) dbUpdateData.payoff_date = vehicleData.payoffDate || null;
  if (vehicleData.interestRate !== undefined) dbUpdateData.interest_rate = vehicleData.interestRate ? parseFloat(vehicleData.interestRate) : null;
  if (vehicleData.customFinancingBank !== undefined) dbUpdateData.custom_financing_bank = vehicleData.customFinancingBank || null;
  
  // Handle category mapping
  if (vehicleData.category) {
    if (vehicleData.category === 'sold') {
      dbUpdateData.category = 'sold';
      // Limpar informações de categoria estendida se estava vendido
      if (vehicleData.description !== undefined) {
        const cleanDesc = vehicleData.description.replace(/\[CATEGORY:[^\]]+\]\s*/, '');
        dbUpdateData.description = cleanDesc;
      }
    } else if (vehicleData.category === 'forSale') {
      dbUpdateData.category = 'forSale';
      // Limpar informações de categoria estendida se estava à venda
      if (vehicleData.description !== undefined) {
        const cleanDesc = vehicleData.description.replace(/\[CATEGORY:[^\]]+\]\s*/, '');
        dbUpdateData.description = cleanDesc;
      }
    } else {
      // For rental, maintenance, consigned - store as forSale in DB
      dbUpdateData.category = 'forSale';
      // Store extended category in description
      const extendedCategory = vehicleData.category;
      const currentDesc = vehicleData.description || '';
      const cleanDesc = currentDesc.replace(/\[CATEGORY:[^\]]+\]\s*/, '');
      dbUpdateData.description = `[CATEGORY:${extendedCategory}]${cleanDesc ? ' ' + cleanDesc : ''}`;
    }
  }
  
  // Handle consignment store info
  if (vehicleData.consignmentStore !== undefined && vehicleData.category === 'consigned') {
    const currentDesc = dbUpdateData.description || vehicleData.description || '';
    const cleanDesc = currentDesc.replace(/\[STORE:[^\]]+\]\s*/, '');
    dbUpdateData.description = `[STORE:${vehicleData.consignmentStore}]${cleanDesc ? ' ' + cleanDesc : ''}`;
  }
  
  // Processar informações do título
  if (vehicleData.titleInfo !== undefined) {
    console.log('Processing titleInfo for update:', vehicleData.titleInfo);
    
    if (vehicleData.titleInfo) {
      const titleParts = vehicleData.titleInfo.split('-');
      console.log('Title parts:', titleParts);
      
      // Extract title type
      if (titleParts[0] === 'clean-title' || titleParts[0] === 'rebuilt') {
        dbUpdateData.title_type = titleParts[0];
      } else {
        dbUpdateData.title_type = null;
      }
      
      // Extract title status
      if (titleParts.length > 1) {
        const statusPart = titleParts.slice(1).join('-');
        if (statusPart === 'em-maos' || statusPart === 'em-transito') {
          dbUpdateData.title_status = statusPart;
        } else {
          dbUpdateData.title_status = null;
        }
      } else {
        dbUpdateData.title_status = null;
      }
    } else {
      dbUpdateData.title_type = null;
      dbUpdateData.title_status = null;
    }
    
    console.log('Title data being saved:', { 
      title_type: dbUpdateData.title_type, 
      title_status: dbUpdateData.title_status 
    });
  }

  console.log('mapUpdateDataToDbData - output:', dbUpdateData);
  return dbUpdateData;
};
