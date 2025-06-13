
import React from 'react';
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
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm text-gray-900 leading-tight truncate flex-1 mr-2">
          {vehicle.name}
        </h3>
        {/* Removido o Badge de categoria conforme solicitado */}
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
