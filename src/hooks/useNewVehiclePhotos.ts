
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NewVehiclePhoto {
  id: string;
  vehicle_id: string;
  name: string;
  url: string;
  size: number;
  is_main: boolean;
}

export const useNewVehiclePhotos = (vehicleId?: string) => {
  const [photos, setPhotos] = useState<NewVehiclePhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    if (!vehicleId) {
      setPhotos([]);
      return;
    }

    console.log('Fetching new vehicle photos for:', vehicleId);
    
    try {
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('vehicles-photos-new')
        .list(vehicleId);

      if (storageError) {
        console.error('Storage error:', storageError);
        setPhotos([]);
        return;
      }

      if (!storageFiles || storageFiles.length === 0) {
        setPhotos([]);
        return;
      }

      // Get main photo preference from local storage or metadata
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
      setPhotos(photosData);
    } catch (error) {
      console.error('Error fetching new vehicle photos:', error);
      setPhotos([]);
    }
  };

  const uploadPhoto = async (file: File): Promise<NewVehiclePhoto | null> => {
    if (!vehicleId) return null;
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 3MB.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setUploading(true);
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
        is_main: photos.length === 0
      };

      // If this is the first photo, set it as main in localStorage
      if (photos.length === 0) {
        localStorage.setItem(`mainPhoto_${vehicleId}`, fileName);
      }

      setPhotos(prev => [...prev, newPhoto]);
      
      // Trigger update event for other components
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId, type: 'new' } 
      }));
      
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
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoName: string) => {
    if (!vehicleId) return;

    try {
      const filePath = `${vehicleId}/${photoName}`;
      
      const { error } = await supabase.storage
        .from('vehicles-photos-new')
        .remove([filePath]);

      if (error) throw error;

      // If removing the main photo, set a new main photo
      const photoToRemove = photos.find(p => p.name === photoName);
      const remainingPhotos = photos.filter(photo => photo.name !== photoName);
      
      if (photoToRemove?.is_main && remainingPhotos.length > 0) {
        // Set first remaining photo as main
        localStorage.setItem(`mainPhoto_${vehicleId}`, remainingPhotos[0].name);
      } else if (photoToRemove?.is_main) {
        // No photos left, remove main photo preference
        localStorage.removeItem(`mainPhoto_${vehicleId}`);
      }

      setPhotos(remainingPhotos);
      
      // Trigger update event for other components
      window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
        detail: { vehicleId, type: 'new' } 
      }));
      
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

  const setMainPhoto = async (photoName: string) => {
    console.log('Setting main photo:', photoName);
    
    // Save to localStorage for persistence
    localStorage.setItem(`mainPhoto_${vehicleId}`, photoName);
    
    // Update local state
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      is_main: photo.name === photoName
    })));
    
    // Trigger update event for other components
    window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
      detail: { vehicleId, type: 'new' } 
    }));
    
    toast({
      title: 'Sucesso',
      description: 'Foto principal definida.',
    });
  };

  useEffect(() => {
    fetchPhotos();
  }, [vehicleId]);

  // Listen for photo updates
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
    uploading,
    uploadPhoto,
    removePhoto,
    setMainPhoto,
    refetch: fetchPhotos
  };
};
