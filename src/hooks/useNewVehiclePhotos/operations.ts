
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NewVehiclePhoto } from './types';

export const fetchNewVehiclePhotos = async (vehicleId: string): Promise<NewVehiclePhoto[]> => {
  console.log('Fetching new vehicle photos for:', vehicleId);
  
  try {
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('vehicles-photos-new')
      .list(vehicleId);

    if (storageError) {
      console.error('Storage error:', storageError);
      return [];
    }

    if (!storageFiles || storageFiles.length === 0) {
      return [];
    }

    // Get main photo preference from local storage
    const mainPhotoPreference = localStorage.getItem(`mainPhoto_${vehicleId}`);

    const photosData = storageFiles
      .filter(file => file.name && !file.name.includes('.emptyFolderPlaceholder'))
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('vehicles-photos-new')
          .getPublicUrl(`${vehicleId}/${file.name}`);

        return {
          id: file.id || file.name,
          vehicle_id: vehicleId,
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          is_main: file.name === mainPhotoPreference || (file.name.includes('main') && !mainPhotoPreference) || false
        };
      });

    // If no main photo is set and we have photos, set the first one as main
    if (photosData.length > 0 && !photosData.some(p => p.is_main)) {
      photosData[0].is_main = true;
      localStorage.setItem(`mainPhoto_${vehicleId}`, photosData[0].name);
    }

    console.log('New vehicle photos fetched:', photosData);
    return photosData;
  } catch (error) {
    console.error('Error fetching new vehicle photos:', error);
    return [];
  }
};

export const uploadNewVehiclePhoto = async (vehicleId: string, file: File): Promise<NewVehiclePhoto | null> => {
  if (file.size > 3 * 1024 * 1024) {
    toast({
      title: 'Arquivo muito grande',
      description: 'A imagem deve ter no máximo 3MB.',
      variant: 'destructive',
    });
    return null;
  }

  try {
    console.log('Uploading new photo:', file.name);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${vehicleId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicles-photos-new')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('vehicles-photos-new')
      .getPublicUrl(filePath);

    const newPhoto: NewVehiclePhoto = {
      id: fileName,
      vehicle_id: vehicleId,
      name: fileName,
      url: publicUrl,
      size: file.size,
      is_main: false
    };

    toast({
      title: 'Sucesso',
      description: 'Foto adicionada com sucesso.',
    });

    return newPhoto;
  } catch (error) {
    console.error('Error uploading new photo:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao fazer upload da foto.',
      variant: 'destructive',
    });
    return null;
  }
};

export const removeNewVehiclePhoto = async (vehicleId: string, photoName: string): Promise<void> => {
  try {
    const filePath = `${vehicleId}/${photoName}`;
    
    const { error } = await supabase.storage
      .from('vehicles-photos-new')
      .remove([filePath]);

    if (error) throw error;

    toast({
      title: 'Sucesso',
      description: 'Foto removida com sucesso.',
    });
  } catch (error) {
    console.error('Error removing new photo:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao remover foto.',
      variant: 'destructive',
    });
  }
};
