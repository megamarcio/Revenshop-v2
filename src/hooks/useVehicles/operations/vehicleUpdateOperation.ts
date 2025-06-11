
import { supabase } from '@/integrations/supabase/client';
import { mapFormToDbData } from '../utils/formToDbMapper';

export const updateVehicle = async (vehicleData: any) => {
  console.log('updateVehicle - input vehicleData:', vehicleData);
  
  if (!vehicleData || !vehicleData.id) {
    console.error('updateVehicle - Vehicle ID is missing:', vehicleData);
    throw new Error('Vehicle ID is required for update');
  }

  const vehicleId = vehicleData.id;
  console.log('updateVehicle - extracted vehicleId:', vehicleId);

  // Map form data to database format
  const dbVehicleData = mapFormToDbData(vehicleData);
  
  console.log('updateVehicle - mapped dbVehicleData:', dbVehicleData);
  console.log('updateVehicle - title fields being sent:', {
    title_type_id: dbVehicleData.title_type_id,
    title_location_id: dbVehicleData.title_location_id,
    title_location_custom: dbVehicleData.title_location_custom
  });

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbVehicleData)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    throw error;
  }

  console.log('Vehicle updated successfully:', data);

  // Handle photos update if provided
  if (vehicleData.photos) {
    console.log('Updating vehicle photos:', vehicleData.photos);
    
    // First, delete existing photos
    await supabase
      .from('vehicle_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    // Then insert new photos
    if (vehicleData.photos.length > 0) {
      const photoInserts = vehicleData.photos.map((url: string, index: number) => ({
        vehicle_id: vehicleId,
        url: url,
        position: index,
        is_main: index === 0
      }));

      const { error: photoError } = await supabase
        .from('vehicle_photos')
        .insert(photoInserts);

      if (photoError) {
        console.error('Error updating vehicle photos:', photoError);
      } else {
        console.log('Vehicle photos updated successfully');
      }
    }
  }

  return data;
};
