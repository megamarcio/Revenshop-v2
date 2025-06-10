
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Edit, 
  Copy, 
  ExternalLink, 
  Download, 
  Eye, 
  EyeOff, 
  Trash2,
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
      {/* Primeira linha - todos os botões principais em uma linha */}
      <div className="flex gap-1">
        {canEditVehicles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onEdit} size="sm" variant="outline" className="h-7 w-7 p-0">
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCopyDescription} size="sm" variant="outline" className="h-7 w-7 p-0">
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
                className="h-7 w-7 p-0"
                disabled={downloading}
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Baixar Fotos</TooltipContent>
          </Tooltip>
        )}

        {(canViewCostPrices || isInternalSeller) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onToggleMinNegotiable} 
                size="sm" 
                variant="outline" 
                className="h-7 w-7 p-0"
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
              <Button onClick={onViewMaintenance} size="sm" variant="outline" className="h-7 w-7 p-0">
                <Wrench className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Manutenções</TooltipContent>
          </Tooltip>
        )}

        {canEditVehicles && onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onDelete} size="sm" variant="destructive" className="h-7 w-7 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Segunda linha - botão do Carfax */}
      <div className="flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCarfaxLookup} size="sm" variant="outline" className="w-full h-7 flex items-center gap-1 text-xs">
              <img 
                src="/lovable-uploads/c0940bfc-455c-4f29-b281-d3e148371e8d.png" 
                alt="Carfax" 
                className="h-3 w-auto"
              />
              Carfax
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver Carfax</TooltipContent>
        </Tooltip>
      </div>

      {/* Badge de valor mínimo negociável */}
      {showMinNegotiable && vehicle.minNegotiable && (
        <div className="pt-1">
          <Badge variant="secondary" className="w-full justify-center text-xs">
            Mín: {formatCurrency(parseFloat(vehicle.minNegotiable.toString()))}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default VehicleCardButtons;
