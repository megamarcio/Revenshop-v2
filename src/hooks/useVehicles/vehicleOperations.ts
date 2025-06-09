
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './types';
import { mapFormDataToDbData, mapUpdateDataToDbData, mapDbDataToAppData } from './vehicleMappers';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  console.log('Fetching vehicles from database...');
  
  // Otimizar consulta selecionando apenas campos necessários e limitando resultados
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      id, name, vin, year, model, miles, internal_code, color, 
      ca_note, purchase_price, sale_price, profit_margin, 
      min_negotiable, carfax_price, mmr_value, description, 
      category, title_type, title_status, photos, video, 
      created_at, updated_at, created_by, consignment_store
    `)
    .order('created_at', { ascending: false })
    .limit(100); // Limitar para evitar consultas muito pesadas

  if (error) {
    console.error('Supabase error fetching vehicles:', error);
    throw error;
  }
  
  console.log('Vehicles fetched successfully:', data?.length || 0, 'vehicles');
  
  // Map database data to application format
  const mappedVehicles = data?.map(mapDbDataToAppData) || [];
  return mappedVehicles;
};

export const createVehicle = async (vehicleData: any): Promise<Vehicle> => {
  console.log('Creating vehicle with data:', vehicleData);
  
  const dbVehicleData = await mapFormDataToDbData(vehicleData);
  console.log('Mapped vehicle data for database:', dbVehicleData);

  const { data, error } = await supabase
    .from('vehicles')
    .insert(dbVehicleData)
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating vehicle:', error);
    throw error;
  }
  
  console.log('Vehicle created successfully:', data);
  return mapDbDataToAppData(data);
};

export const updateVehicle = async (id: string, vehicleData: Partial<any>): Promise<Vehicle> => {
  console.log('Updating vehicle:', id, 'with data:', vehicleData);
  
  const dbUpdateData = mapUpdateDataToDbData(vehicleData);
  console.log('Update data being sent to database:', dbUpdateData);

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbUpdateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    throw error;
  }
  
  console.log('Vehicle updated successfully:', data);
  return mapDbDataToAppData(data);
};

export const deleteVehicle = async (id: string): Promise<void> => {
  console.log('Deleting vehicle:', id);
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
