
import { supabase } from '@/integrations/supabase/client';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

export const fetchVehicles = async () => {
  console.log('Fetching vehicles...');
  
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      title_types (
        id,
        name
      ),
      title_locations (
        id,
        name
      ),
      vehicle_photos (
        id,
        url,
        position,
        is_main
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }

  console.log('Raw vehicles data from DB:', data);

  const vehicles = data.map(vehicle => {
    console.log('Processing vehicle:', vehicle.id);
    console.log('Vehicle title fields from DB:', {
      title_type_id: vehicle.title_type_id,
      title_location_id: vehicle.title_location_id,
      title_location_custom: vehicle.title_location_custom,
      title_types: vehicle.title_types,
      title_locations: vehicle.title_locations
    });
    
    const mapped = mapDbDataToAppData(vehicle);
    console.log('Mapped vehicle:', mapped);
    return mapped;
  });

  console.log('Final mapped vehicles:', vehicles);
  return vehicles;
};
