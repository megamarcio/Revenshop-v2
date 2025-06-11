
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehicleUltraMinimal {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number;
  internal_code: string;
  color: string;
  ca_note: number;
  purchase_price: number;
  sale_price: number;
  profit_margin: number;
  min_negotiable: number;
  carfax_price: number;
  mmr_value: number;
  description: string;
  category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
  title_type?: 'clean-title' | 'rebuilt';
  title_status?: 'em-maos' | 'em-transito';
  created_at: string;
  updated_at: string;
  created_by?: string;
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
      console.log('Fetching ultra minimal vehicles with complete data:', { category, limit, offset, searchTerm });
      
      // Query otimizada - todos os campos necessários, sem relacionamentos pesados
      let query = supabase
        .from('vehicles')
        .select(`
          id, 
          name, 
          vin, 
          year,
          model,
          miles,
          internal_code,
          color,
          ca_note,
          purchase_price,
          sale_price,
          profit_margin,
          min_negotiable,
          carfax_price,
          mmr_value,
          description,
          category,
          title_type,
          title_status,
          created_at,
          updated_at,
          created_by
        `)
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

      // Criar os objetos VehicleUltraMinimal com todos os dados
      const vehiclesUltraMinimal = vehiclesData.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name || '',
        vin: vehicle.vin || '',
        year: vehicle.year || 2020,
        model: vehicle.model || '',
        miles: vehicle.miles || 0,
        internal_code: vehicle.internal_code || '',
        color: vehicle.color || '',
        ca_note: vehicle.ca_note || 0,
        purchase_price: vehicle.purchase_price || 0,
        sale_price: vehicle.sale_price || 0,
        profit_margin: vehicle.profit_margin || 0,
        min_negotiable: vehicle.min_negotiable || 0,
        carfax_price: vehicle.carfax_price || 0,
        mmr_value: vehicle.mmr_value || 0,
        description: vehicle.description || '',
        category: vehicle.category || 'forSale',
        title_type: vehicle.title_type,
        title_status: vehicle.title_status,
        created_at: vehicle.created_at,
        updated_at: vehicle.updated_at,
        created_by: vehicle.created_by,
        main_photo_url: undefined, // Fotos serão carregadas sob demanda
      } as VehicleUltraMinimal));

      console.log('Ultra minimal vehicles with complete data fetched successfully:', vehiclesUltraMinimal.length, 'vehicles');
      
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
