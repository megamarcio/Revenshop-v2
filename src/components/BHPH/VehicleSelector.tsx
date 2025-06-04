
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Vehicle } from './BuyHerePayHere';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const VehicleSelector = ({ vehicles, selectedVehicle, onVehicleSelect }: VehicleSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.year.toString().includes(searchTerm)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Veículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, cor ou ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Dropdown de seleção */}
        <Select
          value={selectedVehicle?.id || ''}
          onValueChange={(value) => {
            const vehicle = vehicles.find(v => v.id === value);
            if (vehicle) onVehicleSelect(vehicle);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha um veículo" />
          </SelectTrigger>
          <SelectContent>
            {filteredVehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name} {vehicle.year} - {vehicle.color} - {formatCurrency(vehicle.salePrice)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Detalhes do veículo selecionado */}
        {selectedVehicle && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Veículo Selecionado</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Nome:</span> {selectedVehicle.name}</p>
              <p><span className="font-medium">Ano:</span> {selectedVehicle.year}</p>
              <p><span className="font-medium">Cor:</span> {selectedVehicle.color}</p>
              <p><span className="font-medium">VIN:</span> {selectedVehicle.vin}</p>
              <p><span className="font-medium">Preço de Venda:</span> {formatCurrency(selectedVehicle.salePrice)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
