
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
    internalCode: dbVehicle.internal_code,
    color: dbVehicle.color,
    purchasePrice: dbVehicle.purchase_price,
    salePrice: dbVehicle.sale_price,
    profitMargin: dbVehicle.profit_margin,
    minNegotiable: dbVehicle.min_negotiable,
    carfaxPrice: dbVehicle.carfax_price,
    mmrValue: dbVehicle.mmr_value,
    description: dbVehicle.description,
    category: dbVehicle.category,
    consignmentStore: dbVehicle.consignment_store,
    video: dbVehicle.video,
    photos: photos, // Usar as fotos extraídas do vehicle_photos
    
    // Title information
    titleTypeId,
    titleLocationId,
    titleLocationCustom,
    
    // Financing information
    financingBank: dbVehicle.financing_bank,
    financingType: dbVehicle.financing_type,
    originalFinancedName: dbVehicle.original_financed_name,
    purchaseDate: dbVehicle.purchase_date,
    dueDate: dbVehicle.due_date,
    installmentValue: dbVehicle.installment_value,
    downPayment: dbVehicle.down_payment,
    financedAmount: dbVehicle.financed_amount,
    totalInstallments: dbVehicle.total_installments,
    paidInstallments: dbVehicle.paid_installments,
    remainingInstallments: dbVehicle.remaining_installments,
    totalToPay: dbVehicle.total_to_pay,
    payoffValue: dbVehicle.payoff_value,
    payoffDate: dbVehicle.payoff_date,
    interestRate: dbVehicle.interest_rate,
    customFinancingBank: dbVehicle.custom_financing_bank,
    
    // Sale information
    seller: dbVehicle.seller,
    finalSalePrice: dbVehicle.final_sale_price,
    
    // Metadata
    createdAt: dbVehicle.created_at,
    updatedAt: dbVehicle.updated_at,
    createdBy: dbVehicle.created_by
  };

  return mapped;
};
