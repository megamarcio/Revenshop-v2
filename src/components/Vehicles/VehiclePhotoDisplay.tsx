
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehiclePhotoDisplayProps {
  photos?: string[];
  photoUrl?: string;
  vehicleName?: string;
  alt?: string;
  className?: string;
  showLoader?: boolean;
  onDownloadSingle?: (photoUrl: string, index: number) => Promise<void>;
  onDownloadAll?: () => Promise<void>;
  showCarousel?: boolean;
}

const VehiclePhotoDisplay: React.FC<VehiclePhotoDisplayProps> = ({ 
  photos,
  photoUrl, 
  vehicleName,
  alt = 'Vehicle photo', 
  className = '',
  showLoader = false,
  onDownloadSingle,
  onDownloadAll,
  showCarousel = true
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Se photos array é fornecido, use-o; caso contrário use single photoUrl
  const displayPhotos = photos || (photoUrl ? [photoUrl] : []);
  const currentPhoto = displayPhotos[currentPhotoIndex];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % displayPhotos.length);
    setImageError(false);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
    setImageError(false);
  };

  if (showLoader) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!currentPhoto || imageError) {
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
        onError={() => setImageError(true)}
      />
      
      {/* Controles de navegação para múltiplas fotos */}
      {showCarousel && displayPhotos.length > 1 && (
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
          
          {/* Indicadores de posição */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {displayPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPhotoIndex(index);
                  setImageError(false);
                }}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Contador de fotos */}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentPhotoIndex + 1} / {displayPhotos.length}
          </div>
        </>
      )}
      
      {/* Botões de download */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {/* Download de foto individual */}
        {onDownloadSingle && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownloadSingle(currentPhoto, currentPhotoIndex)}
            className="bg-white/90 hover:bg-white text-gray-700 shadow-md p-1"
          >
            <Download className="h-3 w-3" />
          </Button>
        )}
        
        {/* Download de todas as fotos */}
        {onDownloadAll && displayPhotos.length > 1 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownloadAll}
            className="bg-white/90 hover:bg-white text-gray-700 shadow-md p-1"
          >
            <Download className="h-3 w-3" />
            <span className="ml-1 text-xs">ZIP</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehiclePhotoDisplay;
