
import React from 'react';

interface VehiclePhotoThumbnailsProps {
  photos: string[];
  vehicleName: string;
  onPhotoSelect: (index: number) => void;
  selectedIndex: number;
  maxThumbnails?: number;
  className?: string;
}

const VehiclePhotoThumbnails: React.FC<VehiclePhotoThumbnailsProps> = ({
  photos,
  vehicleName,
  onPhotoSelect,
  selectedIndex,
  maxThumbnails = 5,
  className = ''
}) => {
  const visiblePhotos = photos.slice(0, maxThumbnails);

  return (
    <div className={`flex gap-2 ${className}`}>
      {visiblePhotos.map((photo, index) => (
        <button
          key={index}
          onClick={() => onPhotoSelect(index)}
          className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
            index === selectedIndex 
              ? 'border-white shadow-md' 
              : 'border-white/50 hover:border-white/80'
          }`}
        >
          <img
            src={photo}
            alt={`${vehicleName} - Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
      {photos.length > maxThumbnails && (
        <div className="w-12 h-8 bg-black/70 rounded flex items-center justify-center text-white text-xs">
          +{photos.length - maxThumbnails}
        </div>
      )}
    </div>
  );
};

export default VehiclePhotoThumbnails;
