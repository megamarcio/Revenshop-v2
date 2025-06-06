
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Copy, Trash2, Eye, DollarSign, Archive, EyeOff } from 'lucide-react';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardButtonsProps {
  vehicle: Vehicle;
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
  onDownloadAll: () => Promise<void>;
  onToggleMinNegotiable: () => void;
  onDelete?: () => void;
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
  onDelete
}: VehicleCardButtonsProps) => {
  return (
    <div className="flex gap-1 pt-2 border-t border-gray-100 justify-center">
      {canEditVehicles && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 w-7 p-0"
          onClick={onEdit}
          title="Editar"
        >
          <Edit className="h-3 w-3" />
        </Button>
      )}
      <Button 
        size="sm" 
        variant="outline" 
        className="h-7 w-7 p-0"
        onClick={onCopyDescription}
        title="Copiar Descrição"
        disabled={!vehicle.description}
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="h-7 w-7 p-0"
        onClick={onCarfaxLookup}
        title="Consultar Carfax"
      >
        <img 
          src="/lovable-uploads/c0940bfc-455c-4f29-b281-d3e148371e8d.png" 
          alt="Carfax" 
          className="h-3 w-3 object-contain"
        />
      </Button>
      {isSeller && vehicle.photos && vehicle.photos.length > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={onDownloadAll}
          disabled={downloading}
          title="Baixar Fotos (ZIP)"
        >
          <Archive className="h-3 w-3" />
        </Button>
      )}
      {isInternalSeller && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={onToggleMinNegotiable}
          title="Ver Mín. Negociável"
        >
          {showMinNegotiable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      )}
      {canViewCostPrices && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 w-7 p-0"
              title="Ver Preço de Compra"
            >
              <DollarSign className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{formatCurrency(vehicle.purchasePrice)}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {canEditVehicles && onDelete && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDelete}
          title="Excluir"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default VehicleCardButtons;
