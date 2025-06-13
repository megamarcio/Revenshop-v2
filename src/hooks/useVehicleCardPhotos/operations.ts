
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VehicleCardPhoto } from './types';

export const fetchCardPhoto = async (vehicleId?: string): Promise<VehicleCardPhoto | null> => {
  if (!vehicleId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('vehicle_card_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching card photo:', error);
    return null;
  }
};

export const uploadCardPhotoToStorage = async (
  file: File,
  vehicleId: string
): Promise<VehicleCardPhoto | null> => {
  if (file.size > 3 * 1024 * 1024) {
    toast({
      title: 'Arquivo muito grande',
      description: 'A imagem deve ter no máximo 3MB.',
      variant: 'destructive',
    });
    return null;
  }

  try {
    console.log('Uploading card photo for vehicle:', vehicleId);

    const fileExt = file.name.split('.').pop();
    const fileName = `card-${vehicleId}-${Date.now()}.${fileExt}`;
    const filePath = `vehicle-cards/${fileName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vehicles-photos-new')
      .getPublicUrl(filePath);

    return await saveCardPhotoToDatabase(vehicleId, publicUrl);
  } catch (error) {
    console.error('Error uploading card photo:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao fazer upload da foto do card.',
      variant: 'destructive',
    });
    return null;
  }
};

export const saveCardPhotoToDatabase = async (
  vehicleId: string,
  photoUrl: string,
  promptUsed?: string
): Promise<VehicleCardPhoto | null> => {
  try {
    // Remove existing card photo
    await supabase
      .from('vehicle_card_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    // Save to database
    const { data: photoData, error: dbError } = await supabase
      .from('vehicle_card_photos')
      .insert({
        vehicle_id: vehicleId,
        photo_url: photoUrl,
        prompt_used: promptUsed
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return photoData;
  } catch (error) {
    console.error('Error saving card photo to database:', error);
    return null;
  }
};

export const removeCardPhotoFromDatabase = async (vehicleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_card_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing card photo:', error);
    return false;
  }
};
