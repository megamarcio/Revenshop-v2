import { supabase } from '@/integrations/supabase/client';
import { mapFormToDbData } from '../utils/formToDbMapper';

export const updateVehicle = async (vehicleData: any) => {
  console.log('updateVehicle - input vehicleData:', vehicleData);
  console.log('updateVehicle - plate field:', vehicleData.plate);
  console.log('updateVehicle - sunpass field:', vehicleData.sunpass);
  
  if (!vehicleData || !vehicleData.id) {
    console.error('updateVehicle - Vehicle ID is missing:', vehicleData);
    throw new Error('Vehicle ID is required for update');
  }

  const vehicleId = vehicleData.id;
  console.log('updateVehicle - extracted vehicleId:', vehicleId);

  // Map form data to database format
  const dbVehicleData = mapFormToDbData(vehicleData);
  
  console.log('updateVehicle - mapped dbVehicleData:', dbVehicleData);
  console.log('updateVehicle - plate in dbVehicleData:', dbVehicleData.plate);
  console.log('updateVehicle - sunpass in dbVehicleData:', dbVehicleData.sunpass);
  console.log('updateVehicle - category field being sent:', dbVehicleData.category);

  // CRITICAL: Ensure plate and sunpass are explicitly included in the update
  if (vehicleData.plate !== undefined) {
    dbVehicleData.plate = vehicleData.plate || null;
  }
  if (vehicleData.sunpass !== undefined) {
    dbVehicleData.sunpass = vehicleData.sunpass || null;
  }

  console.log('updateVehicle - FINAL dbVehicleData with plate/sunpass:', {
    ...dbVehicleData,
    plate: dbVehicleData.plate,
    sunpass: dbVehicleData.sunpass
  });

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbVehicleData)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Error message:', error.message);
    throw error;
  }

  console.log('Vehicle updated successfully:', data);
  console.log('Updated vehicle plate:', data.plate);
  console.log('Updated vehicle sunpass:', data.sunpass);

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
