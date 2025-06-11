
import { supabase } from '@/integrations/supabase/client';
import { mapFormToDbData } from '../utils/formToDbMapper';

export const updateVehicle = async (vehicleData: any) => {
  console.log('Updating vehicle with data:', vehicleData);
  
  if (!vehicleData.id) {
    throw new Error('Vehicle ID is required for update');
  }

  // Map form data to database format
  const dbVehicleData = mapFormToDbData(vehicleData);
  
  console.log('Mapped vehicle data for update:', dbVehicleData);
  console.log('Update - title fields being sent:', {
    title_type: dbVehicleData.title_type,
    title_status: dbVehicleData.title_status
  });

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbVehicleData)
    .eq('id', vehicleData.id)
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
      .eq('vehicle_id', vehicleData.id);

    // Then insert new photos
    if (vehicleData.photos.length > 0) {
      const photoInserts = vehicleData.photos.map((url: string, index: number) => ({
        vehicle_id: vehicleData.id,
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
