
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';

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
  const { photos: vehiclePhotos } = useVehiclePhotos(vehicleId);
  const { photos: newPhotos } = useNewVehiclePhotos(vehicleId);
  const { cardPhoto } = useVehicleCardPhotos(vehicleId);

  // Compilar todas as fotos disponíveis
  const allPhotos = React.useMemo(() => {
    const photos: string[] = [];
    
    // Adicionar foto do card se existir
    if (cardPhoto?.photo_url) {
      photos.push(cardPhoto.photo_url);
    }
    
    // Adicionar novas fotos
    newPhotos.forEach(photo => {
      if (photo.url && !photos.includes(photo.url)) {
        photos.push(photo.url);
      }
    });
    
    // Adicionar fotos do veículo
    vehiclePhotos.forEach(photo => {
      if (photo.url && !photos.includes(photo.url)) {
        photos.push(photo.url);
      }
    });
    
    // Adicionar fotos fallback
    fallbackPhotos.forEach(photo => {
      if (photo && !photos.includes(photo)) {
        photos.push(photo);
      }
    });
    
    return photos;
  }, [cardPhoto, newPhotos, vehiclePhotos, fallbackPhotos]);

  console.log('🎯 VEHICLE PHOTO VIEWER - Todas as fotos compiladas:', allPhotos);

  const hasMultiplePhotos = allPhotos.length > 1;
  const currentPhoto = allPhotos[currentPhotoIndex];

  // Reset index when photos change
  useEffect(() => {
    if (currentPhotoIndex >= allPhotos.length) {
      setCurrentPhotoIndex(0);
    }
  }, [allPhotos.length, currentPhotoIndex]);

  const handlePrevious = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? allPhotos.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (hasMultiplePhotos) {
      setCurrentPhotoIndex((prev) => 
        prev === allPhotos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDownload = () => {
    if (currentPhoto && onDownloadSingle) {
      onDownloadSingle(currentPhoto, currentPhotoIndex);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Foto Principal */}
      <div className="w-full h-full bg-gray-200 rounded overflow-hidden">
        {currentPhoto ? (
          <img
            src={currentPhoto}
            alt={`${vehicleName} - Foto ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm">Sem foto</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows - Botões menores */}
      {hasMultiplePhotos && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 p-1 h-8 w-8 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 p-1 h-8 w-8 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Download Button */}
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

      {/* Photo Counter */}
      {hasMultiplePhotos && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full shadow-lg">
          {currentPhotoIndex + 1} / {allPhotos.length}
        </div>
      )}
    </div>
  );
};

export default VehiclePhotoViewer;
