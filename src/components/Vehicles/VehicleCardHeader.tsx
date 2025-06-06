
import React, { useState } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { VehicleCardData } from './VehicleCardTypes';

interface VehicleCardHeaderProps {
  vehicle: VehicleCardData;
  onDownloadSingle: (photoUrl: string, index: number) => void;
  onDownloadAll: () => void;
  downloading: boolean;
}

const VehicleCardHeader = ({ 
  vehicle, 
  onDownloadSingle, 
  onDownloadAll, 
  downloading 
}: VehicleCardHeaderProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = vehicle.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <CardHeader className="p-0 relative">
      {currentPhoto ? (
        <div className="relative group">
          <img 
            src={currentPhoto} 
            alt={vehicle.name}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Navigation arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePreviousPhoto}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextPhoto}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Photo counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          )}

          {/* Download buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white p-1 h-7 w-7"
                  onClick={() => onDownloadSingle(currentPhoto, currentPhotoIndex)}
                  disabled={downloading}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar esta foto</p>
              </TooltipContent>
            </Tooltip>

            {photos.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white p-1 h-7 w-7"
                    onClick={onDownloadAll}
                    disabled={downloading}
                  >
                    <ImageIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar todas as fotos</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </CardHeader>
  );
};

export default VehicleCardHeader;
