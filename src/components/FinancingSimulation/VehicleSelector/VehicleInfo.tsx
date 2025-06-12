
import React from 'react';

interface VehicleInfoProps {
  vehicle: any;
}

const VehicleInfo = ({ vehicle }: VehicleInfoProps) => {
  const formatMiles = (miles: number) => {
    return Math.floor(miles || 0).toString();
  };

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3 text-sm">Veículo Selecionado</h4>
      
      <div className="text-xs sm:text-sm text-blue-700 space-y-1">
        <p><span className="font-medium">Nome:</span> {vehicle.name}</p>
        <p><span className="font-medium">Ano:</span> {vehicle.year}</p>
        <p><span className="font-medium">Cor:</span> {vehicle.color}</p>
        <p><span className="font-medium">Milhas:</span> {formatMiles(vehicle.miles)}</p>
        <p><span className="font-medium">Código:</span> {vehicle.internal_code}</p>
        <p className="hidden sm:block"><span className="font-medium">VIN:</span> {vehicle.vin}</p>
      </div>
    </div>
  );
};

export default VehicleInfo;
