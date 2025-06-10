
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { category, limit = 10, searchTerm, minimal = false } = options;

  const fetchVehicles = useCallback(async (page = 1, reset = false) => {
    try {
      console.log('Fetching vehicles with options:', { category, limit, page, searchTerm, minimal });
      
      const offset = (page - 1) * limit;
      
      // Selecionar apenas as colunas necessárias para otimização
      const selectColumns = minimal 
        ? 'id, name, vin, sale_price, internal_code, photos'
        : 'id, name, vin, sale_price, internal_code, photos, year, model, miles, color, ca_note, purchase_price, profit_margin, category, created_at, updated_at';

      let query = supabase
        .from('vehicles')
        .select(selectColumns, { count: 'exact' })
        .order('internal_code', { ascending: true }); // Ordenar por código interno

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

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase error fetching vehicles:', error);
        throw error;
      }
      
      // Verificar se data é um array válido antes de processar
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        throw new Error('Invalid data format received from database');
      }

      // Processar veículos com apenas a primeira imagem
      const vehiclesWithImages = data.map(vehicle => {
        // Verificar se vehicle é um objeto válido
        if (!vehicle || typeof vehicle !== 'object') {
          console.error('Invalid vehicle object:', vehicle);
          return null;
        }

        const validVehicle = vehicle as Record<string, any>;

        // Usar apenas a primeira foto para otimização
        const firstPhoto = validVehicle.photos && Array.isArray(validVehicle.photos) && validVehicle.photos.length > 0 
          ? validVehicle.photos[0] 
          : null;

        const baseVehicle = {
          ...validVehicle,
          image_url: firstPhoto,
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
            updated_at: validVehicle.updated_at || validVehicle.created_at || new Date().toISOString()
          };
        }
      }).filter(vehicle => vehicle !== null) as Vehicle[];

      console.log('Vehicles fetched successfully:', vehiclesWithImages.length, 'vehicles, page:', page);
      
      if (reset || page === 1) {
        setVehicles(vehiclesWithImages);
      } else {
        setVehicles(prev => [...prev, ...vehiclesWithImages]);
      }

      setTotalCount(count || 0);
      setCurrentPage(page);
      setHasMore(vehiclesWithImages.length === limit && (offset + vehiclesWithImages.length) < (count || 0));
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
    if (hasMore && !loading) {
      fetchVehicles(currentPage + 1, false);
    }
  }, [fetchVehicles, currentPage, hasMore, loading]);

  const goToPage = useCallback((page: number) => {
    setLoading(true);
    fetchVehicles(page, true);
  }, [fetchVehicles]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchVehicles(1, true);
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles(1, true);
  }, [fetchVehicles]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    vehicles: category === 'forSale' ? forSaleVehicles : vehicles,
    loading,
    hasMore,
    currentPage,
    totalPages,
    totalCount,
    loadMore,
    goToPage,
    refetch,
  };
};
