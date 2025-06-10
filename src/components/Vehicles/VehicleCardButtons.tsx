
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
      {/* Primeira linha de botões */}
      <div className="flex gap-1">
        {canEditVehicles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onEdit} size="sm" variant="outline" className="flex-1">
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCopyDescription} size="sm" variant="outline" className="flex-1">
              <Copy className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copiar Descrição</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCarfaxLookup} size="sm" variant="outline" className="flex-1">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Carfax</TooltipContent>
        </Tooltip>

        {vehicle.photos && vehicle.photos.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onDownloadAll} 
                size="sm" 
                variant="outline" 
                className="flex-1"
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
                className="flex-1"
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
              <Button onClick={onViewMaintenance} size="sm" variant="outline" className="flex-1">
                <Wrench className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Manutenções</TooltipContent>
          </Tooltip>
        )}

        {canEditVehicles && onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onDelete} size="sm" variant="destructive" className="flex-1">
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        )}
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
