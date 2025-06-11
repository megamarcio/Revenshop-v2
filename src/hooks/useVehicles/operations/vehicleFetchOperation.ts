
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '../types';
import { mapDbDataToAppData } from '../utils/dbToAppMapper';

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
      financing_bank, financing_type, original_financed_name,
      purchase_date, due_date, installment_value, down_payment,
      financed_amount, total_installments, paid_installments,
      remaining_installments, total_to_pay, payoff_value,
      payoff_date, interest_rate, custom_financing_bank,
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
  
  console.log('Mapped vehicles with financing data:', mappedVehicles);
  
  return mappedVehicles;
};
