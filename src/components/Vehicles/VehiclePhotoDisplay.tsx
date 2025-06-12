
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehiclePhotoDisplayProps {
  photos?: string[];
  photoUrl?: string;
  vehicleName?: string;
  alt?: string;
  className?: string;
  showLoader?: boolean;
  onDownloadSingle?: (photoUrl: string, index: number) => Promise<void>;
}

const VehiclePhotoDisplay: React.FC<VehiclePhotoDisplayProps> = ({ 
  photos,
  photoUrl, 
  vehicleName,
  alt = 'Vehicle photo', 
  className = '',
  showLoader = false,
  onDownloadSingle
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // If photos array is provided, use it; otherwise use single photoUrl
  const displayPhotos = photos || (photoUrl ? [photoUrl] : []);
  const currentPhoto = displayPhotos[currentPhotoIndex];

  if (showLoader) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!currentPhoto) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Sem foto</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={currentPhoto}
        alt={alt}
        className="w-full h-48 object-cover rounded-t-lg"
        loading="lazy"
      />
      
      {/* Photo navigation for multiple photos */}
      {displayPhotos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {displayPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Download button for individual photos */}
      {onDownloadSingle && (
        <div className="absolute bottom-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownloadSingle(currentPhoto, currentPhotoIndex)}
            className="bg-white/90 hover:bg-white text-gray-700 shadow-md p-1"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehiclePhotoDisplay;
