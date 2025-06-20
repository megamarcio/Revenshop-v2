
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Edit, 
  Copy, 
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
  
  console.log('🎛️ BUTTONS DEBUG - Rendering buttons for vehicle:', vehicle.id);
  console.log('🎛️ BUTTONS DEBUG - Permissions:', { 
    canEditVehicles, 
    canViewCostPrices, 
    isInternalSeller, 
    isSeller 
  });
  
  return (
    <div className="space-y-2 mt-auto">
      {/* Linha única de botões centralizados */}
      <div className="flex justify-center gap-1 flex-wrap">
        {/* Botão de Editar - apenas se tem permissão */}
        {canEditVehicles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onEdit} 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}

        {/* Botão de Copiar Descrição - sempre visível */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onCopyDescription} 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copiar Descrição</TooltipContent>
        </Tooltip>

        {/* Botão de Mostrar/Ocultar Preço Mínimo Negociável */}
        {(canViewCostPrices || isInternalSeller) && vehicle.minNegotiable && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onToggleMinNegotiable} 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                {showMinNegotiable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showMinNegotiable ? 'Ocultar' : 'Mostrar'} Mín. Negociável
            </TooltipContent>
          </Tooltip>
        )}

        {/* Botão de Manutenção */}
        {(isInternalSeller || canEditVehicles) && onViewMaintenance && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onViewMaintenance} 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Wrench className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Manutenções</TooltipContent>
          </Tooltip>
        )}

        {/* Botão do Carfax - sempre visível */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onCarfaxLookup} 
              size="sm" 
              variant="outline" 
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <img 
                src="/lovable-uploads/f4315c70-bf51-4461-916d-f4f2c3305516.png" 
                alt="Carfax" 
                className="h-4 w-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver Carfax</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default VehicleCardButtons;
