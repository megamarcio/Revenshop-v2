
import { Vehicle } from '../types';

export const mapDbDataToAppData = (dbVehicle: any): Vehicle => {
  console.log('mapDbDataToAppData - input dbVehicle:', dbVehicle);
  
  // Extract vehicle usage from description
  let vehicleUsage = 'personal';
  let consignmentStore = '';
  
  if (dbVehicle.description) {
    const usageMatch = dbVehicle.description.match(/\[USAGE:([^\]]+)\]/);
    if (usageMatch) {
      vehicleUsage = usageMatch[1];
    }
    
    const storeMatch = dbVehicle.description.match(/\[STORE:([^\]]+)\]/);
    if (storeMatch) {
      consignmentStore = storeMatch[1];
    }
  }
  
  // Clean description by removing usage and store tags
  let cleanDescription = dbVehicle.description || '';
  cleanDescription = cleanDescription.replace(/\[USAGE:[^\]]+\]/g, '').replace(/\[STORE:[^\]]+\]/g, '').trim();
  
  const mappedVehicle: Vehicle = {
    id: dbVehicle.id,
    name: dbVehicle.name,
    vin: dbVehicle.vin,
    year: dbVehicle.year,
    model: dbVehicle.model,
    miles: dbVehicle.miles,
    internal_code: dbVehicle.internal_code,
    color: dbVehicle.color,
    
    // Novos campos mapeados
    plate: dbVehicle.plate,
    sunpass: dbVehicle.sunpass,
    
    purchase_price: dbVehicle.purchase_price,
    sale_price: dbVehicle.sale_price,
    profit_margin: dbVehicle.profit_margin || 0,
    min_negotiable: dbVehicle.min_negotiable,
    carfax_price: dbVehicle.carfax_price,
    mmr_value: dbVehicle.mmr_value,
    description: cleanDescription,
    category: dbVehicle.category,
    consignment_store: consignmentStore,
    photos: dbVehicle.photos || [],
    video: dbVehicle.video,
    created_at: dbVehicle.created_at,
    updated_at: dbVehicle.updated_at,
    created_by: dbVehicle.created_by,
    title_type_id: dbVehicle.title_type_id,
    title_location_id: dbVehicle.title_location_id,
    title_location_custom: dbVehicle.title_location_custom,
    
    // Financing fields
    financing_bank: dbVehicle.financing_bank,
    financing_type: dbVehicle.financing_type,
    original_financed_name: dbVehicle.original_financed_name,
    purchase_date: dbVehicle.purchase_date,
    due_date: dbVehicle.due_date,
    installment_value: dbVehicle.installment_value,
    down_payment: dbVehicle.down_payment,
    financed_amount: dbVehicle.financed_amount,
    total_installments: dbVehicle.total_installments,
    paid_installments: dbVehicle.paid_installments,
    remaining_installments: dbVehicle.remaining_installments,
    total_to_pay: dbVehicle.total_to_pay,
    payoff_value: dbVehicle.payoff_value,
    payoff_date: dbVehicle.payoff_date,
    interest_rate: dbVehicle.interest_rate,
    custom_financing_bank: dbVehicle.custom_financing_bank,
    
    // Extended category info for usage
    extended_category: vehicleUsage as 'rental' | 'maintenance' | 'consigned' | undefined
  };
  
  console.log('mapDbDataToAppData - output mappedVehicle:', mappedVehicle);
  return mappedVehicle;
};
