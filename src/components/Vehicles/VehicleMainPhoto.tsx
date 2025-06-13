
import React from 'react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';
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
  const { cardPhoto, loading: cardPhotoLoading } = useVehicleCardPhotos(vehicleId);
  
  // PRIORIDADE MÁXIMA: Foto do card sempre será a foto principal nos cards
  let mainPhoto: string | undefined;
  
  if (vehicleId) {
    // Priority 1: Card photo (SEMPRE tem prioridade máxima)
    if (cardPhoto?.photo_url) {
      console.log('Using card photo as main (PRIORITY):', cardPhoto.photo_url);
      mainPhoto = cardPhoto.photo_url;
    }
    // Priority 2: Check for main photo in new photos
    else if (newPhotos.length > 0) {
      const mainNewPhoto = newPhotos.find(p => p.is_main);
      if (mainNewPhoto) {
        console.log('Using main new photo:', mainNewPhoto.url);
        mainPhoto = mainNewPhoto.url;
      } else {
        console.log('Using first new photo:', newPhotos[0].url);
        mainPhoto = newPhotos[0].url;
      }
    }
    // Priority 3: Fallback to vehicle photos
    else if (vehiclePhotos.length > 0) {
      const mainPhotoObj = vehiclePhotos.find(p => p.is_main);
      mainPhoto = mainPhotoObj?.url || vehiclePhotos[0]?.url;
      console.log('Using vehicle photo:', mainPhoto);
    }
  } else if (fallbackPhotos.length > 0) {
    // Use fallback photos (strings)
    mainPhoto = fallbackPhotos[0];
    console.log('Using fallback photo:', mainPhoto);
  }
  
  const isLoading = vehicleId ? (vehicleLoading || newPhotosUploading || cardPhotoLoading) : false;
  
  console.log('VehicleMainPhoto - vehicleId:', vehicleId);
  console.log('VehicleMainPhoto - cardPhoto (PRIORITY):', cardPhoto?.photo_url);
  console.log('VehicleMainPhoto - newPhotos count:', newPhotos.length);
  console.log('VehicleMainPhoto - vehiclePhotos count:', vehiclePhotos.length);
  console.log('VehicleMainPhoto - selected mainPhoto:', mainPhoto);
  
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
