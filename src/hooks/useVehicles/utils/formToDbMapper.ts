
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
