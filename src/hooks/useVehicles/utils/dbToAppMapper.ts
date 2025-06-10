
import { Vehicle } from '../types';
import { extractExtendedCategory, extractConsignmentStore, cleanDescription } from './descriptionUtils';

// Helper function to map database data back to our application format - CORRIGIDO
export const mapDbDataToAppData = (dbVehicle: any): Vehicle => {
  console.log('mapDbDataToAppData - input:', dbVehicle);
  
  const extendedCategory = extractExtendedCategory(dbVehicle.description || '');
  const consignmentStore = extractConsignmentStore(dbVehicle.description || '');
  const cleanDesc = cleanDescription(dbVehicle.description || '');
  
  // Reconstruct titleInfo from separate database fields
  let titleInfo = '';
  if (dbVehicle.title_type) {
    titleInfo = dbVehicle.title_type;
    if (dbVehicle.title_status) {
      titleInfo += `-${dbVehicle.title_status}`;
    }
  }
  
  console.log('mapDbDataToAppData - reconstructed titleInfo:', titleInfo, 'from fields:', {
    title_type: dbVehicle.title_type,
    title_status: dbVehicle.title_status
  });
  
  // Mapear corretamente os campos do banco para o formato da aplicação
  const mappedVehicle = {
    id: dbVehicle.id,
    name: dbVehicle.name || '',
    vin: dbVehicle.vin || '',
    year: dbVehicle.year || 0,
    model: dbVehicle.model || '',
    miles: dbVehicle.miles || 0, // Este é o campo correto no banco
    internal_code: dbVehicle.internal_code || '',
    color: dbVehicle.color || '',
    ca_note: dbVehicle.ca_note || 0,
    purchase_price: dbVehicle.purchase_price || 0,
    sale_price: dbVehicle.sale_price || 0,
    profit_margin: dbVehicle.profit_margin || 0,
    min_negotiable: dbVehicle.min_negotiable,
    carfax_price: dbVehicle.carfax_price,
    mmr_value: dbVehicle.mmr_value,
    description: cleanDesc,
    category: extendedCategory || dbVehicle.category || 'forSale',
    title_type: dbVehicle.title_type,
    title_status: dbVehicle.title_status,
    photos: dbVehicle.photos || [],
    video: dbVehicle.video,
    created_at: dbVehicle.created_at,
    updated_at: dbVehicle.updated_at,
    created_by: dbVehicle.created_by,
    extended_category: extendedCategory || null,
    consignment_store: consignmentStore || null,
    titleInfo: titleInfo, // Add the reconstructed titleInfo field
    // Adicionar aliases para compatibilidade
    plate: dbVehicle.miles?.toString() || '0', // Alias para milhas no formulário
    internalCode: dbVehicle.internal_code || '',
    caNote: dbVehicle.ca_note?.toString() || '0',
    purchasePrice: dbVehicle.purchase_price?.toString() || '0',
    salePrice: dbVehicle.sale_price?.toString() || '0',
    minNegotiable: dbVehicle.min_negotiable?.toString() || '',
    carfaxPrice: dbVehicle.carfax_price?.toString() || '',
    mmrValue: dbVehicle.mmr_value?.toString() || ''
  };
  
  console.log('mapDbDataToAppData - output:', mappedVehicle);
  return mappedVehicle;
};
