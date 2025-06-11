
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
  
  // Use vehicle_photos if vehicleId is provided, otherwise use fallback
  const photos = vehicleId ? vehiclePhotos : fallbackPhotos;
  const mainPhoto = photos.find(p => p.is_main)?.url || photos[0]?.url || fallbackPhotos[0];
  
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
