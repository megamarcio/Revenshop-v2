
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

  // Preparar dados básicos - CORRIGIDO: garantir que color seja sempre salvo
  const baseData = {
    name: vehicleData.name,
    vin: vehicleData.vin,
    year: parseInt(vehicleData.year),
    model: vehicleData.model,
    miles: parseInt(vehicleData.miles) || 0,
    internal_code: vehicleData.internalCode,
    color: vehicleData.color || null, // CORRIGIDO: garantir que cor seja mapeada corretamente
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
    photos: vehicleData.photos || [],
    video: vehicleData.video || null,
    created_by: (await supabase.auth.getUser()).data.user?.id || null
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
  if (vehicleData.color !== undefined) { // CORRIGIDO: verificar se cor foi fornecida
    dbUpdateData.color = vehicleData.color || null;
    console.log('mapUpdateDataToDbData - color being updated:', dbUpdateData.color);
  }
  if (vehicleData.caNote) dbUpdateData.ca_note = parseInt(vehicleData.caNote);
  if (vehicleData.purchasePrice) dbUpdateData.purchase_price = parseFloat(vehicleData.purchasePrice);
  if (vehicleData.salePrice) dbUpdateData.sale_price = parseFloat(vehicleData.salePrice);
  if (vehicleData.minNegotiable !== undefined) dbUpdateData.min_negotiable = vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null;
  if (vehicleData.carfaxPrice !== undefined) dbUpdateData.carfax_price = vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null;
  if (vehicleData.mmrValue !== undefined) dbUpdateData.mmr_value = vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null;
  
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
  
  if (vehicleData.photos !== undefined) {
    dbUpdateData.photos = vehicleData.photos || [];
  }
  
  if (vehicleData.video !== undefined) {
    dbUpdateData.video = vehicleData.video || null;
  }

  console.log('mapUpdateDataToDbData - output:', dbUpdateData);
  return dbUpdateData;
};
