
import { supabase } from '@/integrations/supabase/client';
import { mapUpdateDataToDbData } from '../utils/updateDataMapper';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const updateVehicle = async (id: string, vehicleData: Partial<any>) => {
  console.log('updateVehicle - input data:', vehicleData);
  
  try {
    // Map data to database format
    const dbData = mapUpdateDataToDbData(vehicleData);
    console.log('updateVehicle - mapped data:', dbData);
    
    // Handle photos separately
    const photosToUpdate = vehicleData.photos;
    const videoToUpdate = vehicleData.video || vehicleData.videos?.[0];
    
    // Update main vehicle data
    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(dbData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating vehicle:', updateError);
      throw new Error(`Erro ao atualizar veículo: ${updateError.message}`);
    }

    console.log('Vehicle updated successfully:', updatedVehicle);

    // Handle photos if provided
    if (photosToUpdate !== undefined) {
      // Delete existing photos
      await supabase
        .from('vehicle_photos')
        .delete()
        .eq('vehicle_id', id);

      // Insert new photos
      if (photosToUpdate && photosToUpdate.length > 0) {
        const photoInserts = photosToUpdate.map((url: string, index: number) => ({
          vehicle_id: id,
          url,
          position: index + 1,
          is_main: index === 0
        }));

        const { error: photosError } = await supabase
          .from('vehicle_photos')
          .insert(photoInserts);

        if (photosError) {
          console.error('Error updating vehicle photos:', photosError);
        }
      }
    }

    // Handle video separately in main table
    if (videoToUpdate !== undefined) {
      await supabase
        .from('vehicles')
        .update({ video: videoToUpdate })
        .eq('id', id);
    }

    // Fetch complete updated vehicle data
    const { data: completeVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_photos(url, position, is_main)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated vehicle:', fetchError);
      throw new Error(`Erro ao buscar veículo atualizado: ${fetchError.message}`);
    }

    // Map photos back to the expected format
    const photos = completeVehicle.vehicle_photos
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((photo: any) => photo.url) || [];

    const vehicleWithPhotos = {
      ...completeVehicle,
      photos,
      vehicle_photos: undefined // Remove the nested photos object
    };

    console.log('updateVehicle - final result:', vehicleWithPhotos);
    
    // Map back to application format
    return mapDbDataToAppData(vehicleWithPhotos);
  } catch (error) {
    console.error('updateVehicle - error:', error);
    throw error;
  }
};
