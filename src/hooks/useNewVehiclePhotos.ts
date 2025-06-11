
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NewVehiclePhoto {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
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
      
      const photosWithUrls = data?.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('vehicles-photos-new')
          .getPublicUrl(`${vehicleId}/${file.name}`);
          
        return {
          id: file.id || file.name,
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at || new Date().toISOString()
        };
      }) || [];
      
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
        created_at: new Date().toISOString()
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

  const removePhoto = async (photoName: string) => {
    if (!vehicleId) return;

    try {
      console.log('Removing new photo:', photoName);
      
      // Remover do Storage
      const { error } = await supabase.storage
        .from('vehicles-photos-new')
        .remove([`${vehicleId}/${photoName}`]);

      if (error) throw error;
      
      setPhotos(prev => prev.filter(p => p.name !== photoName));
      
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
    refetch: fetchPhotos
  };
};
