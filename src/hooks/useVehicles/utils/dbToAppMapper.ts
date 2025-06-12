
import { Vehicle } from '../types';

export const mapDbDataToAppData = (dbVehicle: any): Vehicle => {
  console.log('mapDbDataToAppData - input dbVehicle:', dbVehicle);
  
  // Extrair URLs das fotos do array vehicle_photos
  const photos = dbVehicle.vehicle_photos?.map((photo: any) => photo.url) || [];
  
  console.log('mapDbDataToAppData - extracted photos:', photos);
  
  // Extract title information
  const titleFields = {
    title_type_id: dbVehicle.title_type_id,
    title_location_id: dbVehicle.title_location_id,
    title_location_custom: dbVehicle.title_location_custom,
    title_types: dbVehicle.title_types,
    title_locations: dbVehicle.title_locations
  };
  
  console.log('mapDbDataToAppData - title fields from DB:', titleFields);
  
  const titleTypeId = dbVehicle.title_types?.id?.toString() || dbVehicle.title_type_id?.toString() || '';
  const titleLocationId = dbVehicle.title_locations?.id?.toString() || dbVehicle.title_location_id?.toString() || '';
  const titleLocationCustom = dbVehicle.title_location_custom || '';
  
  console.log('mapDbDataToAppData - mapped titleTypeId:', titleTypeId);
  console.log('mapDbDataToAppData - mapped titleLocationId:', titleLocationId);
  console.log('mapDbDataToAppData - mapped titleLocationCustom:', titleLocationCustom);

  const mapped: Vehicle = {
    id: dbVehicle.id,
    name: dbVehicle.name,
    vin: dbVehicle.vin,
    year: dbVehicle.year,
    model: dbVehicle.model,
    miles: dbVehicle.miles,
    internal_code: dbVehicle.internal_code,
    color: dbVehicle.color,
    purchase_price: dbVehicle.purchase_price,
    sale_price: dbVehicle.sale_price,
    profit_margin: dbVehicle.profit_margin,
    min_negotiable: dbVehicle.min_negotiable,
    carfax_price: dbVehicle.carfax_price,
    mmr_value: dbVehicle.mmr_value,
    description: dbVehicle.description,
    category: dbVehicle.category,
    consignment_store: dbVehicle.consignment_store,
    video: dbVehicle.video,
    photos: photos, // Usar as fotos extraídas do vehicle_photos
    
    // Title information
    title_type_id: titleTypeId,
    title_location_id: titleLocationId,
    title_location_custom: titleLocationCustom,
    
    // Financing information
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
    
    // Sale information
    seller: dbVehicle.seller,
    final_sale_price: dbVehicle.final_sale_price,
    
    // Metadata
    created_at: dbVehicle.created_at,
    updated_at: dbVehicle.updated_at,
    created_by: dbVehicle.created_by
  };

  return mapped;
};
