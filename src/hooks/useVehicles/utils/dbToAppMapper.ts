
import { Vehicle } from '../types';
import { mapVehiclePhotosToArray } from './vehiclePhotosMapper';
import { extractExtendedCategory, extractConsignmentStore, cleanDescription } from './descriptionUtils';

export const mapDbDataToAppData = (dbVehicle: any) => {
  console.log('mapDbDataToAppData - input dbVehicle:', dbVehicle);
  console.log('mapDbDataToAppData - title fields from DB:', {
    title_type_id: dbVehicle.title_type_id,
    title_location_id: dbVehicle.title_location_id,
    title_location_custom: dbVehicle.title_location_custom,
    title_types: dbVehicle.title_types,
    title_locations: dbVehicle.title_locations
  });

  const mappedVehicle: any = {
    id: dbVehicle.id,
    name: dbVehicle.name,
    vin: dbVehicle.vin,
    year: dbVehicle.year,
    model: dbVehicle.model,
    miles: dbVehicle.miles,
    internalCode: dbVehicle.internal_code,
    color: dbVehicle.color,
    purchasePrice: dbVehicle.purchase_price,
    salePrice: dbVehicle.sale_price,
    profitMargin: dbVehicle.profit_margin || 0,
    minNegotiable: dbVehicle.min_negotiable || 0,
    carfaxPrice: dbVehicle.carfax_price || 0,
    mmrValue: dbVehicle.mmr_value || 0,
    description: cleanDescription(dbVehicle.description || ''),
    category: dbVehicle.category,
    
    // Mapeamento correto dos campos de título
    titleTypeId: dbVehicle.title_type_id || '',
    titleLocationId: dbVehicle.title_location_id || '',
    titleLocationCustom: dbVehicle.title_location_custom || '',
    
    // Campos de financiamento
    financingBank: dbVehicle.financing_bank || '',
    financingType: dbVehicle.financing_type || '',
    originalFinancedName: dbVehicle.original_financed_name || '',
    purchaseDate: dbVehicle.purchase_date || '',
    dueDate: dbVehicle.due_date || '',
    installmentValue: dbVehicle.installment_value || 0,
    downPayment: dbVehicle.down_payment || 0,
    financedAmount: dbVehicle.financed_amount || 0,
    totalInstallments: dbVehicle.total_installments || 0,
    paidInstallments: dbVehicle.paid_installments || 0,
    remainingInstallments: dbVehicle.remaining_installments || 0,
    totalToPay: dbVehicle.total_to_pay || 0,
    payoffValue: dbVehicle.payoff_value || 0,
    payoffDate: dbVehicle.payoff_date || '',
    interestRate: dbVehicle.interest_rate || 0,
    customFinancingBank: dbVehicle.custom_financing_bank || '',
    
    // Outros campos
    consignmentStore: extractConsignmentStore(dbVehicle.description || ''),
    seller: dbVehicle.seller || '',
    finalSalePrice: dbVehicle.final_sale_price || 0,
    photos: mapVehiclePhotosToArray(dbVehicle.vehicle_photos || []),
    video: dbVehicle.video || null,
    
    // Preservar campos relacionados se existirem
    title_types: dbVehicle.title_types,
    title_locations: dbVehicle.title_locations
  };

  console.log('mapDbDataToAppData - mapped titleTypeId:', mappedVehicle.titleTypeId);
  console.log('mapDbDataToAppData - mapped titleLocationId:', mappedVehicle.titleLocationId);
  console.log('mapDbDataToAppData - mapped titleLocationCustom:', mappedVehicle.titleLocationCustom);

  return mappedVehicle;
};
