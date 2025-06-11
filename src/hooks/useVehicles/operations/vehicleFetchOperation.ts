
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
        ),
        title_types (
          id,
          name,
          code
        ),
        title_locations (
          id,
          name,
          code,
          allows_custom
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
      console.log('Vehicle title fields from DB:', {
        title_type_id: vehicle.title_type_id,
        title_location_id: vehicle.title_location_id,
        title_location_custom: vehicle.title_location_custom,
        title_types: vehicle.title_types,
        title_locations: vehicle.title_locations
      });
      
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
