
import { supabase } from '@/integrations/supabase/client';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const fetchVehicles = async () => {
  console.log('fetchVehicles - Starting fetch operation');
  
  try {
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_photos (
          id,
          url,
          is_main,
          position
        )
      `)
      .order('created_at', { ascending: false });

    if (vehiclesError) {
      console.error('Error fetching vehicles:', vehiclesError);
      throw vehiclesError;
    }

    console.log('Raw vehicles data from Supabase:', vehiclesData);

    if (!vehiclesData) {
      console.log('No vehicles data returned');
      return [];
    }

    // Map the database data to application format
    const mappedVehicles = vehiclesData.map(vehicle => {
      console.log('Processing vehicle:', vehicle.id);
      
      // Extract photos from vehicle_photos relationship
      const photos = vehicle.vehicle_photos?.map((photo: any) => photo.url) || [];
      
      // Map database fields to application format
      const mappedVehicle = {
        ...vehicle,
        internal_code: vehicle.internal_code,
        photos: photos,
      };

      console.log('Mapped vehicle:', mappedVehicle);
      return mapDbDataToAppData(mappedVehicle);
    });

    console.log('fetchVehicles - Final mapped vehicles:', mappedVehicles);
    return mappedVehicles;
  } catch (error) {
    console.error('Error in fetchVehicles:', error);
    throw error;
  }
};
