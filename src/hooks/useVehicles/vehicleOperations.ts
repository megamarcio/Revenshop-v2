
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './types';
import { mapFormDataToDbData, mapUpdateDataToDbData } from './utils/dataMappers';
import { mapDbDataToAppData } from './utils/dbToAppMapper';
import { mapPhotosArrayToVehiclePhotos } from './utils/vehiclePhotosMapper';

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
    
    return mapDbDataToAppData({
      ...vehicle,
      photos,
      vehicle_photos: undefined // Remove from final object
    });
  }) || [];
  
  return mappedVehicles;
};

export const createVehicle = async (vehicleData: any): Promise<Vehicle> => {
  console.log('Creating vehicle with data:', vehicleData);
  
  const dbVehicleData = await mapFormDataToDbData(vehicleData);
  console.log('Mapped vehicle data for database:', dbVehicleData);

  // Separate photos from vehicle data
  const { photos, ...vehicleDataWithoutPhotos } = dbVehicleData;

  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicleDataWithoutPhotos)
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating vehicle:', error);
    throw error;
  }
  
  // Insert photos into vehicle_photos table if any
  if (photos && photos.length > 0) {
    const vehiclePhotosData = mapPhotosArrayToVehiclePhotos(data.id, photos);
    
    const { error: photosError } = await supabase
      .from('vehicle_photos')
      .insert(vehiclePhotosData);

    if (photosError) {
      console.error('Error inserting vehicle photos:', photosError);
      // Don't throw error, vehicle was created successfully
      toast({
        title: 'Aviso',
        description: 'Veículo criado mas houve erro ao salvar algumas fotos.',
        variant: 'destructive',
      });
    }
  }
  
  console.log('Vehicle created successfully:', data);
  return mapDbDataToAppData({ ...data, photos: photos || [] });
};

export const updateVehicle = async (id: string, vehicleData: Partial<any>): Promise<Vehicle> => {
  console.log('Updating vehicle:', id, 'with data:', vehicleData);
  
  const dbUpdateData = mapUpdateDataToDbData(vehicleData);
  console.log('Update data being sent to database:', dbUpdateData);

  // Separate photos from vehicle data
  const { photos, ...vehicleDataWithoutPhotos } = dbUpdateData;

  const { data, error } = await supabase
    .from('vehicles')
    .update(vehicleDataWithoutPhotos)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    throw error;
  }
  
  // Update photos if provided
  if (photos !== undefined) {
    // Remove existing photos
    await supabase
      .from('vehicle_photos')
      .delete()
      .eq('vehicle_id', id);

    // Insert new photos if any
    if (photos.length > 0) {
      const vehiclePhotosData = mapPhotosArrayToVehiclePhotos(id, photos);
      
      const { error: photosError } = await supabase
        .from('vehicle_photos')
        .insert(vehiclePhotosData);

      if (photosError) {
        console.error('Error updating vehicle photos:', photosError);
        toast({
          title: 'Aviso',
          description: 'Veículo atualizado mas houve erro ao atualizar algumas fotos.',
          variant: 'destructive',
        });
      }
    }
  }
  
  console.log('Vehicle updated successfully:', data);
  return mapDbDataToAppData({ ...data, photos: photos || [] });
};

export const deleteVehicle = async (id: string): Promise<void> => {
  console.log('Deleting vehicle:', id);
  
  // Photos will be deleted automatically due to ON DELETE CASCADE
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase error deleting vehicle:', error);
    throw error;
  }
  
  console.log('Vehicle deleted successfully');
};
