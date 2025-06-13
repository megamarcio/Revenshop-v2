
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehiclePhotoGalleryProps {
  photos: string[];
  vehicleName: string;
  className?: string;
  selectedIndex?: number;
  onPhotoSelect?: (index: number) => void;
}

const VehiclePhotoGallery: React.FC<VehiclePhotoGalleryProps> = ({
  photos,
  vehicleName,
  className = '',
  selectedIndex = 0,
  onPhotoSelect
}) => {
  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Sem fotos disponíveis</p>
      </div>
    );
  }

  const currentIndex = Math.max(0, Math.min(selectedIndex, photos.length - 1));

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onPhotoSelect?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onPhotoSelect?.(newIndex);
  };

  return (
    <div className={`relative group ${className}`}>
      <VehiclePhotoDisplay
        photoUrl={photos[currentIndex]}
        alt={`${vehicleName} - Foto ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {photos.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Photo Counter */}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
};

export default VehiclePhotoGallery;
