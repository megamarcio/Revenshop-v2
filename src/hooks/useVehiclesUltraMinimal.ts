
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehicleUltraMinimal {
  id: string;
  name: string;
  vin: string;
  sale_price: number;
  main_photo_url?: string;
}

interface UseVehiclesUltraMinimalOptions {
  category?: 'forSale' | 'sold';
  limit?: number;
  searchTerm?: string;
}

export const useVehiclesUltraMinimal = (options: UseVehiclesUltraMinimalOptions = {}) => {
  const [vehicles, setVehicles] = useState<VehicleUltraMinimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { category = 'forSale', limit = 20, searchTerm } = options;

  const fetchVehicles = useCallback(async (offset = 0) => {
    try {
      console.log('Fetching ultra minimal vehicles with options:', { category, limit, offset, searchTerm });
      
      // Query ultra otimizada - apenas campos essenciais, sem relacionamentos
      let query = supabase
        .from('vehicles')
        .select('id, name, vin, sale_price')
        .order('created_at', { ascending: false });

      // Filtrar por categoria se especificado
      if (category) {
        query = query.eq('category', category);
      }

      // Adicionar busca por termo se especificado
      if (searchTerm && searchTerm.length > 0) {
        query = query.or(`name.ilike.%${searchTerm}%,internal_code.ilike.%${searchTerm}%,vin.ilike.%${searchTerm}%`);
      }

      // Adicionar paginação
      query = query.range(offset, offset + limit - 1);

      const { data: vehiclesData, error } = await query;

      if (error) {
        console.error('Supabase error fetching ultra minimal vehicles:', error);
        throw error;
      }

      if (!vehiclesData) {
        setVehicles([]);
        setHasMore(false);
        return;
      }

      // Criar os objetos VehicleUltraMinimal - sem processamento de fotos
      const vehiclesUltraMinimal = vehiclesData.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        vin: vehicle.vin,
        sale_price: vehicle.sale_price,
        main_photo_url: undefined, // Sem fotos por enquanto
      } as VehicleUltraMinimal));

      console.log('Ultra minimal vehicles fetched successfully:', vehiclesUltraMinimal.length, 'vehicles');
      
      if (offset === 0) {
        setVehicles(vehiclesUltraMinimal);
      } else {
        setVehicles(prev => [...prev, ...vehiclesUltraMinimal]);
      }

      setHasMore(vehiclesUltraMinimal.length === limit);
    } catch (error) {
      console.error('Error fetching ultra minimal vehicles:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar veículos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [category, limit, searchTerm]);

  const loadMore = useCallback(() => {
    fetchVehicles(vehicles.length);
  }, [fetchVehicles, vehicles.length]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    hasMore,
    loadMore,
    refetch,
  };
};
