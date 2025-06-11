
import React, { useState } from 'react';
import VehiclePhotoGallery from './VehiclePhotoGallery';
import VehiclePhotoThumbnails from './VehiclePhotoThumbnails';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';

interface VehiclePhotoViewerProps {
  vehicleId?: string;
  fallbackPhotos?: string[];
  vehicleName: string;
  className?: string;
}

const VehiclePhotoViewer: React.FC<VehiclePhotoViewerProps> = ({
  vehicleId,
  fallbackPhotos = [],
  vehicleName,
  className = ''
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const { photos: vehiclePhotos, loading } = useVehiclePhotos(vehicleId);
  
  // Use vehicle_photos if vehicleId is provided, otherwise use fallback
  const photos = vehicleId ? vehiclePhotos.map(p => p.url) : fallbackPhotos;
  
  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Sem fotos disponíveis</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <VehiclePhotoGallery
        photos={photos}
        vehicleName={vehicleName}
        className="w-full h-48"
      />
      
      {photos.length > 1 && (
        <VehiclePhotoThumbnails
          photos={photos}
          vehicleName={vehicleName}
          selectedIndex={selectedPhotoIndex}
          onPhotoSelect={setSelectedPhotoIndex}
          maxThumbnails={5}
        />
      )}
    </div>
  );
};

export default VehiclePhotoViewer;
