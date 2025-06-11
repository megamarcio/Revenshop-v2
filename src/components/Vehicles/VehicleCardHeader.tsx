
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
  // TESTE: Sem fotos durante o teste de performance
  const mainPhoto = null;
  const hasPhotos = false;

  return (
    <CardHeader className="p-0 relative">
      {/* TESTE: Sempre mostrar placeholder sem foto durante teste */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">TESTE: Sem fotos</p>
        </div>
        
        {/* Status Badge */}
        <VehicleStatusBadge 
          category={vehicle.category}
          extended_category={vehicle.extended_category}
          consignment_store={vehicle.consignment_store}
        />
        
        {/* TESTE: Botões de download desabilitados */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                disabled={true}
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download desabilitado (modo teste)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                disabled={true}
              >
                <ImageIcon className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download desabilitado (modo teste)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </CardHeader>
  );
};

export default VehicleCardHeader;
