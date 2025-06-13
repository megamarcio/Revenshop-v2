
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardContentProps {
  vehicle: Vehicle;
  formatCurrency: (amount: number) => string;
  isInternalSeller: boolean;
  showMinNegotiable: boolean;
  minNegotiable?: number;
}

const VehicleCardContent = ({
  vehicle,
  formatCurrency,
  isInternalSeller,
  showMinNegotiable,
  minNegotiable
}: VehicleCardContentProps) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'forSale': return 'À Venda';
      case 'sold': return 'Vendido';
      case 'rental': return 'Aluguel';
      case 'maintenance': return 'Manutenção';
      case 'consigned': return 'Consignado';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'forSale': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rental': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'consigned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm text-gray-900 leading-tight truncate flex-1 mr-2">
          {vehicle.name}
        </h3>
        <Badge className={`text-xs px-2 py-1 ${getCategoryColor(vehicle.category)}`}>
          {getCategoryLabel(vehicle.category)}
        </Badge>
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Ano:</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        <div className="flex justify-between">
          <span>Milhas:</span>
          <span className="font-medium">{Math.floor(vehicle.miles || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Código:</span>
          <span className="font-medium">{vehicle.internalCode}</span>
        </div>
        <div className="flex justify-between">
          <span>Cor:</span>
          <span className="font-medium">{vehicle.color}</span>
        </div>
      </div>

      <div className="pt-2 border-t space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Preço de Venda:</span>
          <span className="font-bold text-sm text-green-600">
            {formatCurrency(vehicle.salePrice)}
          </span>
        </div>
        
        {isInternalSeller && vehicle.profitMargin && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Margem:</span>
            <span className="text-xs font-medium text-blue-600">
              {vehicle.profitMargin.toFixed(1)}%
            </span>
          </div>
        )}

        {showMinNegotiable && minNegotiable && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Mín. Negociável:</span>
            <span className="text-xs font-medium text-orange-600">
              {formatCurrency(minNegotiable)}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleCardContent;
