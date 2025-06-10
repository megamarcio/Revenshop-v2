
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TechnicalItem } from '../components/Maintenance/TechnicalPanel/types';

export const useTechnicalItems = (vehicleId?: string) => {
  const [items, setItems] = useState<TechnicalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehicleId) {
      loadTechnicalItems();
    }
  }, [vehicleId]);

  const loadTechnicalItems = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technical_items')
        .select('*')
        .eq('vehicle_id', vehicleId);

      if (error) {
        console.error('Erro ao carregar itens técnicos:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar itens técnicos',
          variant: 'destructive'
        });
        return;
      }

      const formattedItems: TechnicalItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        icon: getIconForType(item.type),
        month: item.month || '',
        year: item.year || '',
        miles: item.miles || '',
        nextChange: item.next_change || '',
        status: item.status as 'em-dia' | 'proximo-troca' | 'trocar',
        type: item.type as TechnicalItem['type'],
        extraInfo: item.extra_info || '',
        tireBrand: item.tire_brand || ''
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Erro ao carregar itens técnicos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar itens técnicos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<TechnicalItem>) => {
    try {
      const dbUpdates: any = {};
      if (updates.month !== undefined) dbUpdates.month = updates.month;
      if (updates.year !== undefined) dbUpdates.year = updates.year;
      if (updates.miles !== undefined) dbUpdates.miles = updates.miles;
      if (updates.nextChange !== undefined) dbUpdates.next_change = updates.nextChange;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.extraInfo !== undefined) dbUpdates.extra_info = updates.extraInfo;
      if (updates.tireBrand !== undefined) dbUpdates.tire_brand = updates.tireBrand;

      const { error } = await supabase
        .from('technical_items')
        .update(dbUpdates)
        .eq('id', itemId);

      if (error) {
        console.error('Erro ao atualizar item técnico:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar item técnico',
          variant: 'destructive'
        });
        return;
      }

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));

      toast({
        title: 'Sucesso',
        description: 'Item técnico atualizado com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao atualizar item técnico:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar item técnico',
        variant: 'destructive'
      });
    }
  };

  const createDefaultItems = async () => {
    if (!vehicleId) return;

    const defaultItems = [
      { name: 'Óleo do Motor', type: 'oil' },
      { name: 'Filtro de Óleo', type: 'filter' },
      { name: 'Filtro de Ar', type: 'filter' },
      { name: 'Bateria', type: 'electrical' },
      { name: 'Pastilhas de Freio', type: 'brakes' },
      { name: 'Fluido de Freio', type: 'fluids' },
      { name: 'Amortecedores', type: 'suspension' },
      { name: 'Pneus', type: 'tires' }
    ];

    try {
      const { error } = await supabase
        .from('technical_items')
        .insert(
          defaultItems.map(item => ({
            vehicle_id: vehicleId,
            name: item.name,
            type: item.type,
            status: 'em-dia'
          }))
        );

      if (error) {
        console.error('Erro ao criar itens padrão:', error);
        return;
      }

      await loadTechnicalItems();
    } catch (error) {
      console.error('Erro ao criar itens padrão:', error);
    }
  };

  return {
    items,
    loading,
    updateItem,
    createDefaultItems,
    refresh: loadTechnicalItems
  };
};

// Função auxiliar para mapear tipos para ícones
const getIconForType = (type: string) => {
  // Como não podemos importar os ícones aqui diretamente, 
  // retornamos o Wrench como padrão e deixamos o componente decidir
  const { Wrench } = require('lucide-react');
  return Wrench;
};
