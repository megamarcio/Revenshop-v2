
import React from 'react';

interface VehicleInfoSectionProps {
  vehicleClass: string;
  vehicleLabel: string;
  shouldShowVehicleInfo: boolean;
}

const VehicleInfoSection = ({ 
  vehicleClass, 
  vehicleLabel, 
  shouldShowVehicleInfo 
}: VehicleInfoSectionProps) => {
  if (!shouldShowVehicleInfo) {
    return null;
  }

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
    </div>
  );
};

export default VehicleInfoSection;
