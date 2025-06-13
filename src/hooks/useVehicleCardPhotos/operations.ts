
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VehicleCardPhoto } from './types';

export const fetchCardPhoto = async (vehicleId?: string): Promise<VehicleCardPhoto | null> => {
  if (!vehicleId) {
    return null;
  }

  try {
    console.log('🔍 Buscando foto do card para o veículo:', vehicleId);
    const { data, error } = await supabase
      .from('vehicle_card_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .maybeSingle();

    if (error) {
      console.error('❌ Erro ao buscar foto do card:', error);
      throw error;
    }
    
    console.log('📸 Dados da foto do card encontrados:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar foto do card:', error);
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
    console.log('📤 Fazendo upload da foto do card para o veículo:', vehicleId);

    const fileExt = file.name.split('.').pop();
    const fileName = `card-${vehicleId}-${Date.now()}.${fileExt}`;
    const filePath = `vehicle-cards/${fileName}`;

    console.log('📁 Caminho completo no storage:', filePath);

    // Upload para o storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, file);

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw uploadError;
    }

    console.log('✅ Arquivo enviado com sucesso:', uploadData);

    // Construir URL completa
    const publicUrl = `https://ctdajbfmgmkhqueskjvk.supabase.co/storage/v1/object/public/vehicles-photos-new/${filePath}`;
    console.log('🔗 URL completa construída:', publicUrl);

    return await saveCardPhotoToDatabase(vehicleId, publicUrl);
  } catch (error) {
    console.error('❌ Erro ao fazer upload da foto do card:', error);
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
    console.log('💾 Salvando foto do card no banco:', { vehicleId, photoUrl, promptUsed });
    
    // Remove foto do card existente
    await supabase
      .from('vehicle_card_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    // Salva nova foto no banco
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
      console.error('❌ Erro no banco de dados:', dbError);
      throw dbError;
    }
    
    console.log('✅ Foto do card salva no banco com sucesso:', photoData);
    return photoData;
  } catch (error) {
    console.error('❌ Erro ao salvar foto do card no banco:', error);
    return null;
  }
};

export const removeCardPhotoFromDatabase = async (vehicleId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Removendo foto do card do banco para veículo:', vehicleId);
    
    const { error } = await supabase
      .from('vehicle_card_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    if (error) {
      console.error('❌ Erro ao remover foto do card:', error);
      throw error;
    }
    
    console.log('✅ Foto do card removida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover foto do card:', error);
    return false;
  }
};
