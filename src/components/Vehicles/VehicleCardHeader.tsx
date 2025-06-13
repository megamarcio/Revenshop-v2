
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import VehicleUsageBadge from './VehicleUsageBadge';
import VehiclePhotoViewer from './VehiclePhotoViewer';
import { Vehicle } from './VehicleCardTypes';
import { usePhotoDownload } from '@/hooks/usePhotoDownload';

interface VehicleCardHeaderProps {
  vehicle: Vehicle;
  onDownloadSingle?: (photoUrl: string, index: number) => void;
  onDownloadAll?: () => void;
  downloading?: boolean;
}

// Helper function to determine vehicle usage from vehicle data
const getVehicleUsage = (vehicle: Vehicle): string => {
  // Check if there's specific usage info in description
  if (vehicle.description) {
    const match = vehicle.description.match(/\[USAGE:([^\]]+)\]/);
    if (match) {
      return match[1];
    }
  }
  
  // Check vehicleUsage field directly if available
  if ((vehicle as any).vehicleUsage) {
    return (vehicle as any).vehicleUsage;
  }
  
  // Default mapping based on category
  switch (vehicle.category) {
    case 'rental': return 'rental';
    case 'consigned': return 'consigned';
    case 'maintenance': return 'personal';
    default: return 'sale';
  }
};

const getConsignmentStore = (vehicle: Vehicle): string => {
  if (vehicle.description) {
    const match = vehicle.description.match(/\[STORE:([^\]]+)\]/);
    if (match) {
      return match[1];
    }
  }
  
  // Check consignmentStore field directly if available
  if ((vehicle as any).consignmentStore) {
    return (vehicle as any).consignmentStore;
  }
  
  return vehicle.consignmentStore || '';
};

const VehicleCardHeader = ({ vehicle, downloading = false }: VehicleCardHeaderProps) => {
  const { downloadSinglePhoto, downloadPhotosZip, downloading: isDownloading } = usePhotoDownload();

  const handleDownloadAllPhotos = () => {
    if (vehicle.photos && vehicle.photos.length > 0) {
      downloadPhotosZip(vehicle.photos, vehicle.name);
    }
  };

  const handleDownloadSinglePhoto = (photoUrl: string, index: number) => {
    downloadSinglePhoto(photoUrl, vehicle.name, index + 1);
  };

  const vehicleUsage = getVehicleUsage(vehicle);
  const consignmentStore = getConsignmentStore(vehicle);

  console.log('VehicleCardHeader Debug - vehicle:', vehicle);
  console.log('VehicleCardHeader Debug - vehicleUsage:', vehicleUsage);
  console.log('VehicleCardHeader Debug - consignmentStore:', consignmentStore);

  return (
    <div className="relative">
      {/* Vehicle Usage Badge - Removido o badge "À Venda" */}
      <div className="absolute top-2 left-2 z-10">
        <VehicleUsageBadge 
          usage={vehicleUsage} 
          consignmentStore={consignmentStore}
        />
      </div>

      {/* Photo Download Buttons */}
      {vehicle.photos && vehicle.photos.length > 0 && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadAllPhotos}
                disabled={isDownloading || downloading}
                className="bg-black/50 hover:bg-black/70 text-white border-0 p-1 h-7 w-7"
              >
                {(isDownloading || downloading) ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Package className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar todas as fotos (ZIP)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Vehicle Photo Viewer */}
      <VehiclePhotoViewer
        vehicleId={vehicle.id}
        fallbackPhotos={vehicle.photos}
        vehicleName={vehicle.name}
        className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden"
        onDownloadSingle={handleDownloadSinglePhoto}
      />
    </div>
  );
};

export default VehicleCardHeader;
