
import { supabase } from '@/integrations/supabase/client';

export const mapFormDataToDbData = async (vehicleData: any) => {
  console.log('mapFormDataToDbData - input:', vehicleData);
  
  // Map our extended categories to database enum values
  let dbCategory: 'forSale' | 'sold' = 'forSale';
  let extendedCategory: string | null = null;
  
  if (vehicleData.category === 'sold') {
    dbCategory = 'sold';
  } else if (vehicleData.category === 'forSale') {
    dbCategory = 'forSale';
  } else {
    // For rental, maintenance, consigned - store as forSale in DB but track extended category
    dbCategory = 'forSale';
    extendedCategory = vehicleData.category;
  }

  // Process title information - save combined format
  let titleType = null;
  let titleStatus = null;
  
  if (vehicleData.titleInfo) {
    console.log('Processing titleInfo:', vehicleData.titleInfo);
    const titleParts = vehicleData.titleInfo.split('-');
    
    // Extract title type
    if (titleParts[0] === 'clean-title' || titleParts[0] === 'rebuilt') {
      titleType = titleParts[0];
    }
    
    // Extract title status if present
    if (titleParts.length > 1) {
      const statusPart = titleParts.slice(1).join('-');
      if (statusPart === 'em-maos' || statusPart === 'em-transito') {
        titleStatus = statusPart;
      }
    }
  }

  // Preparar dados básicos
  const baseData = {
    name: vehicleData.name,
    vin: vehicleData.vin,
    year: parseInt(vehicleData.year),
    model: vehicleData.model,
    miles: parseInt(vehicleData.miles) || 0,
    internal_code: vehicleData.internalCode,
    color: vehicleData.color || null,
    ca_note: parseInt(vehicleData.caNote),
    purchase_price: parseFloat(vehicleData.purchasePrice),
    sale_price: parseFloat(vehicleData.salePrice),
    min_negotiable: vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null,
    carfax_price: vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null,
    mmr_value: vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null,
    description: vehicleData.description || null,
    category: dbCategory,
    title_type: titleType,
    title_status: titleStatus,
    created_by: (await supabase.auth.getUser()).data.user?.id || null,
    
    // Campos de financiamento - corrigido o campo due_date para ser string
    financing_bank: vehicleData.financingBank || null,
    financing_type: vehicleData.financingType || null,
    original_financed_name: vehicleData.originalFinancedName || null,
    purchase_date: vehicleData.purchaseDate || null,
    due_date: vehicleData.dueDate || null, // Mantém como string (dia do mês)
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
    custom_financing_bank: vehicleData.customFinancingBank || null
  };

  console.log('mapFormDataToDbData - color being saved:', baseData.color);

  // Adicionar categoria estendida na descrição se necessário
  if (extendedCategory) {
    const currentDesc = baseData.description || '';
    baseData.description = `[CATEGORY:${extendedCategory}]${currentDesc ? ' ' + currentDesc : ''}`;
  }

  // Adicionar informações de consignação na descrição se necessário
  if (vehicleData.consignmentStore && vehicleData.category === 'consigned') {
    const currentDesc = baseData.description || '';
    const cleanDesc = currentDesc.replace(/\[STORE:[^\]]+\]\s*/, '');
    baseData.description = `[STORE:${vehicleData.consignmentStore}]${cleanDesc ? ' ' + cleanDesc : ''}`;
  }

  console.log('mapFormDataToDbData - output:', baseData);
  return baseData;
};

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
