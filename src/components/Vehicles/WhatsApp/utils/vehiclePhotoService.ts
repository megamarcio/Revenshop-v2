
import { supabase } from '@/integrations/supabase/client';

export const getVehiclePhotos = async (vehicleId: string): Promise<string[]> => {
  let vehiclePhotos: string[] = [];
  
  if (!vehicleId) return vehiclePhotos;

  console.log('Buscando fotos para veículo ID:', vehicleId);
  
  try {
    // Buscar fotos da tabela vehicle_photos
    const { data: photos, error: photosError } = await supabase
      .from('vehicle_photos')
      .select('url')
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: true });

    if (photosError) {
      console.error('Erro ao buscar fotos:', photosError);
    } else if (photos && photos.length > 0) {
      vehiclePhotos = photos.map(p => p.url);
      console.log('Fotos encontradas no banco:', vehiclePhotos.length);
    }

    // Se não encontrou fotos no banco, buscar fotos novas do bucket
    if (vehiclePhotos.length === 0) {
      console.log('Tentando buscar fotos do bucket vehicles-photos-new');
      
      const { data: bucketFiles, error: bucketError } = await supabase.storage
        .from('vehicles-photos-new')
        .list(vehicleId);

      if (!bucketError && bucketFiles && bucketFiles.length > 0) {
        console.log('Arquivos encontrados no bucket:', bucketFiles.length);
        
        vehiclePhotos = bucketFiles.map(file => {
          const { data } = supabase.storage
            .from('vehicles-photos-new')
            .getPublicUrl(`${vehicleId}/${file.name}`);
          return data.publicUrl;
        });
      }
    }
  } catch (error) {
    console.error('Erro ao buscar fotos do veículo:', error);
  }

  return vehiclePhotos;
};
