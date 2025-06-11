import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehicleMinimal {
  id: string;
  name: string;
  vin: string;
  sale_price: number;
  internal_code: string;
  photos: string[];
  image_url?: string;
  main_photo_url?: string;
}

interface UseVehiclesMinimalOptions {
  category?: 'forSale' | 'sold';
  limit?: number;
  searchTerm?: string;
}

export const useVehiclesMinimal = (options: UseVehiclesMinimalOptions = {}) => {
  const [vehicles, setVehicles] = useState<VehicleMinimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { category = 'forSale', limit = 20, searchTerm } = options;

  const fetchVehicles = useCallback(async (offset = 0) => {
    try {
      console.log('Fetching minimal vehicles with options:', { category, limit, offset, searchTerm });
      
      // Query principal dos veículos
      let query = supabase
        .from('vehicles')
        .select(`
          id, 
          name, 
          vin, 
          sale_price, 
          internal_code,
          vehicle_photos!vehicle_photos_vehicle_id_fkey(url, position, is_main)
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
        console.error('Supabase error fetching minimal vehicles:', error);
        throw error;
      }

      if (!vehiclesData) {
        setVehicles([]);
        setHasMore(false);
        return;
      }

      // Criar os objetos VehicleMinimal com as fotos
      const vehiclesWithPhotos = vehiclesData.map(vehicle => {
        const vehiclePhotos = vehicle.vehicle_photos || [];
        const sortedPhotos = vehiclePhotos
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map(photo => photo.url);
        
        const mainPhoto = vehiclePhotos.find(photo => photo.is_main);
        const main_photo_url = mainPhoto?.url || sortedPhotos[0] || null;
        const image_url = main_photo_url;

        return {
          ...vehicle,
          photos: sortedPhotos,
          image_url,
          main_photo_url,
          vehicle_photos: undefined // Remove from final object
        } as VehicleMinimal;
      });

      console.log('Minimal vehicles fetched successfully:', vehiclesWithPhotos.length, 'vehicles');
      
      if (offset === 0) {
        setVehicles(vehiclesWithPhotos);
      } else {
        setVehicles(prev => [...prev, ...vehiclesWithPhotos]);
      }

      setHasMore(vehiclesWithPhotos.length === limit);
    } catch (error) {
      console.error('Error fetching minimal vehicles:', error);
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
