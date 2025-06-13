
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
      {/* Foto Principal - AQUI ESTÁ O COMPONENTE QUE DEVE MOSTRAR A FOTO! */}
      <VehicleMainPhoto
        vehicleId={vehicleId}
        fallbackPhotos={[currentPhoto].filter(Boolean)}
        vehicleName={vehicleName}
        className="w-full h-full"
        showLoader={false}
      />

      {/* Navigation Arrows */}
      {hasMultiplePhotos && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Download Button */}
      {currentPhoto && onDownloadSingle && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-black/50 hover:bg-black/70 text-white border-0 p-1 h-7 w-7"
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar esta foto</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Photo Counter */}
      {hasMultiplePhotos && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {currentPhotoIndex + 1} / {availablePhotos.length}
        </div>
      )}

      {/* Thumbnails */}
      {hasMultiplePhotos && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <VehiclePhotoThumbnails
            photos={availablePhotos}
            vehicleName={vehicleName}
            onPhotoSelect={handleThumbnailClick}
            selectedIndex={currentPhotoIndex}
            maxThumbnails={5}
            className="bg-black/20 p-2 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default VehiclePhotoViewer;
