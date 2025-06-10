
import { useState, useEffect } from 'react';
import { TechnicalItem } from './types';
import { fetchTechnicalItems, createDefaultTechnicalItems, updateTechnicalItem } from './operations';

export type { TechnicalItem } from './types';

export const useTechnicalItems = (vehicleId?: string) => {
  const [items, setItems] = useState<TechnicalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!vehicleId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchTechnicalItems(vehicleId);
      setItems(data);
    } catch (err) {
      console.error('Error loading technical items:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado ao carregar itens técnicos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultItems = async () => {
    if (!vehicleId) {
      console.warn('Cannot create items without vehicleId');
      return;
    }

    try {
      setLoading(true);
      await createDefaultTechnicalItems(vehicleId);
      await fetchItems();
    } catch (err) {
      console.error('Error creating default items:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar itens padrão');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<TechnicalItem>) => {
    try {
      await updateTechnicalItem(itemId, updates);
      
      // Update local state
      setItems(current => 
        current.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      );
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar item');
    }
  };

  const refresh = async () => {
    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, [vehicleId]);

  return {
    items,
    loading,
    error,
    createDefaultItems,
    updateItem,
    refresh
  };
};
