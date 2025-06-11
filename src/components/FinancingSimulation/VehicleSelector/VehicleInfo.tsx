
import React from 'react';
import { Vehicle } from '@/hooks/useVehiclesOptimized';

interface VehicleInfoProps {
  vehicle: Vehicle;
}

const VehicleInfo = ({ vehicle }: VehicleInfoProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Get the first photo from the photos array
  const mainPhoto = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : null;

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3 text-sm">Veículo Selecionado</h4>
      
      {/* Imagem do veículo */}
      {mainPhoto && (
        <div className="mb-3 flex justify-center">
          <img 
            src={mainPhoto} 
            alt={`${vehicle.name} ${vehicle.year}`}
            className="max-w-full h-24 sm:h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="text-xs sm:text-sm text-blue-700 space-y-1">
        <p><span className="font-medium">Nome:</span> {vehicle.name}</p>
        <p><span className="font-medium">Ano:</span> {vehicle.year}</p>
        <p><span className="font-medium">Cor:</span> {vehicle.color}</p>
        <p className="hidden sm:block"><span className="font-medium">VIN:</span> {vehicle.vin}</p>
        <p><span className="font-medium">Preço:</span> {formatCurrency(vehicle.sale_price)}</p>
      </div>
    </div>
  );
};

export default VehicleInfo;
