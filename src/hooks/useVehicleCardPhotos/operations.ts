
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VehicleCardPhoto } from './types';

export const fetchCardPhoto = async (vehicleId?: string): Promise<VehicleCardPhoto | null> => {
  if (!vehicleId) return null;

  try {
    console.log('🔍 Buscando foto do card para o veículo:', vehicleId);
    const { data, error } = await supabase
      .from('vehicle_card_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .single();

    if (error) {
      console.log('❌ Nenhuma foto do card encontrada para:', vehicleId);
      return null;
    }
    
    console.log('✅ Foto do card encontrada:', data);
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

    // Upload para o storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, file);

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw uploadError;
    }

    console.log('✅ Arquivo enviado com sucesso:', uploadData);

    // Pegar URL pública usando o método correto do Supabase
    const { data: { publicUrl } } = supabase.storage
      .from('vehicles-photos-new')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública gerada:', publicUrl);

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
    console.log('💾 Salvando foto do card no banco:', { vehicleId, photoUrl });
    
    // Remove foto do card existente primeiro
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
