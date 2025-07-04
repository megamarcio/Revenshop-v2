import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  url: string;
  position: number | null;
  is_main: boolean | null;
}

export const useVehiclePhotos = (vehicleId?: string) => {
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    if (!vehicleId) {
      setPhotos([]);
      return;
    }
    
    setLoading(true);
    console.log('Fetching photos for vehicle:', vehicleId);
    
    try {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('position', { ascending: true });

      if (error) throw error;
      
      console.log('Fetched photos:', data);
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching vehicle photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<VehiclePhoto | null> => {
    if (!vehicleId) return null;

    try {
      setUploading(true);
      console.log('Uploading photo for vehicle:', vehicleId);
      
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos.');
      }

      if (file.size > 3 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 3MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${vehicleId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(filePath);

      // Salvar no banco de dados
      const nextPosition = photos.length > 0 ? Math.max(...photos.map(p => p.position || 0)) + 1 : 1;
      const isMain = photos.length === 0;

      const { data: photoData, error: dbError } = await supabase
        .from('vehicle_photos')
        .insert({
          vehicle_id: vehicleId,
          url: publicUrl,
          position: nextPosition,
          is_main: isMain
        })
        .select()
        .single();

      if (dbError) throw dbError;
      
      console.log('Photo uploaded successfully:', photoData);
      setPhotos(prev => [...prev, photoData].sort((a, b) => (a.position || 0) - (b.position || 0)));
      
      // Forçar atualização na tela principal
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId, photos: [...photos, photoData] } 
      }));
      
      toast({
        title: 'Sucesso',
        description: 'Foto adicionada com sucesso.',
      });
      
      return photoData;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar foto.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      console.log('Removing photo:', photoId);
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Extrair path do storage da URL
      const url = new URL(photo.url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'vehicle-photos');
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
        
        // Remover do Storage
        await supabase.storage
          .from('vehicle-photos')
          .remove([storagePath]);
      }

      // Remover do banco de dados
      const { error: dbError } = await supabase
        .from('vehicle_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;
      
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      setPhotos(updatedPhotos);
      
      // Forçar atualização na tela principal
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId, photos: updatedPhotos } 
      }));
      
      toast({
        title: 'Sucesso',
        description: 'Foto removida com sucesso.',
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover foto.',
        variant: 'destructive',
      });
    }
  };

  const setMainPhoto = async (photoId: string) => {
    try {
      console.log('Setting main photo:', photoId);
      
      // Primeiro, remove a marca principal de todas as fotos
      await supabase
        .from('vehicle_photos')
        .update({ is_main: false })
        .eq('vehicle_id', vehicleId);

      // Depois, marca a foto selecionada como principal
      const { error } = await supabase
        .from('vehicle_photos')
        .update({ is_main: true })
        .eq('id', photoId);

      if (error) throw error;
      
      const updatedPhotos = photos.map(p => ({ 
        ...p, 
        is_main: p.id === photoId 
      }));
      setPhotos(updatedPhotos);
      
      // Forçar atualização na tela principal
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId, photos: updatedPhotos } 
      }));
      
      toast({
        title: 'Sucesso',
        description: 'Foto principal atualizada.',
      });
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir foto principal.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [vehicleId]);

  // Listener para atualizações de fotos
  useEffect(() => {
    const handlePhotosUpdate = (event: any) => {
      if (event.detail.vehicleId === vehicleId) {
        fetchPhotos();
      }
    };

    window.addEventListener('vehiclePhotosUpdated', handlePhotosUpdate);
    return () => window.removeEventListener('vehiclePhotosUpdated', handlePhotosUpdate);
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
