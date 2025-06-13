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
    
    if (data) {
      console.log('🔗 URL original da foto (RAW do banco):', data.photo_url);
      
      // Log detalhado da URL
      if (data.photo_url) {
        console.log('📊 Análise detalhada da URL do banco:');
        console.log('- URL completa:', data.photo_url);
        console.log('- Length:', data.photo_url.length);
        console.log('- Contém "supabase"?', data.photo_url.includes('supabase'));
        console.log('- Começa com "http"?', data.photo_url.startsWith('http'));
        console.log('- Começa com "vehicles-photos-new/"?', data.photo_url.startsWith('vehicles-photos-new/'));
        console.log('- Começa com "vehicle-cards/"?', data.photo_url.startsWith('vehicle-cards/'));
        console.log('- Contém "vehicle-cards/"?', data.photo_url.includes('vehicle-cards/'));
        
        // Verificar se é só o nome do arquivo
        const isJustFilename = !data.photo_url.includes('/') && (data.photo_url.includes('.png') || data.photo_url.includes('.jpg') || data.photo_url.includes('.jpeg'));
        console.log('- É só nome do arquivo?', isJustFilename);
      }
      
      console.log('✅ Retornando dados da foto do card sem modificação');
    } else {
      console.log('ℹ️ Nenhuma foto do card encontrada para este veículo');
    }
    
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
    console.log('Uploader da foto do card para o veículo:', vehicleId);

    const fileExt = file.name.split('.').pop();
    const fileName = `card-${vehicleId}-${Date.now()}.${fileExt}`;
    const filePath = `vehicle-cards/${fileName}`;

    console.log('📁 Caminho do arquivo no storage:', filePath);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, file);

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw uploadError;
    }

    console.log('✅ Arquivo enviado com sucesso:', uploadData);

    // Construir URL pública - IMPORTANTE: salvar a URL COMPLETA no banco
    const publicUrl = `https://ctdajbfmgmkhqueskjvk.supabase.co/storage/v1/object/public/vehicles-photos-new/${filePath}`;
    console.log('🔗 URL pública gerada para salvar no banco:', publicUrl);

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
    
    // Remove existing card photo
    await supabase
      .from('vehicle_card_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    // Save to database - salvar a URL COMPLETA
    const { data: photoData, error: dbError } = await supabase
      .from('vehicle_card_photos')
      .insert({
        vehicle_id: vehicleId,
        photo_url: photoUrl, // URL completa aqui
        prompt_used: promptUsed
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Erro no banco de dados:', dbError);
      throw dbError;
    }
    
    console.log('✅ Foto do card salva no banco:', photoData);
    return photoData;
  } catch (error) {
    console.error('❌ Erro ao salvar foto do card no banco:', error);
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
