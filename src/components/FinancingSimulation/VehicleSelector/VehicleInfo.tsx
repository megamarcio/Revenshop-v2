
import React from 'react';
import VehicleMainPhoto from '../../Vehicles/VehicleMainPhoto';

interface VehicleInfoProps {
  vehicle: any;
}

const VehicleInfo = ({ vehicle }: VehicleInfoProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const formatMiles = (miles: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(miles || 0);
  };

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3 text-sm">Veículo Selecionado</h4>
      
      {/* Imagem do veículo usando o novo sistema de fotos */}
      <div className="mb-3 flex justify-center">
        <VehicleMainPhoto
          vehicleId={vehicle.id}
          fallbackPhotos={vehicle.photos || []}
          vehicleName={`${vehicle.name} ${vehicle.year}`}
          className="max-w-full h-24 sm:h-32 object-cover rounded border"
        />
      </div>
      
      <div className="text-xs sm:text-sm text-blue-700 space-y-1">
        <p><span className="font-medium">Nome:</span> {vehicle.name}</p>
        <p><span className="font-medium">Modelo:</span> {vehicle.model}</p>
        <p><span className="font-medium">Ano:</span> {vehicle.year}</p>
        <p><span className="font-medium">Cor:</span> {vehicle.color}</p>
        <p><span className="font-medium">Milhas:</span> {formatMiles(vehicle.miles)}</p>
        <p><span className="font-medium">Código:</span> {vehicle.internal_code}</p>
        <p className="hidden sm:block"><span className="font-medium">VIN:</span> {vehicle.vin}</p>
        <p><span className="font-medium">Preço:</span> {formatCurrency(vehicle.sale_price)}</p>
      </div>
    </div>
  );
};

export default VehicleInfo;
