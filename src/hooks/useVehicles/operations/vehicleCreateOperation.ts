
import { supabase } from '@/integrations/supabase/client';
import { mapFormDataToDbData } from '../utils/dataMappers';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const createVehicle = async (vehicleData: any) => {
  console.log('createVehicle - input data:', vehicleData);
  
  try {
    // Map data to database format
    const dbData = await mapFormDataToDbData(vehicleData);
    console.log('createVehicle - mapped data:', dbData);
    
    // Extract photos and video data
    const photos = vehicleData.photos || [];
    const video = vehicleData.video || vehicleData.videos?.[0];
    
    // Create the vehicle first
    const { data: newVehicle, error: createError } = await supabase
      .from('vehicles')
      .insert({
        ...dbData,
        video: video || null
      })
      .select('*')
      .single();

    if (createError) {
      console.error('Error creating vehicle:', createError);
      throw new Error(`Erro ao criar veículo: ${createError.message}`);
    }

    console.log('Vehicle created successfully:', newVehicle);

    // Handle photos if provided
    if (photos && photos.length > 0) {
      const photoInserts = photos.map((url: string, index: number) => ({
        vehicle_id: newVehicle.id,
        url,
        position: index + 1,
        is_main: index === 0
      }));

      const { error: photosError } = await supabase
        .from('vehicle_photos')
        .insert(photoInserts);

      if (photosError) {
        console.error('Error inserting vehicle photos:', photosError);
        // Don't throw here, vehicle was created successfully
      }
    }

    // Fetch complete vehicle data with photos
    const { data: completeVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_photos(url, position, is_main)
      `)
      .eq('id', newVehicle.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete vehicle:', fetchError);
      // Return the basic vehicle data if fetch fails
      const vehicleWithPhotos = {
        ...newVehicle,
        photos: photos
      };
      return mapDbDataToAppData(vehicleWithPhotos);
    }

    // Map photos back to the expected format
    const vehiclePhotos = completeVehicle.vehicle_photos
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((photo: any) => photo.url) || [];

    const vehicleWithPhotos = {
      ...completeVehicle,
      photos: vehiclePhotos,
      vehicle_photos: undefined // Remove the nested photos object
    };

    console.log('createVehicle - final result:', vehicleWithPhotos);
    
    // Map back to application format
    return mapDbDataToAppData(vehicleWithPhotos);
  } catch (error) {
    console.error('createVehicle - error:', error);
    throw error;
  }
};
