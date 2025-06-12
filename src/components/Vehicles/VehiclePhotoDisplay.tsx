
import React from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface VehiclePhotoDisplayProps {
  photoUrl?: string;
  alt: string;
  className?: string;
  showLoader?: boolean;
}

const VehiclePhotoDisplay: React.FC<VehiclePhotoDisplayProps> = ({ 
  photoUrl, 
  alt, 
  className = '',
  showLoader = false
}) => {
  if (showLoader) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!photoUrl) {
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
    <img
      src={photoUrl}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
};

export default VehiclePhotoDisplay;
