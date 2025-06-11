
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
        const photoUrl = data.url;
        
        // Se for URL do Supabase Storage, aplicar transformações de thumbnail
        if (photoUrl && photoUrl.includes('supabase')) {
          // Para URLs do Supabase Storage, adicionar parâmetros de transformação
          const url = new URL(photoUrl);
          url.searchParams.set('width', '300');
          url.searchParams.set('height', '200');
          url.searchParams.set('resize', 'cover');
          const thumbnailUrlResult = url.toString();
          
          console.log('Supabase Storage photo URLs fetched for vehicle', vehicleId, ':', {
            thumbnail: 'generated',
            full: 'available'
          });
          
          setThumbnailUrl(thumbnailUrlResult);
          setFullPhotoUrl(photoUrl);
        } else if (photoUrl) {
          // Para outras URLs (incluindo base64), usar diretamente
          console.log('External/base64 photo URLs fetched for vehicle', vehicleId, ':', {
            thumbnail: 'direct',
            full: 'direct'
          });
          
          setThumbnailUrl(photoUrl);
          setFullPhotoUrl(photoUrl);
        } else {
          setThumbnailUrl(null);
          setFullPhotoUrl(null);
        }
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
