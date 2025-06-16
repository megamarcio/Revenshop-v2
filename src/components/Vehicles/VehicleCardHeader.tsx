
import React, { useState } from 'react';
import { Download, Download as DownloadIcon, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import VehiclePhotoViewer from './VehiclePhotoViewer';
import VehicleUsageBadge from './VehicleUsageBadge';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardHeaderProps {
  vehicle: Vehicle;
  onDownloadSingle: (photoUrl: string, index: number) => Promise<void>;
  onDownloadAll: () => Promise<void>;
  downloading: boolean;
}

const VehicleCardHeader = ({ 
  vehicle, 
  onDownloadSingle, 
  onDownloadAll, 
  downloading 
}: VehicleCardHeaderProps) => {
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Extrair o uso do veículo da descrição ou usar o campo vehicleUsage
  const getVehicleUsage = () => {
    if (vehicle.description) {
      const usageMatch = vehicle.description.match(/\[USAGE:([^\]]+)\]/);
      if (usageMatch) {
        return usageMatch[1];
      }
    }
    
    // Fallback para categoria se não houver uso específico
    if (vehicle.category === 'rental') return 'rental';
    if (vehicle.category === 'consigned') return 'consigned';
    if (vehicle.category === 'maintenance') return 'maintenance';
    return 'sale'; // Default
  };

  const vehicleUsage = getVehicleUsage();

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowPhotoViewer(true);
  };

  const handleDownloadSingle = async (photoUrl: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await onDownloadSingle(photoUrl, index);
  };

  return (
    <>
      <div className="relative">
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <div className="relative cursor-pointer" onClick={() => handlePhotoClick(0)}>
            <img
              src={vehicle.photos[0]}
              alt={vehicle.name}
              className="w-full h-48 object-cover rounded-t-lg"
              loading="lazy"
            />
            
            {/* Badge de uso do veículo */}
            <div className="absolute top-2 left-2">
              <VehicleUsageBadge usage={vehicleUsage} />
            </div>

            {/* Contador de fotos */}
            {vehicle.photos.length > 1 && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {vehicle.photos.length}
                </Badge>
              </div>
            )}

            {/* Botões de download */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 bg-black/70 hover:bg-black/80 border-0"
                    onClick={(e) => handleDownloadSingle(vehicle.photos[0], 0, e)}
                    disabled={downloading}
                  >
                    <DownloadIcon className="w-3 h-3 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar esta foto</p>
                </TooltipContent>
              </Tooltip>

              {vehicle.photos.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 bg-black/70 hover:bg-black/80 border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadAll();
                      }}
                      disabled={downloading}
                    >
                      <Download className="w-3 h-3 text-white mr-1" />
                      <span className="text-xs text-white">Todas</span>
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
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
            <div className="text-gray-400 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Sem foto</p>
            </div>
            
            {/* Badge de uso do veículo mesmo sem foto */}
            <div className="absolute top-2 left-2">
              <VehicleUsageBadge usage={vehicleUsage} />
            </div>
          </div>
        )}
      </div>

      {showPhotoViewer && (
        <VehiclePhotoViewer
          photos={vehicle.photos || []}
          currentIndex={currentPhotoIndex}
          onClose={() => setShowPhotoViewer(false)}
          onPrevious={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
          onNext={() => setCurrentPhotoIndex(Math.min(vehicle.photos.length - 1, currentPhotoIndex + 1))}
          vehicleName={vehicle.name}
        />
      )}
    </>
  );
};

export default VehicleCardHeader;
