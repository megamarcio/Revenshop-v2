
import React from 'react';
import { Vehicle } from './VehicleCardTypes';

interface VehicleCardContentProps {
  vehicle: Vehicle;
  formatCurrency: (value: number) => string;
  isInternalSeller: boolean;
  showMinNegotiable: boolean;
  minNegotiable: number;
}

const VehicleCardContent = ({ 
  vehicle, 
  formatCurrency, 
  isInternalSeller, 
  showMinNegotiable, 
  minNegotiable 
}: VehicleCardContentProps) => {
  return (
    <div className="space-y-2">
      <div className="text-center">
        <h3 className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">
          {vehicle.internalCode} - {vehicle.name}
        </h3>
        <p className="text-xs text-gray-600">{vehicle.year} • {vehicle.color}</p>
      </div>

      <div className="bg-gray-50 p-1.5 rounded text-center">
        <span className="text-[11px] text-gray-500 font-bold tracking-wide block">
          VIN: {vehicle.vin}
        </span>
        <span className="text-[11px] text-gray-600 mt-1 block font-bold">
          Milhas: {vehicle.miles}
        </span>
      </div>

      <div className="bg-green-50 p-2 rounded border border-green-200">
        <span className="text-xs text-green-600 block text-center">Preço de Venda:</span>
        <p className="text-sm font-bold text-green-700 text-center">{formatCurrency(vehicle.salePrice)}</p>
      </div>

      {isInternalSeller && showMinNegotiable && (
        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
          <p className="text-sm font-bold text-yellow-700 text-center">
            {formatCurrency(minNegotiable)}
          </p>
        </div>
      )}

      {vehicle.category === 'sold' && vehicle.seller && (
        <div className="bg-gray-50 p-2 rounded text-center border-t">
          <div className="text-xs text-gray-500 mb-1">Vendido por:</div>
          <div className="text-xs font-medium text-gray-700">{vehicle.seller}</div>
          {vehicle.finalSalePrice && (
            <div className="text-xs font-semibold text-green-600 mt-1">
              {formatCurrency(vehicle.finalSalePrice)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCardContent;
