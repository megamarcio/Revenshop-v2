
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapDbDataToAppData } from './useVehicles/utils/dbToAppMapper';

export interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number;
  internal_code: string;
  color: string;
  purchase_price: number;
  sale_price: number;
  profit_margin: number;
  min_negotiable: number;
  carfax_price: number;
  mmr_value: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  photos: any[];
}

interface UseVehiclesOptimizedOptions {
  category?: string;
  searchTerm?: string;
  limit?: number;
  sellerId?: string;
  minimal?: boolean;
}

export const useVehiclesOptimized = (options: UseVehiclesOptimizedOptions = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    category,
    searchTerm = '',
    limit = 50,
    sellerId,
    minimal = false
  } = options;

  useEffect(() => {
    const fetchVehicles = async () => {
      console.log('Fetching vehicles with options:', {
        category,
        limit,
        offset: 0,
        searchTerm,
        minimal
      });

      try {
        setLoading(true);
        setError(null);

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
            purchase_price,
            sale_price,
            profit_margin,
            min_negotiable,
            carfax_price,
            mmr_value,
            description,
            category,
            created_at,
            updated_at,
            created_by,
            financing_bank,
            financing_type,
            original_financed_name,
            purchase_date,
            due_date,
            installment_value,
            down_payment,
            financed_amount,
            total_installments,
            paid_installments,
            remaining_installments,
            total_to_pay,
            payoff_value,
            payoff_date,
            interest_rate,
            custom_financing_bank,
            title_type_id,
            title_location_id,
            title_location_custom,
            vehicle_photos (
              id,
              url,
              is_main,
              position
            ),
            title_types (
              id,
              name
            ),
            title_locations (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        // Apply category filter with proper type checking
        if (category && (category === 'forSale' || category === 'sold')) {
          query = query.eq('category', category);
        }

        // Apply seller filter for non-admin users
        if (sellerId) {
          query = query.eq('created_by', sellerId);
        }

        // Apply search filter
        if (searchTerm && searchTerm.trim()) {
          query = query.or(`
            name.ilike.%${searchTerm}%,
            model.ilike.%${searchTerm}%,
            vin.ilike.%${searchTerm}%,
            color.ilike.%${searchTerm}%,
            internal_code.ilike.%${searchTerm}%
          `);
        }

        // Apply limit
        query = query.limit(limit);

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          console.error('Supabase error fetching vehicles:', supabaseError);
          throw supabaseError;
        }

        console.log('Raw vehicles data from Supabase:', data);

        // Map the data using the existing mapper
        const mappedVehicles = data?.map(mapDbDataToAppData) || [];
        
        console.log('Mapped vehicles:', mappedVehicles);
        
        setVehicles(mappedVehicles);
      } catch (error: any) {
        console.error('Error fetching vehicles:', error);
        setError(error.message || 'Failed to fetch vehicles');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [category, searchTerm, limit, sellerId, minimal]);

  return {
    vehicles,
    loading,
    error,
  };
};
