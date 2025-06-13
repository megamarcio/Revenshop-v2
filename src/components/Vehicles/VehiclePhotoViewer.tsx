
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import VehiclePhotoGallery from './VehiclePhotoGallery';
import VehiclePhotoThumbnails from './VehiclePhotoThumbnails';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';

interface VehiclePhotoViewerProps {
  vehicleId?: string;
  fallbackPhotos?: string[];
  vehicleName: string;
  className?: string;
  onDownloadSingle?: (photoUrl: string, index: number) => void;
}

const VehiclePhotoViewer: React.FC<VehiclePhotoViewerProps> = ({
  vehicleId,
  fallbackPhotos = [],
  vehicleName,
  className = '',
  onDownloadSingle
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const { photos: vehiclePhotos, loading } = useVehiclePhotos(vehicleId);
  
  // Use vehicle_photos if vehicleId is provided, otherwise use fallback
  const photos = vehicleId ? vehiclePhotos.map(p => p.url) : fallbackPhotos;
  
  const handleDownloadCurrentPhoto = async () => {
    if (photos && photos[selectedPhotoIndex] && onDownloadSingle) {
      setDownloading(true);
      try {
        await onDownloadSingle(photos[selectedPhotoIndex], selectedPhotoIndex);
      } finally {
        setDownloading(false);
      }
    }
  };

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
    <div className={`space-y-3 relative ${className}`}>
      {/* Individual Photo Download Button */}
      {onDownloadSingle && photos.length > 0 && (
        <div className="absolute bottom-2 right-2 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadCurrentPhoto}
                disabled={downloading}
                className="bg-black/50 hover:bg-black/70 text-white border-0 p-1 h-7 w-7"
              >
                {downloading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar esta foto</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <VehiclePhotoGallery
        photos={photos}
        vehicleName={vehicleName}
        className="w-full h-48"
        selectedIndex={selectedPhotoIndex}
        onPhotoSelect={setSelectedPhotoIndex}
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
