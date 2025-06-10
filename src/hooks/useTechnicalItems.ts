
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TechnicalItem {
  id: string;
  vehicle_id: string;
  name: string;
  type: string;
  status: 'em-dia' | 'proximo-troca' | 'trocar';
  month?: string;
  year?: string;
  miles?: string;
  extraInfo?: string;
  tireBrand?: string;
  next_change?: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_TECHNICAL_ITEMS = [
  // Óleo e Lubrificação
  { name: 'Óleo do Motor', type: 'oil' },
  { name: 'Filtro de Óleo', type: 'oil' },
  { name: 'Óleo da Transmissão', type: 'oil' },
  { name: 'Óleo do Diferencial', type: 'oil' },
  
  // Sistema Elétrico
  { name: 'Bateria', type: 'electrical' },
  { name: 'Alternador', type: 'electrical' },
  { name: 'Motor de Partida', type: 'electrical' },
  
  // Filtros
  { name: 'Filtro de Ar', type: 'filter' },
  { name: 'Filtro de Combustível', type: 'filter' },
  { name: 'Filtro do Ar Condicionado', type: 'filter' },
  
  // Sistema de Freios
  { name: 'Pastilhas Dianteiras', type: 'brakes' },
  { name: 'Pastilhas Traseiras', type: 'brakes' },
  { name: 'Discos de Freio', type: 'brakes' },
  { name: 'Fluido de Freio', type: 'brakes' },
  
  // Suspensão
  { name: 'Amortecedores Dianteiros', type: 'suspension' },
  { name: 'Amortecedores Traseiros', type: 'suspension' },
  { name: 'Molas', type: 'suspension' },
  
  // Fluidos
  { name: 'Fluido da Direção Hidráulica', type: 'fluids' },
  { name: 'Fluido de Arrefecimento', type: 'fluids' },
  { name: 'Líquido Limpador de Para-brisa', type: 'fluids' },
  
  // Tune-up
  { name: 'Velas de Ignição', type: 'tuneup' },
  { name: 'Cabos de Vela', type: 'tuneup' },
  { name: 'Correia Dentada', type: 'tuneup' },
  
  // Pneus
  { name: 'Pneus', type: 'tires' }
];

export const useTechnicalItems = (vehicleId?: string) => {
  const [items, setItems] = useState<TechnicalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!vehicleId) {
      // Se não há veículo selecionado, apenas definir loading como false
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('technical_items')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('type', { ascending: true });

      if (error) {
        console.error('Error fetching technical items:', error);
        setError(error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar itens técnicos');
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
        setError(error.message);
      } else {
        await fetchItems();
      }
    } catch (err) {
      console.error('Unexpected error creating items:', err);
      setError('Erro ao criar itens padrão');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<TechnicalItem>) => {
    try {
      const { error } = await supabase
        .from('technical_items')
        .update(updates)
        .eq('id', itemId);

      if (error) {
        console.error('Error updating item:', error);
        setError(error.message);
      } else {
        // Update local state
        setItems(current => 
          current.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        );
      }
    } catch (err) {
      console.error('Unexpected error updating item:', err);
      setError('Erro ao atualizar item');
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
