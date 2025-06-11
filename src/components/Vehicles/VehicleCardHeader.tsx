
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Image as ImageIcon } from 'lucide-react';
import VehicleStatusBadge from './VehicleStatusBadge';
import LazyImage from './LazyImage';

interface VehicleCardHeaderProps {
  vehicle: {
    id: string;
    name: string;
    photos: string[];
    category: string;
    extended_category?: string;
    consignment_store?: string;
    main_photo_url?: string;
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
  // Para lazy loading real, vamos usar o vehicleId ao invés da foto direta
  const hasPhotos = vehicle.photos && vehicle.photos.length > 0;

  return (
    <CardHeader className="p-0 relative">
      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        <LazyImage
          vehicleId={vehicle.id}
          alt={`${vehicle.name} - Foto principal`}
          className="w-full h-full"
        />
        
        {/* Status Badge */}
        <VehicleStatusBadge 
          category={vehicle.category}
          extended_category={vehicle.extended_category}
          consignment_store={vehicle.consignment_store}
        />
        
        {/* Download buttons - só mostrar se tiver fotos */}
        {hasPhotos && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => vehicle.photos[0] && onDownloadSingle(vehicle.photos[0], 0)}
                  disabled={downloading || !vehicle.photos[0]}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar esta foto</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
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
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default VehicleCardHeader;
