
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Vehicle {
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
  min_negotiable?: number;
  carfax_price?: number;
  mmr_value?: number;
  description?: string;
  category: 'forSale' | 'sold';
  title_type?: 'clean-title' | 'rebuilt';
  title_status?: 'em-maos' | 'em-transito';
  photos: string[];
  video?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  image_url?: string;
}

interface UseVehiclesOptions {
  category?: 'forSale' | 'sold';
  limit?: number;
  searchTerm?: string;
}

export const useVehiclesOptimized = (options: UseVehiclesOptions = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { category, limit = 20, searchTerm } = options;

  const fetchVehicles = async (offset = 0) => {
    try {
      console.log('Fetching vehicles with options:', { category, limit, offset, searchTerm });
      
      let query = supabase
        .from('vehicles')
        .select('*');

      // Filtrar por categoria se especificado
      if (category) {
        query = query.eq('category', category);
      }

      // Adicionar busca por termo se especificado
      if (searchTerm && searchTerm.length > 0) {
        query = query.or(`name.ilike.%${searchTerm}%,internal_code.ilike.%${searchTerm}%,vin.ilike.%${searchTerm}%`);
      }

      // Adicionar paginação
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching vehicles:', error);
        throw error;
      }
      
      // Adicionar image_url baseado na primeira foto
      const vehiclesWithImages = (data || []).map(vehicle => ({
        ...vehicle,
        image_url: vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : null
      }));

      console.log('Vehicles fetched successfully:', vehiclesWithImages.length, 'vehicles');
      
      if (offset === 0) {
        setVehicles(vehiclesWithImages);
      } else {
        setVehicles(prev => [...prev, ...vehiclesWithImages]);
      }

      setHasMore(vehiclesWithImages.length === limit);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar veículos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoizar veículos para venda especificamente para a calculadora
  const forSaleVehicles = useMemo(() => {
    return vehicles.filter(v => v.category === 'forSale');
  }, [vehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [category, searchTerm]);

  return {
    vehicles: category === 'forSale' ? forSaleVehicles : vehicles,
    loading,
    hasMore,
    loadMore: () => fetchVehicles(vehicles.length),
    refetch: () => fetchVehicles(),
  };
};
