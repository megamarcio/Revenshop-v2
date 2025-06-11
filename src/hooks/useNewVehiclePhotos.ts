
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NewVehiclePhoto {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  is_main?: boolean;
}

export const useNewVehiclePhotos = (vehicleId?: string) => {
  const [photos, setPhotos] = useState<NewVehiclePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    if (!vehicleId) {
      setPhotos([]);
      return;
    }
    
    setLoading(true);
    console.log('Fetching new photos for vehicle:', vehicleId);
    
    try {
      const { data, error } = await supabase.storage
        .from('vehicles-photos-new')
        .list(`${vehicleId}/`, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      
      // Get metadata to check for main photo flag
      const photosWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('vehicles-photos-new')
            .getPublicUrl(`${vehicleId}/${file.name}`);
          
          // Check if this photo is marked as main by checking if it has a special metadata
          // We'll use the file name pattern to identify main photos
          const isMain = file.name.includes('_main_') || false;
          
          return {
            id: file.id || file.name,
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at || new Date().toISOString(),
            is_main: isMain
          };
        })
      );
      
      console.log('Fetched new photos:', photosWithUrls);
      setPhotos(photosWithUrls);
    } catch (error) {
      console.error('Error fetching new vehicle photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<NewVehiclePhoto | null> => {
    if (!vehicleId) return null;

    try {
      setUploading(true);
      console.log('Uploading new photo for vehicle:', vehicleId);
      
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos.');
      }

      if (file.size > 1048576) { // 1MB
        throw new Error('A imagem deve ter no máximo 1MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${vehicleId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles-photos-new')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles-photos-new')
        .getPublicUrl(filePath);

      const newPhoto: NewVehiclePhoto = {
        id: fileName,
        name: fileName,
        url: publicUrl,
        size: file.size,
        created_at: new Date().toISOString(),
        is_main: photos.length === 0 // First photo is main by default
      };
      
      console.log('New photo uploaded successfully:', newPhoto);
      setPhotos(prev => [...prev, newPhoto]);
      
      toast({
        title: 'Sucesso',
        description: 'Foto nova adicionada com sucesso.',
      });
      
      return newPhoto;
    } catch (error) {
      console.error('Error uploading new photo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar foto nova.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const setMainPhoto = async (photoName: string) => {
    if (!vehicleId) return;

    try {
      console.log('Setting main photo:', photoName);
      
      // Update photos state to mark the selected photo as main
      setPhotos(prev => prev.map(photo => ({
        ...photo,
        is_main: photo.name === photoName
      })));
      
      toast({
        title: 'Sucesso',
        description: 'Foto principal definida com sucesso.',
      });
      
      // Trigger update event for other components
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId } 
      }));
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir foto principal.',
        variant: 'destructive',
      });
    }
  };

  const removePhoto = async (photoName: string) => {
    if (!vehicleId) return;

    try {
      console.log('Removing new photo:', photoName);
      
      // Remover do Storage
      const { error } = await supabase.storage
        .from('vehicles-photos-new')
        .remove([`${vehicleId}/${photoName}`]);

      if (error) throw error;
      
      setPhotos(prev => {
        const updatedPhotos = prev.filter(p => p.name !== photoName);
        // If the removed photo was main, make the first remaining photo main
        if (prev.find(p => p.name === photoName)?.is_main && updatedPhotos.length > 0) {
          updatedPhotos[0].is_main = true;
        }
        return updatedPhotos;
      });
      
      toast({
        title: 'Sucesso',
        description: 'Foto nova removida com sucesso.',
      });
    } catch (error) {
      console.error('Error removing new photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover foto nova.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [vehicleId]);

  return {
    photos,
    loading,
    uploading,
    uploadPhoto,
    removePhoto,
    setMainPhoto,
    refetch: fetchPhotos
  };
};
