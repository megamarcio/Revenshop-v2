
import { TechnicalItem, DatabaseTechnicalItem } from './types';

export const transformDatabaseItem = (dbItem: DatabaseTechnicalItem): TechnicalItem => {
  return {
    id: dbItem.id,
    vehicle_id: dbItem.vehicle_id,
    name: dbItem.name,
    type: dbItem.type,
    status: dbItem.status as 'em-dia' | 'proximo-troca' | 'trocar',
    month: dbItem.month,
    year: dbItem.year,
    miles: dbItem.miles,
    extraInfo: dbItem.extra_info,
    tireBrand: dbItem.tire_brand,
    next_change: dbItem.next_change,
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at
  };
};

export const transformUpdatesForDatabase = (updates: Partial<TechnicalItem>): Record<string, any> => {
  const dbUpdates: Record<string, any> = {};
  
  // Map frontend fields to database fields
  Object.keys(updates).forEach(key => {
    const value = updates[key as keyof TechnicalItem];
    
    switch (key) {
      case 'extraInfo':
        dbUpdates.extra_info = value;
        break;
      case 'tireBrand':
        dbUpdates.tire_brand = value;
        break;
      case 'next_change':
        // Ensure date is properly formatted or null
        dbUpdates.next_change = value === '' ? null : value;
        break;
      default:
        dbUpdates[key] = value;
        break;
    }
  });
  
  return dbUpdates;
};
