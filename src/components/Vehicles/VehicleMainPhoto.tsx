
import React from 'react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
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
  const { photos: vehiclePhotos, loading } = useVehiclePhotos(vehicleId);
  
  // Determine the main photo URL based on whether we have vehicleId or not
  let mainPhoto: string | undefined;
  
  if (vehicleId && vehiclePhotos.length > 0) {
    // Use vehicle_photos from database - find main photo or use first one
    const mainPhotoObj = vehiclePhotos.find(p => p.is_main);
    mainPhoto = mainPhotoObj?.url || vehiclePhotos[0]?.url;
  } else if (fallbackPhotos.length > 0) {
    // Use fallback photos (strings)
    mainPhoto = fallbackPhotos[0];
  }
  
  return (
    <VehiclePhotoDisplay
      photoUrl={mainPhoto}
      alt={`${vehicleName} - Foto principal`}
      className={className}
      showLoader={showLoader || (vehicleId ? loading : false)}
    />
  );
};

export default VehicleMainPhoto;
