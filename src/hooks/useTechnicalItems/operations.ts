
import { supabase } from '@/integrations/supabase/client';
import { TechnicalItem } from './types';
import { DEFAULT_TECHNICAL_ITEMS } from './constants';
import { transformDatabaseItem, transformUpdatesForDatabase } from './utils';

export const fetchTechnicalItems = async (vehicleId: string): Promise<TechnicalItem[]> => {
  const { data, error } = await supabase
    .from('technical_items')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('type', { ascending: true });

  if (error) {
    console.error('Error fetching technical items:', error);
    throw new Error(error.message);
  }

  return (data || []).map(transformDatabaseItem);
};

export const createDefaultTechnicalItems = async (vehicleId: string): Promise<void> => {
  const itemsToCreate = DEFAULT_TECHNICAL_ITEMS.map(item => ({
    vehicle_id: vehicleId,
    name: item.name,
    type: item.type,
    status: 'em-dia' as const
  }));

  const { error } = await supabase
    .from('technical_items')
    .insert(itemsToCreate);

  if (error) {
    console.error('Error creating default items:', error);
    throw new Error(error.message);
  }
};

export const updateTechnicalItem = async (itemId: string, updates: Partial<TechnicalItem>): Promise<void> => {
  const dbUpdates = transformUpdatesForDatabase(updates);

  const { error } = await supabase
    .from('technical_items')
    .update(dbUpdates)
    .eq('id', itemId);

  if (error) {
    console.error('Error updating item:', error);
    throw new Error(error.message);
  }
};
