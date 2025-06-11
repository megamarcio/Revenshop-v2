
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehiclePhotoGalleryProps {
  photos: string[];
  vehicleName: string;
  className?: string;
}

const VehiclePhotoGallery: React.FC<VehiclePhotoGalleryProps> = ({
  photos,
  vehicleName,
  className = ''
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Sem fotos disponíveis</p>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className={`relative ${className}`}>
      <VehiclePhotoDisplay
        photoUrl={photos[currentPhotoIndex]}
        alt={`${vehicleName} - Foto ${currentPhotoIndex + 1}`}
        className="w-full h-full"
      />
      
      {photos.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={prevPhoto}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={nextPhoto}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full">
          <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={photos[currentPhotoIndex]}
              alt={`${vehicleName} - Visualização completa`}
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclePhotoGallery;
