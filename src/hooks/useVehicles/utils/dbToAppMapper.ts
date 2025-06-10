
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
  
  const mappedVehicle = {
    ...dbVehicle,
    category: extendedCategory || dbVehicle.category,
    description: cleanDesc,
    extended_category: extendedCategory || null,
    consignment_store: consignmentStore || null,
    titleInfo: titleInfo // Add the reconstructed titleInfo field
  };
  
  console.log('mapDbDataToAppData - output:', mappedVehicle);
  return mappedVehicle;
};
