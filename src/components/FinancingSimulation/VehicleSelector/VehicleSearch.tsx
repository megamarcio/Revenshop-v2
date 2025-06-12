
import React from 'react';
import { Search, Car } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleSearchProps {
  vehicles: any[];
  selectedVehicle?: any;
  onVehicleSelect: (vehicle: any | undefined) => void;
  vehicleSearch: string;
  setVehicleSearch: (search: string) => void;
  isLoading: boolean;
}

const VehicleSearch = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  vehicleSearch,
  setVehicleSearch,
  isLoading
}: VehicleSearchProps) => {
  // Filtrar veículos baseado na busca
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!vehicleSearch) return true;
    const searchLower = vehicleSearch.toLowerCase();
    return (
      vehicle.name?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.internal_code?.toLowerCase().includes(searchLower) ||
      vehicle.vin?.toLowerCase().includes(searchLower) ||
      vehicle.year?.toString().includes(searchLower)
    );
  });

  console.log('VehicleSearch - vehicles:', vehicles);
  console.log('VehicleSearch - filteredVehicles:', filteredVehicles);
  console.log('VehicleSearch - selectedVehicle:', selectedVehicle);

  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2 text-sm">
        <Car className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Veículo (Opcional)</span>
      </Label>
      
      {/* Campo de busca para veículos */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        <Input
          placeholder="Buscar veículo por nome, modelo, código..."
          value={vehicleSearch}
          onChange={(e) => setVehicleSearch(e.target.value)}
          className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
        />
      </div>

      <Select
        value={selectedVehicle?.id || ''}
        onValueChange={(value) => {
          if (value) {
            const vehicle = vehicles.find(v => v.id === value);
            console.log('VehicleSearch - selected vehicle:', vehicle);
            onVehicleSelect(vehicle);
          } else {
            onVehicleSelect(undefined);
          }
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 sm:h-10 text-sm">
          <SelectValue placeholder={isLoading ? "Carregando veículos..." : "Selecione um veículo"}>
            {selectedVehicle && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="font-semibold text-blue-600">
                  {selectedVehicle.internal_code}
                </span>
                <span> - {selectedVehicle.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-48 sm:max-h-60">
          {filteredVehicles.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {isLoading ? 'Carregando...' : 'Nenhum veículo encontrado'}
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold text-blue-600">
                    {selectedVehicle.internal_code}
                  </span>
                  <span> - {selectedVehicle.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {/* Debug info - remover em produção */}
      <div className="text-xs text-gray-500">
        {vehicles.length} veículos carregados • {filteredVehicles.length} filtrados
      </div>
    </div>
  );
};

export default VehicleSearch;
