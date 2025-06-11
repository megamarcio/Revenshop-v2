
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from '../types';
import { mapUpdateDataToDbData } from '../utils/dataMappers';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const updateVehicle = async (id: string, vehicleData: Partial<any>): Promise<Vehicle> => {
  console.log('Updating vehicle:', id, 'with data:', vehicleData);
  
  const dbUpdateData = mapUpdateDataToDbData(vehicleData);
  console.log('Update data being sent to database:', dbUpdateData);

  // Separate photos from vehicle data
  const { photos, ...vehicleDataWithoutPhotos } = dbUpdateData;

  const { data, error } = await supabase
    .from('vehicles')
    .update(vehicleDataWithoutPhotos)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    throw error;
  }
  
  // Update photos if provided - only for base64 photos (Storage photos are handled by MediaUploadForm)
  if (photos !== undefined && photos.some((photo: string) => photo.startsWith('data:image/'))) {
    // Convert base64 photos to Storage URLs
    const photoUrls: string[] = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      if (photo.startsWith('data:image/')) {
        try {
          const response = await fetch(photo);
          const blob = await response.blob();
          const file = new File([blob], `photo-${i}.jpg`, { type: 'image/jpeg' });
          
          // Generate unique filename
          const fileExt = 'jpg';
          const fileName = `${id}-${Date.now()}-${i}.${fileExt}`;
          const filePath = `${id}/${fileName}`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading photo to storage:', uploadError);
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('vehicle-photos')
            .getPublicUrl(filePath);

          photoUrls.push(publicUrl);
        } catch (uploadError) {
          console.error('Error processing base64 photo:', uploadError);
        }
      } else {
        photoUrls.push(photo);
      }
    }
    
    if (photoUrls.length > 0) {
      // Remove existing photos for this vehicle
      await supabase
        .from('vehicle_photos')
        .delete()
        .eq('vehicle_id', id);

      // Insert new photos
      const vehiclePhotosData = photoUrls.map((url, index) => ({
        vehicle_id: id,
        url,
        position: index + 1,
        is_main: index === 0
      }));
      
      const { error: photosError } = await supabase
        .from('vehicle_photos')
        .insert(vehiclePhotosData);

      if (photosError) {
        console.error('Error updating vehicle photos:', photosError);
        toast({
          title: 'Aviso',
          description: 'Veículo atualizado mas houve erro ao atualizar algumas fotos.',
          variant: 'destructive',
        });
      }
    }
  }
  
  console.log('Vehicle updated successfully:', data);
  return mapDbDataToAppData({ ...data, photos: photos || [] });
};
