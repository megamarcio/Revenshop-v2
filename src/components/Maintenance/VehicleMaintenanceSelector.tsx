
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import { Car } from 'lucide-react';

interface VehicleMaintenanceSelectorProps {
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
}

const VehicleMaintenanceSelector = ({ selectedVehicleId, onVehicleChange }: VehicleMaintenanceSelectorProps) => {
  const { vehicles, loading } = useVehiclesOptimized({ category: 'forSale', limit: 50 });

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  console.log('VehicleMaintenanceSelector - vehicles loaded:', vehicles.length);
  console.log('VehicleMaintenanceSelector - loading:', loading);
  console.log('VehicleMaintenanceSelector - selectedVehicleId:', selectedVehicleId);

  return (
    <div className="space-y-2">
      <Label>Veículo</Label>
      <Select value={selectedVehicleId} onValueChange={onVehicleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um veículo para manutenção">
            {selectedVehicle && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="font-semibold text-revenshop-primary">
                  {selectedVehicle.internal_code}
                </span>
                <span>- {selectedVehicle.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>Carregando veículos...</SelectItem>
          ) : vehicles.length === 0 ? (
            <SelectItem value="empty" disabled>Nenhum veículo cadastrado</SelectItem>
          ) : (
            vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold text-revenshop-primary">
                    {vehicle.internal_code}
                  </span>
                  <span>- {vehicle.name} ({vehicle.year})</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {selectedVehicle && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800">Veículo Selecionado</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Código:</span>
              <span className="ml-2 font-medium text-revenshop-primary">
                {selectedVehicle.internal_code}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Nome:</span>
              <span className="ml-2 font-medium">{selectedVehicle.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Ano:</span>
              <span className="ml-2 font-medium">{selectedVehicle.year}</span>
            </div>
            <div>
              <span className="text-gray-600">VIN:</span>
              <span className="ml-2 font-medium">{selectedVehicle.vin}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaintenanceSelector;
