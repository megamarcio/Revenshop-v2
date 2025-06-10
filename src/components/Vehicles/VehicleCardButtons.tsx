
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Edit, 
  Copy, 
  Download, 
  Eye, 
  EyeOff,
  Wrench
} from 'lucide-react';
import { VehicleCardProps } from './VehicleCardTypes';

interface VehicleCardButtonsProps {
  vehicle: VehicleCardProps['vehicle'];
  canEditVehicles: boolean;
  canViewCostPrices: boolean;
  isInternalSeller: boolean;
  isSeller: boolean;
  showMinNegotiable: boolean;
  downloading: boolean;
  formatCurrency: (value: number) => string;
  onEdit: () => void;
  onCopyDescription: () => void;
  onCarfaxLookup: () => void;
  onDownloadAll: () => void;
  onToggleMinNegotiable: () => void;
  onDelete?: () => void;
  onViewMaintenance?: () => void;
}

const VehicleCardButtons = ({
  vehicle,
  canEditVehicles,
  canViewCostPrices,
  isInternalSeller,
  isSeller,
  showMinNegotiable,
  downloading,
  formatCurrency,
  onEdit,
  onCopyDescription,
  onCarfaxLookup,
  onDownloadAll,
  onToggleMinNegotiable,
  onDelete,
  onViewMaintenance
}: VehicleCardButtonsProps) => {
  return (
    <div className="space-y-2">
      {/* Primeira linha de botões - menores */}
      <div className="flex gap-1">
        {canEditVehicles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onEdit} size="sm" variant="outline" className="flex-1 h-8 px-2">
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCopyDescription} size="sm" variant="outline" className="flex-1 h-8 px-2">
              <Copy className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copiar Descrição</TooltipContent>
        </Tooltip>

        {vehicle.photos && vehicle.photos.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onDownloadAll} 
                size="sm" 
                variant="outline" 
                className="flex-1 h-8 px-2"
                disabled={downloading}
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Baixar Fotos</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Segunda linha de botões */}
      <div className="flex gap-1">
        {(canViewCostPrices || isInternalSeller) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onToggleMinNegotiable} 
                size="sm" 
                variant="outline" 
                className="flex-1 h-8 px-2"
              >
                {showMinNegotiable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showMinNegotiable ? 'Ocultar' : 'Mostrar'} Mín. Negociável
            </TooltipContent>
          </Tooltip>
        )}

        {(isInternalSeller || canEditVehicles) && onViewMaintenance && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onViewMaintenance} size="sm" variant="outline" className="flex-1 h-8 px-2">
                <Wrench className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Manutenções</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Botão do Carfax separado com logo */}
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onCarfaxLookup} 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 flex items-center gap-2"
            >
              <img 
                src="/lovable-uploads/f4315c70-bf51-4461-916d-f4f2c3305516.png" 
                alt="Carfax" 
                className="h-4 w-auto"
              />
              <span className="text-xs">Carfax</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver Carfax</TooltipContent>
        </Tooltip>
      </div>

      {/* Badge de valor mínimo negociável */}
      {showMinNegotiable && vehicle.minNegotiable && (
        <div className="pt-2">
          <Badge variant="secondary" className="w-full justify-center text-xs">
            Mín: {formatCurrency(parseFloat(vehicle.minNegotiable.toString()))}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VehicleCardButtons;
