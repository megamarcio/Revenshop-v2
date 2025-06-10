
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  minimal?: boolean;
}

export const useVehiclesOptimized = (options: UseVehiclesOptions = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { category, limit = 20, searchTerm, minimal = false } = options;

  const fetchVehicles = useCallback(async (offset = 0) => {
    try {
      console.log('Fetching vehicles with options:', { category, limit, offset, searchTerm, minimal });
      
      // Selecionar colunas baseado no tipo de consulta
      const selectColumns = minimal 
        ? 'id, name, vin, sale_price, internal_code, photos'
        : 'id, name, vin, year, model, miles, internal_code, color, ca_note, purchase_price, sale_price, profit_margin, category, photos, created_at, updated_at';

      let query = supabase
        .from('vehicles')
        .select(selectColumns)
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

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching vehicles:', error);
        throw error;
      }
      
      // Verificar se data é um array válido antes de processar
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        throw new Error('Invalid data format received from database');
      }

      // Adicionar image_url baseado na primeira foto e garantir que todos os campos necessários existam
      const vehiclesWithImages = data.map(vehicle => {
        // Verificar se vehicle é um objeto válido
        if (!vehicle || typeof vehicle !== 'object') {
          console.error('Invalid vehicle object:', vehicle);
          return null;
        }

        const baseVehicle = {
          ...vehicle,
          image_url: vehicle.photos && Array.isArray(vehicle.photos) && vehicle.photos.length > 0 ? vehicle.photos[0] : null,
        };

        // Para consultas mínimas, adicionar campos padrão
        if (minimal) {
          return {
            ...baseVehicle,
            year: 0,
            model: '',
            miles: 0,
            color: '',
            ca_note: 0,
            purchase_price: 0,
            profit_margin: 0,
            category: category || 'forSale' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } else {
          return {
            ...baseVehicle,
            updated_at: vehicle.updated_at || vehicle.created_at || new Date().toISOString()
          };
        }
      }).filter(vehicle => vehicle !== null) as Vehicle[];

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
  }, [category, limit, searchTerm, minimal]);

  // Memoizar veículos para venda especificamente para a calculadora
  const forSaleVehicles = useMemo(() => {
    return vehicles.filter(v => v.category === 'forSale');
  }, [vehicles]);

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
    vehicles: category === 'forSale' ? forSaleVehicles : vehicles,
    loading,
    hasMore,
    loadMore,
    refetch,
  };
};
