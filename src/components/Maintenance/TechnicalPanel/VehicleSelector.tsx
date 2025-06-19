
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehiclesOptimized } from '../../../hooks/useVehiclesOptimized';

interface VehicleSelectorProps {
  selectedVehicleId?: string;
  onVehicleSelect: (vehicleId: string, vehicleName: string) => void;
}

const VehicleSelector = ({ selectedVehicleId, onVehicleSelect }: VehicleSelectorProps) => {
  const { vehicles, loading } = useVehiclesOptimized({ 
    category: 'forSale', 
    limit: 200, 
    minimal: true 
  });

  // Ordenar veículos por internal_code (que funciona como vehicle_code)
  const sortedVehicles = vehicles.sort((a, b) => {
    const codeA = a.internal_code || '';
    const codeB = b.internal_code || '';
    
    // Se ambos têm formato #XX, ordenar numericamente
    if (codeA.startsWith('#') && codeB.startsWith('#')) {
      const numA = parseInt(codeA.substring(1)) || 0;
      const numB = parseInt(codeB.substring(1)) || 0;
      return numA - numB;
    }
    
    // Senão, ordenar alfabeticamente
    return codeA.localeCompare(codeB);
  });

  const handleValueChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      onVehicleSelect(vehicleId, vehicle.name);
    }
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Selecionar Veículo</label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Selecionar Veículo</label>
      <Select value={selectedVehicleId || ''} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Escolha um veículo..." />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto bg-white">
          {sortedVehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {vehicle.internal_code || '#--'}
                </span>
                <span className="truncate">
                  {vehicle.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {sortedVehicles.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Nenhum veículo disponível para seleção.
        </p>
      )}
    </div>
  );
};

export default VehicleSelector;
