
import { TechnicalItem, DatabaseTechnicalItem } from './types';

export const transformDatabaseItem = (item: DatabaseTechnicalItem): TechnicalItem => ({
  id: item.id,
  vehicle_id: item.vehicle_id,
  name: item.name,
  type: item.type,
  status: (item.status as 'em-dia' | 'proximo-troca' | 'trocar') || 'em-dia',
  month: item.month || undefined,
  year: item.year || undefined,
  miles: item.miles || undefined,
  extraInfo: item.extra_info || undefined,
  tireBrand: item.tire_brand || undefined,
  next_change: item.next_change || undefined,
  created_at: item.created_at,
  updated_at: item.updated_at
});

export const transformUpdatesForDatabase = (updates: Partial<TechnicalItem>) => {
  const dbUpdates: any = {};
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.month !== undefined) dbUpdates.month = updates.month;
  if (updates.year !== undefined) dbUpdates.year = updates.year;
  if (updates.miles !== undefined) dbUpdates.miles = updates.miles;
  if (updates.extraInfo !== undefined) dbUpdates.extra_info = updates.extraInfo;
  if (updates.tireBrand !== undefined) dbUpdates.tire_brand = updates.tireBrand;
  if (updates.next_change !== undefined) dbUpdates.next_change = updates.next_change;
  return dbUpdates;
};
