
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVehiclePhotoThumbnailResult {
  thumbnailUrl: string | null;
  fullPhotoUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useVehiclePhotoThumbnail = (vehicleId: string | null): UseVehiclePhotoThumbnailResult => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fullPhotoUrl, setFullPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotoUrls = useCallback(async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching photo thumbnail for vehicle:', vehicleId);
      
      // Buscar apenas a foto principal do veículo com URL
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('url')
        .eq('vehicle_id', vehicleId)
        .eq('is_main', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching vehicle photo thumbnail:', error);
        throw error;
      }

      if (data) {
        // Por enquanto, usar a mesma URL para thumbnail e completa
        // No futuro, implementar sistema de thumbnails no Supabase Storage
        const photoUrl = data.url;
        const thumbnailUrlResult = photoUrl ? `${photoUrl}?w=150&h=150&fit=crop` : null;
        
        console.log('Photo URLs fetched for vehicle', vehicleId, ':', {
          thumbnail: thumbnailUrlResult ? 'found' : 'not found',
          full: photoUrl ? 'found' : 'not found'
        });
        
        setThumbnailUrl(thumbnailUrlResult);
        setFullPhotoUrl(photoUrl);
      } else {
        setThumbnailUrl(null);
        setFullPhotoUrl(null);
      }
    } catch (err) {
      console.error('Error in useVehiclePhotoThumbnail:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar foto');
      setThumbnailUrl(null);
      setFullPhotoUrl(null);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchPhotoUrls();
  }, [fetchPhotoUrls]);

  return { thumbnailUrl, fullPhotoUrl, loading, error };
};
