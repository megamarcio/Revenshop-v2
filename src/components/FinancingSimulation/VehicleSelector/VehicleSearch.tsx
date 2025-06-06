
import React from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from 'lucide-react';
import { Vehicle } from '@/hooks/useVehiclesOptimized';

interface VehicleSearchProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
  onVehicleSelect: (vehicle: Vehicle | undefined) => void;
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

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
          placeholder="Buscar veículo..."
          value={vehicleSearch}
          onChange={(e) => setVehicleSearch(e.target.value)}
          className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
        />
      </div>

      <Select
        value={selectedVehicle?.id || ''}
        onValueChange={(value) => {
          const vehicle = vehicles.find(v => v.id === value);
          onVehicleSelect(vehicle);
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 sm:h-10 text-sm">
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um veículo"} />
        </SelectTrigger>
        <SelectContent className="max-h-48 sm:max-h-60">
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id} className="text-sm">
              <div className="flex flex-col">
                <span>{vehicle.name} {vehicle.year}</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(vehicle.sale_price)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleSearch;
