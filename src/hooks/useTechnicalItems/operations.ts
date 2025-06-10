
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

  const items = (data || []).map(transformDatabaseItem);
  
  // Check and auto-update status based on next_change dates
  const updatedItems = items.map(item => {
    if (item.next_change) {
      const today = new Date();
      const changeDate = new Date(item.next_change);
      
      if (changeDate < today && item.status !== 'trocar') {
        // Auto-update status to 'trocar' if overdue
        updateTechnicalItem(item.id, { status: 'trocar' });
        return { ...item, status: 'trocar' as const };
      }
    }
    return item;
  });

  return updatedItems;
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
  console.log('Updating technical item:', itemId, 'with updates:', updates);
  
  const dbUpdates = transformUpdatesForDatabase(updates);
  
  console.log('Database updates:', dbUpdates);

  const { error } = await supabase
    .from('technical_items')
    .update(dbUpdates)
    .eq('id', itemId);

  if (error) {
    console.error('Error updating item:', error);
    throw new Error(error.message);
  }
  
  console.log('Successfully updated technical item');
};
