
import { supabase } from '@/integrations/supabase/client';

export const getVehicleMainPhoto = async (vehicleId: string): Promise<string | null> => {
  try {
    // Buscar nas novas fotos
    const { data: newPhotos } = await supabase
      .from('vehicle_photos')
      .select('url, is_main')
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: true });

    if (newPhotos && newPhotos.length > 0) {
      // Busca a foto principal ou a primeira
      const mainPhoto = newPhotos.find(p => p.is_main) || newPhotos[0];
      return mainPhoto.url;
    }

    return null;
  } catch (error) {
    console.error('Error fetching vehicle photo:', error);
    return null;
  }
};
