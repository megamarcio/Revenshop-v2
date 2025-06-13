
import React from 'react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehicleMainPhotoProps {
  vehicleId?: string;
  fallbackPhotos?: string[];
  vehicleName: string;
  className?: string;
  showLoader?: boolean;
}

const VehicleMainPhoto: React.FC<VehicleMainPhotoProps> = ({
  vehicleId,
  fallbackPhotos = [],
  vehicleName,
  className = '',
  showLoader = false
}) => {
  const { photos: vehiclePhotos, loading: vehicleLoading } = useVehiclePhotos(vehicleId);
  const { photos: newPhotos, uploading: newPhotosUploading } = useNewVehiclePhotos(vehicleId);
  
  // Determine the main photo URL based on priority: new photos (main) > vehicle photos (main) > fallback
  let mainPhoto: string | undefined;
  
  if (vehicleId) {
    // Check for main photo in new photos first
    const mainNewPhoto = newPhotos.find(p => p.is_main);
    if (mainNewPhoto) {
      mainPhoto = mainNewPhoto.url;
    } else if (newPhotos.length > 0) {
      // Use first new photo if no main is set
      mainPhoto = newPhotos[0].url;
    } else if (vehiclePhotos.length > 0) {
      // Fallback to vehicle photos
      const mainPhotoObj = vehiclePhotos.find(p => p.is_main);
      mainPhoto = mainPhotoObj?.url || vehiclePhotos[0]?.url;
    }
  } else if (fallbackPhotos.length > 0) {
    // Use fallback photos (strings)
    mainPhoto = fallbackPhotos[0];
  }
  
  const isLoading = vehicleId ? (vehicleLoading || newPhotosUploading) : false;
  
  return (
    <VehiclePhotoDisplay
      photoUrl={mainPhoto}
      alt={`${vehicleName} - Foto principal`}
      className={className}
      showLoader={showLoader || isLoading}
    />
  );
};

export default VehicleMainPhoto;
