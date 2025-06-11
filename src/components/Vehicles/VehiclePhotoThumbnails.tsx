
import React from 'react';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehiclePhotoThumbnailsProps {
  photos: string[];
  vehicleName: string;
  onPhotoSelect?: (index: number) => void;
  selectedIndex?: number;
  maxThumbnails?: number;
  className?: string;
}

const VehiclePhotoThumbnails: React.FC<VehiclePhotoThumbnailsProps> = ({
  photos,
  vehicleName,
  onPhotoSelect,
  selectedIndex = 0,
  maxThumbnails = 5,
  className = ''
}) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  const displayPhotos = photos.slice(0, maxThumbnails);
  const remainingCount = photos.length - maxThumbnails;

  return (
    <div className={`flex gap-2 ${className}`}>
      {displayPhotos.map((photo, index) => (
        <div
          key={index}
          className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
            selectedIndex === index ? 'border-blue-500' : 'border-gray-200'
          }`}
          onClick={() => onPhotoSelect?.(index)}
        >
          <VehiclePhotoDisplay
            photoUrl={photo}
            alt={`${vehicleName} - Miniatura ${index + 1}`}
            className="w-16 h-12"
          />
          {index === maxThumbnails - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VehiclePhotoThumbnails;
