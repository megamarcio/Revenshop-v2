
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Image as ImageIcon } from 'lucide-react';
import VehicleStatusBadge from './VehicleStatusBadge';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';

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
  const { photos: vehiclePhotos, loading } = useVehiclePhotos(vehicle.id);
  
  // Use photo from vehicle_photos table if available, otherwise fallback to vehicle.photos
  const mainPhoto = vehiclePhotos.find(p => p.is_main)?.url || vehiclePhotos[0]?.url || vehicle.photos[0];
  const hasPhotos = vehiclePhotos.length > 0 || (vehicle.photos && vehicle.photos.length > 0);

  return (
    <CardHeader className="p-0 relative">
      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        <VehiclePhotoDisplay
          photoUrl={mainPhoto}
          alt={`${vehicle.name} - Foto principal`}
          className="w-full h-full"
          showLoader={loading}
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
                  onClick={() => mainPhoto && onDownloadSingle(mainPhoto, 0)}
                  disabled={downloading || !mainPhoto}
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
