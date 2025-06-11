
import { Vehicle } from '../types';
import { extractExtendedCategory, extractConsignmentStore, cleanDescription } from './descriptionUtils';

// Helper function to map database data back to our application format
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
    titleInfo: titleInfo, // Add the reconstructed titleInfo field
    
    // Map financing fields from snake_case to camelCase
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
    custom_financing_bank: dbVehicle.custom_financing_bank
  };
  
  console.log('mapDbDataToAppData - output:', mappedVehicle);
  return mappedVehicle;
};
