
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './types';
import { mapFormDataToDbData, mapUpdateDataToDbData } from './utils/dataMappers';
import { mapDbDataToAppData } from './utils/dbToAppMapper';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  console.log('Fetching vehicles from database...');
  
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      id, name, vin, year, model, miles, internal_code, color, 
      ca_note, purchase_price, sale_price, profit_margin, 
      min_negotiable, carfax_price, mmr_value, description, 
      category, title_type, title_status, video, 
      created_at, updated_at, created_by,
      vehicle_photos!vehicle_photos_vehicle_id_fkey (
        id, url, position, is_main
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Supabase error fetching vehicles:', error);
    throw error;
  }
  
  console.log('Vehicles fetched successfully:', data?.length || 0, 'vehicles');
  
  // Map database data to application format, including photos from vehicle_photos
  const mappedVehicles = data?.map(vehicle => {
    const vehiclePhotos = vehicle.vehicle_photos || [];
    const photos = vehiclePhotos
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map(photo => photo.url);
    
    // Buscar foto principal ou usar primeira foto como fallback
    const mainPhoto = vehiclePhotos.find(photo => photo.is_main);
    const main_photo_url = mainPhoto?.url || photos[0] || null;
    
    return mapDbDataToAppData({
      ...vehicle,
      photos,
      main_photo_url,
      vehicle_photos: undefined // Remove from final object
    });
  }) || [];
  
  return mappedVehicles;
};

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
  
  // Handle photos - if they are base64, upload to Storage first
  if (photos && photos.length > 0) {
    const photoUrls: string[] = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
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
        // Photo is already a URL
        photoUrls.push(photo);
      }
    }
    
    // Insert photo records into vehicle_photos table
    if (photoUrls.length > 0) {
      const vehiclePhotosData = photoUrls.map((url, index) => ({
        vehicle_id: data.id,
        url,
        position: index + 1,
        is_main: index === 0
      }));
      
      const { error: photosError } = await supabase
        .from('vehicle_photos')
        .insert(vehiclePhotosData);

      if (photosError) {
        console.error('Error inserting vehicle photos:', photosError);
        toast({
          title: 'Aviso',
          description: 'Veículo criado mas houve erro ao salvar algumas fotos.',
          variant: 'destructive',
        });
      }
    }
  }
  
  console.log('Vehicle created successfully:', data);
  return mapDbDataToAppData({ ...data, photos: photos || [] });
};

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

export const deleteVehicle = async (id: string): Promise<void> => {
  console.log('Deleting vehicle:', id);
  
  try {
    // First, get all photos for this vehicle to delete from storage
    const { data: photos } = await supabase
      .from('vehicle_photos')
      .select('url')
      .eq('vehicle_id', id);

    // Delete photos from Storage
    if (photos && photos.length > 0) {
      const filePaths: string[] = [];
      
      photos.forEach(photo => {
        try {
          const url = new URL(photo.url);
          const pathSegments = url.pathname.split('/');
          const bucketIndex = pathSegments.findIndex(segment => segment === 'vehicle-photos');
          if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
            const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
            filePaths.push(storagePath);
          }
        } catch (error) {
          console.warn('Error parsing photo URL for deletion:', error);
        }
      });

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('vehicle-photos')
          .remove(filePaths);

        if (storageError) {
          console.warn('Error removing photos from storage:', storageError);
        }
      }
    }

    // Delete vehicle (photos will be deleted automatically due to ON DELETE CASCADE)
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting vehicle:', error);
      throw error;
    }
    
    console.log('Vehicle deleted successfully');
  } catch (error) {
    console.error('Error during vehicle deletion:', error);
    throw error;
  }
};
