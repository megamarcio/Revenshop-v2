import { supabase } from '@/integrations/supabase/client';
import { mapFormToDbData } from '../utils/formToDbMapper';

export const createVehicle = async (vehicleData: any) => {
  console.log('Creating vehicle with data:', vehicleData);
  
  // Map form data to database format
  const dbVehicleData = mapFormToDbData(vehicleData);
  
  console.log('Mapped vehicle data for creation:', dbVehicleData);
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert([dbVehicleData])
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating vehicle:', error);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Error message:', error.message);
    
    // Criar mensagem de erro mais específica
    let errorMessage = error.message || 'Erro ao criar veículo';
    
    if (error.details) {
      errorMessage = `${errorMessage} - ${error.details}`;
    }
    
    if (error.hint) {
      errorMessage = `${errorMessage} - Dica: ${error.hint}`;
    }
    
    throw new Error(errorMessage);
  }

  console.log('Vehicle created successfully:', data);
  
  // Handle photos if provided
  if (vehicleData.photos && vehicleData.photos.length > 0) {
    console.log('Adding photos to vehicle:', vehicleData.photos);
    
    const photoInserts = vehicleData.photos.map((url: string, index: number) => ({
      vehicle_id: data.id,
      url: url,
      position: index,
      is_main: index === 0
    }));

    const { error: photoError } = await supabase
      .from('vehicle_photos')
      .insert(photoInserts);

    if (photoError) {
      console.error('Error inserting vehicle photos:', photoError);
    } else {
      console.log('Vehicle photos added successfully');
    }
  }

  return data;
};
