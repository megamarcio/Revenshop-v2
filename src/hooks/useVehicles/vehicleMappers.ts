
import { supabase } from '@/integrations/supabase/client';

export const mapFormDataToDbData = async (vehicleData: any) => {
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

  return {
    name: vehicleData.name,
    vin: vehicleData.vin,
    year: parseInt(vehicleData.year),
    model: vehicleData.model,
    miles: parseInt(vehicleData.plate), // O formulário usa 'plate' para milhas
    internal_code: vehicleData.internalCode,
    color: vehicleData.color,
    ca_note: parseInt(vehicleData.caNote),
    purchase_price: parseFloat(vehicleData.purchasePrice),
    sale_price: parseFloat(vehicleData.salePrice),
    min_negotiable: vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null,
    carfax_price: vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null,
    mmr_value: vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null,
    description: vehicleData.description || null,
    category: dbCategory,
    consignment_store: vehicleData.consignmentStore || null,
    title_type: vehicleData.titleInfo?.split('-')[0] === 'clean-title' ? 'clean-title' as const : 
               vehicleData.titleInfo?.split('-')[0] === 'rebuilt' ? 'rebuilt' as const : null,
    title_status: vehicleData.titleInfo?.includes('em-maos') ? 'em-maos' as const :
                 vehicleData.titleInfo?.includes('em-transito') ? 'em-transito' as const : null,
    photos: vehicleData.photos || [],
    video: vehicleData.video || null,
    created_by: (await supabase.auth.getUser()).data.user?.id || null,
    // Store extended category in description or use a JSON field approach
    ...(extendedCategory && {
      description: `[CATEGORY:${extendedCategory}]${vehicleData.description ? ' ' + vehicleData.description : ''}`
    })
  };
};

export const mapUpdateDataToDbData = (vehicleData: Partial<any>) => {
  const dbUpdateData: any = {};
  
  if (vehicleData.name) dbUpdateData.name = vehicleData.name;
  if (vehicleData.vin) dbUpdateData.vin = vehicleData.vin;
  if (vehicleData.year) dbUpdateData.year = parseInt(vehicleData.year);
  if (vehicleData.model) dbUpdateData.model = vehicleData.model;
  if (vehicleData.plate) dbUpdateData.miles = parseInt(vehicleData.plate);
  if (vehicleData.internalCode) dbUpdateData.internal_code = vehicleData.internalCode;
  if (vehicleData.color) dbUpdateData.color = vehicleData.color;
  if (vehicleData.caNote) dbUpdateData.ca_note = parseInt(vehicleData.caNote);
  if (vehicleData.purchasePrice) dbUpdateData.purchase_price = parseFloat(vehicleData.purchasePrice);
  if (vehicleData.salePrice) dbUpdateData.sale_price = parseFloat(vehicleData.salePrice);
  if (vehicleData.minNegotiable !== undefined) dbUpdateData.min_negotiable = vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null;
  if (vehicleData.carfaxPrice !== undefined) dbUpdateData.carfax_price = vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null;
  if (vehicleData.mmrValue !== undefined) dbUpdateData.mmr_value = vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null;
  if (vehicleData.description !== undefined) dbUpdateData.description = vehicleData.description;
  
  // Handle category mapping
  if (vehicleData.category) {
    if (vehicleData.category === 'sold') {
      dbUpdateData.category = 'sold';
    } else if (vehicleData.category === 'forSale') {
      dbUpdateData.category = 'forSale';
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
  
  if (vehicleData.consignmentStore !== undefined) dbUpdateData.consignment_store = vehicleData.consignmentStore || null;
  
  // Processar informações do título
  if (vehicleData.titleInfo !== undefined) {
    console.log('Processing titleInfo:', vehicleData.titleInfo);
    
    if (vehicleData.titleInfo) {
      const titleParts = vehicleData.titleInfo.split('-');
      console.log('Title parts:', titleParts);
      
      if (titleParts[0] === 'clean-title' || titleParts[0] === 'rebuilt') {
        dbUpdateData.title_type = titleParts[0];
      } else {
        dbUpdateData.title_type = null;
      }
      
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
  }
  
  if (vehicleData.photos !== undefined) {
    dbUpdateData.photos = vehicleData.photos || [];
  }
  
  if (vehicleData.video !== undefined) {
    dbUpdateData.video = vehicleData.video || null;
  }

  return dbUpdateData;
};

// Helper function to extract extended category from description
export const extractExtendedCategory = (description: string): string => {
  const match = description?.match(/\[CATEGORY:([^\]]+)\]/);
  return match ? match[1] : '';
};

// Helper function to map database data back to our application format
export const mapDbDataToAppData = (dbVehicle: any): any => {
  const extendedCategory = extractExtendedCategory(dbVehicle.description || '');
  const cleanDescription = dbVehicle.description?.replace(/\[CATEGORY:[^\]]+\]\s*/, '') || '';
  
  return {
    ...dbVehicle,
    category: extendedCategory || dbVehicle.category,
    description: cleanDescription,
    extended_category: extendedCategory || null
  };
};
