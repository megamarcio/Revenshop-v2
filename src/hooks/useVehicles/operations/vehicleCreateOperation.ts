
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from '../types';
import { mapFormDataToDbData } from '../utils/dataMappers';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const createVehicle = async (vehicleData: any): Promise<Vehicle> => {
  console.log('Creating vehicle with data:', vehicleData);
  
  const dbVehicleData = await mapFormDataToDbData(vehicleData);
  console.log('Mapped vehicle data for database:', dbVehicleData);

  // Separate photos from vehicle data
  const { photos, ...vehicleDataWithoutPhotos } = dbVehicleData;

  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicleDataWithoutPhotos)
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating vehicle:', error);
    throw error;
  }
  
  console.log('Vehicle created successfully, now processing photos:', photos?.length || 0);

  // Handle photos - SEMPRE inserir na tabela vehicle_photos
  if (photos && photos.length > 0) {
    const photoUrls: string[] = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      console.log(`Processing photo ${i + 1}/${photos.length}:`, photo.substring(0, 50) + '...');
      
      if (photo.startsWith('data:image/')) {
        // Convert base64 to file and upload to Storage
        try {
          const response = await fetch(photo);
          const blob = await response.blob();
          const file = new File([blob], `photo-${i}.jpg`, { type: 'image/jpeg' });
          
          // Generate unique filename
          const fileExt = 'jpg';
          const fileName = `${data.id}-${Date.now()}-${i}.${fileExt}`;
          const filePath = `${data.id}/${fileName}`;

          console.log(`Uploading photo to Storage: ${filePath}`);

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Error uploading photo to storage:', uploadError);
            continue;
          }

          console.log('Photo uploaded successfully:', uploadData);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('vehicle-photos')
            .getPublicUrl(filePath);

          console.log('Got public URL:', publicUrl);
          photoUrls.push(publicUrl);
        } catch (uploadError) {
          console.error('Error processing base64 photo:', uploadError);
        }
      } else if (photo.startsWith('http')) {
        // Photo is already a URL (from Storage or external)
        console.log('Photo is already a URL:', photo);
        photoUrls.push(photo);
      }
    }
    
    // SEMPRE inserir registros na tabela vehicle_photos
    if (photoUrls.length > 0) {
      const vehiclePhotosData = photoUrls.map((url, index) => ({
        vehicle_id: data.id,
        url,
        position: index + 1,
        is_main: index === 0
      }));
      
      console.log('Inserting vehicle photos into database:', vehiclePhotosData);
      
      const { data: photosInsertData, error: photosError } = await supabase
        .from('vehicle_photos')
        .insert(vehiclePhotosData)
        .select();

      if (photosError) {
        console.error('Error inserting vehicle photos:', photosError);
        toast({
          title: 'Aviso',
          description: 'Veículo criado mas houve erro ao salvar algumas fotos.',
          variant: 'destructive',
        });
      } else {
        console.log('Photos successfully inserted into vehicle_photos table:', photosInsertData);
        toast({
          title: 'Sucesso',
          description: `Veículo criado com ${photoUrls.length} foto(s) salva(s).`,
        });
      }
    } else {
      console.log('No photos to save');
      toast({
        title: 'Sucesso',
        description: 'Veículo criado sem fotos.',
      });
    }
  }
  
  // Fetch the vehicle with photos to return complete data
  const { data: vehicleWithPhotos } = await supabase
    .from('vehicles')
    .select(`
      *, 
      vehicle_photos!vehicle_photos_vehicle_id_fkey (
        id, url, position, is_main
      )
    `)
    .eq('id', data.id)
    .single();
  
  const finalVehicleData = vehicleWithPhotos || data;
  const vehiclePhotos = (finalVehicleData as any).vehicle_photos || [];
  const photosList = vehiclePhotos
    .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
    .map((photo: any) => photo.url);
  
  console.log('Vehicle created successfully with photos:', finalVehicleData);
  return mapDbDataToAppData({ 
    ...finalVehicleData, 
    photos: photosList,
    vehicle_photos: undefined 
  });
};
