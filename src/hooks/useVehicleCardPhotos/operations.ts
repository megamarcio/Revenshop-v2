
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VehicleCardPhoto } from './types';

export const fetchCardPhoto = async (vehicleId?: string): Promise<VehicleCardPhoto | null> => {
  if (!vehicleId) {
    return null;
  }

  try {
    console.log('Fetching card photo for vehicle:', vehicleId);
    const { data, error } = await supabase
      .from('vehicle_card_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching card photo:', error);
      throw error;
    }
    
    console.log('Card photo data fetched:', data);
    
    // Se temos dados, garantir que a URL está correta
    if (data && data.photo_url) {
      // Corrigir URL se necessário
      if (data.photo_url.startsWith('vehicles-photos-new/') || data.photo_url.startsWith('vehicle-cards/')) {
        data.photo_url = `https://ctdajbfmgmkhqueskjvk.supabase.co/storage/v1/object/public/vehicles-photos-new/${data.photo_url.replace('vehicles-photos-new/', '').replace('vehicle-cards/', '')}`;
      }
      console.log('Corrected card photo URL:', data.photo_url);
    }
    
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

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully:', uploadData);

    // Get public URL - usando a estrutura correta
    const publicUrl = `https://ctdajbfmgmkhqueskjvk.supabase.co/storage/v1/object/public/vehicles-photos-new/${filePath}`;
    console.log('Public URL generated:', publicUrl);

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
    console.log('Saving card photo to database:', { vehicleId, photoUrl, promptUsed });
    
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

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
    
    console.log('Card photo saved to database:', photoData);
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
