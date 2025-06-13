
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import VehicleMainPhoto from './VehicleMainPhoto';
import VehiclePhotoThumbnails from './VehiclePhotoThumbnails';

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  console.log('🎯 VEHICLE PHOTO VIEWER DEBUG - Props recebidas:');
  console.log('- vehicleId:', vehicleId);
  console.log('- fallbackPhotos:', fallbackPhotos);
  console.log('- vehicleName:', vehicleName);
  console.log('- className:', className);

  // Determinar fotos disponíveis
  const availablePhotos = fallbackPhotos || [];
  console.log('🎯 VEHICLE PHOTO VIEWER DEBUG - Fotos disponíveis:', availablePhotos);

  const hasMultiplePhotos = availablePhotos.length > 1;
  const currentPhoto = availablePhotos[currentPhotoIndex];

  console.log('🎯 VEHICLE PHOTO VIEWER DEBUG - Tem múltiplas fotos:', hasMultiplePhotos);
  console.log('🎯 VEHICLE PHOTO VIEWER DEBUG - Foto atual:', currentPhoto);
  console.log('🎯 VEHICLE PHOTO VIEWER DEBUG - Índice atual:', currentPhotoIndex);

  const handlePrevious = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? availablePhotos.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => 
        prev === availablePhotos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  const handleDownload = () => {
    if (currentPhoto && onDownloadSingle) {
      onDownloadSingle(currentPhoto, currentPhotoIndex);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Foto Principal */}
      <VehicleMainPhoto
        vehicleId={vehicleId}
        fallbackPhotos={[currentPhoto].filter(Boolean)}
        vehicleName={vehicleName}
        className="w-full h-full"
        showLoader={false}
      />

      {/* Navigation Arrows - Sempre visíveis quando há múltiplas fotos */}
      {hasMultiplePhotos && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 p-2 h-10 w-10 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 p-2 h-10 w-10 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Download Button - Sempre visível quando há foto */}
      {currentPhoto && onDownloadSingle && (
        <div className="absolute top-2 right-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 p-2 h-9 w-9 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar esta foto</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Photo Counter - Sempre visível quando há múltiplas fotos */}
      {hasMultiplePhotos && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full shadow-lg">
          {currentPhotoIndex + 1} / {availablePhotos.length}
        </div>
      )}

      {/* Thumbnails - Sempre visíveis quando há múltiplas fotos */}
      {hasMultiplePhotos && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <VehiclePhotoThumbnails
            photos={availablePhotos}
            vehicleName={vehicleName}
            onPhotoSelect={handleThumbnailClick}
            selectedIndex={currentPhotoIndex}
            maxThumbnails={5}
            className="bg-black/50 p-3 rounded-xl backdrop-blur-sm shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default VehiclePhotoViewer;
