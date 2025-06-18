
import React from 'react';

interface VehicleInfoSectionProps {
  vehicleClass: string;
  vehicleLabel: string;
  vehiclePlate?: string;
  shouldShowPlate: boolean;
}

const VehicleInfoSection = ({ 
  vehicleClass, 
  vehicleLabel, 
  vehiclePlate, 
  shouldShowPlate 
}: VehicleInfoSectionProps) => {
  return (
    <div className="space-y-3">
      {/* Classe do Veículo */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-muted-foreground">Classe do Veículo</div>
        <div className="font-medium">{vehicleClass}</div>
      </div>

      {/* Veículo Selecionado */}
      <div className="p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-muted-foreground">Veículo Selecionado</div>
        <div className="font-medium">{vehicleLabel}</div>
      </div>

      {/* Placa do Veículo */}
      {shouldShowPlate && vehiclePlate && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-muted-foreground">Placa</div>
          <div className="font-medium">{vehiclePlate}</div>
        </div>
      )}
    </div>
  );
};

export default VehicleInfoSection;
