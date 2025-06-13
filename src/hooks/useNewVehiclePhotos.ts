
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { NewVehiclePhoto } from './useNewVehiclePhotos/types';
import { 
  fetchNewVehiclePhotos, 
  uploadNewVehiclePhoto, 
  removeNewVehiclePhoto 
} from './useNewVehiclePhotos/operations';
import { 
  setMainPhotoInStorage, 
  updateMainPhotoStatus, 
  handleMainPhotoRemoval, 
  triggerPhotoUpdateEvent 
} from './useNewVehiclePhotos/utils';

export { NewVehiclePhoto };

export const useNewVehiclePhotos = (vehicleId?: string) => {
  const [photos, setPhotos] = useState<NewVehiclePhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    if (!vehicleId) {
      setPhotos([]);
      return;
    }

    const photosData = await fetchNewVehiclePhotos(vehicleId);
    setPhotos(photosData);
  };

  const uploadPhoto = async (file: File): Promise<NewVehiclePhoto | null> => {
    if (!vehicleId) return null;

    try {
      setUploading(true);
      const newPhoto = await uploadNewVehiclePhoto(vehicleId, file);
      
      if (newPhoto) {
        // If this is the first photo, set it as main in localStorage
        if (photos.length === 0) {
          setMainPhotoInStorage(vehicleId, newPhoto.name);
          newPhoto.is_main = true;
        }

        setPhotos(prev => [...prev, newPhoto]);
        triggerPhotoUpdateEvent(vehicleId);
      }

      return newPhoto;
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoName: string) => {
    if (!vehicleId) return;

    try {
      await removeNewVehiclePhoto(vehicleId, photoName);
      
      const updatedPhotos = handleMainPhotoRemoval(photos, photoName, vehicleId);
      setPhotos(updatedPhotos);
      triggerPhotoUpdateEvent(vehicleId);
    } catch (error) {
      console.error('Error in removePhoto:', error);
    }
  };

  const setMainPhoto = async (photoName: string) => {
    console.log('Setting main photo:', photoName);
    
    // Save to localStorage for persistence
    setMainPhotoInStorage(vehicleId!, photoName);
    
    // Update local state
    setPhotos(prev => updateMainPhotoStatus(prev, photoName));
    
    // Trigger update event for other components
    triggerPhotoUpdateEvent(vehicleId!);
    
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
