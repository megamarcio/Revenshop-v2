
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVehiclePhotoResult {
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useVehiclePhoto = (vehicleId: string | null): UseVehiclePhotoResult => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhoto = useCallback(async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching photo for vehicle:', vehicleId);
      
      // Buscar apenas a foto principal do veículo
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('url')
        .eq('vehicle_id', vehicleId)
        .eq('is_main', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching vehicle photo:', error);
        throw error;
      }

      const url = data?.url || null;
      console.log('Photo fetched for vehicle', vehicleId, ':', url ? 'found' : 'not found');
      setPhotoUrl(url);
    } catch (err) {
      console.error('Error in useVehiclePhoto:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar foto');
      setPhotoUrl(null);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchPhoto();
  }, [fetchPhoto]);

  return { photoUrl, loading, error };
};
