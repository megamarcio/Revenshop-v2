
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Image as ImageIcon } from 'lucide-react';
import VehicleStatusBadge from './VehicleStatusBadge';

interface VehicleCardHeaderProps {
  vehicle: {
    id: string;
    name: string;
    photos: string[];
    category: string;
    extended_category?: string;
    consignment_store?: string;
  };
  onDownloadSingle: (photoUrl: string, index: number) => void;
  onDownloadAll: () => void;
  downloading: boolean;
}

const VehicleCardHeader: React.FC<VehicleCardHeaderProps> = ({
  vehicle,
  onDownloadSingle,
  onDownloadAll,
  downloading
}) => {
  const mainPhoto = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : null;

  return (
    <CardHeader className="p-0 relative">
      {mainPhoto ? (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={mainPhoto}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Status Badge */}
          <VehicleStatusBadge 
            category={vehicle.category}
            extended_category={vehicle.extended_category}
            consignment_store={vehicle.consignment_store}
          />
          
          {/* Download Controls */}
          <div className="absolute top-2 right-2 flex gap-1">
            {vehicle.photos.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={onDownloadAll}
                    disabled={downloading}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar todas as fotos</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => onDownloadSingle(mainPhoto, 0)}
                  disabled={downloading}
                >
                  <ImageIcon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar esta foto</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Photo Count Badge */}
          {vehicle.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{vehicle.photos.length - 1}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <VehicleStatusBadge 
            category={vehicle.category}
            extended_category={vehicle.extended_category}
            consignment_store={vehicle.consignment_store}
          />
        </div>
      )}
    </CardHeader>
  );
};

export default VehicleCardHeader;
