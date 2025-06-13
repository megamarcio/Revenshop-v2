
import { NewVehiclePhoto } from './types';

export const setMainPhotoInStorage = (vehicleId: string, photoName: string): void => {
  localStorage.setItem(`mainPhoto_${vehicleId}`, photoName);
};

export const removeMainPhotoFromStorage = (vehicleId: string): void => {
  localStorage.removeItem(`mainPhoto_${vehicleId}`);
};

export const updateMainPhotoStatus = (photos: NewVehiclePhoto[], photoName: string): NewVehiclePhoto[] => {
  return photos.map(photo => ({
    ...photo,
    is_main: photo.name === photoName
  }));
};

export const handleMainPhotoRemoval = (
  photos: NewVehiclePhoto[], 
  removedPhotoName: string, 
  vehicleId: string
): NewVehiclePhoto[] => {
  const photoToRemove = photos.find(p => p.name === removedPhotoName);
  const remainingPhotos = photos.filter(photo => photo.name !== removedPhotoName);
  
  if (photoToRemove?.is_main && remainingPhotos.length > 0) {
    // Set first remaining photo as main
    setMainPhotoInStorage(vehicleId, remainingPhotos[0].name);
    remainingPhotos[0].is_main = true;
  } else if (photoToRemove?.is_main) {
    // No photos left, remove main photo preference
    removeMainPhotoFromStorage(vehicleId);
  }

  return remainingPhotos;
};

export const triggerPhotoUpdateEvent = (vehicleId: string): void => {
  window.dispatchEvent(new CustomEvent('vehiclePhotosUpdated', { 
    detail: { vehicleId, type: 'new' } 
  }));
};
