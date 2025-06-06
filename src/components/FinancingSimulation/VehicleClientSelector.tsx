
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, User, DollarSign } from 'lucide-react';

interface VehicleClientSelectorProps {
  vehicles: any[];
  customers: any[];
  selectedVehicle?: any;
  selectedCustomer?: any;
  vehiclePrice: number;
  onVehicleSelect: (vehicle: any) => void;
  onCustomerSelect: (customer: any) => void;
  onVehiclePriceChange: (price: number) => void;
}

const VehicleClientSelector = ({
  vehicles,
  customers,
  selectedVehicle,
  selectedCustomer,
  vehiclePrice,
  onVehicleSelect,
  onCustomerSelect,
  onVehiclePriceChange
}: VehicleClientSelectorProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="h-5 w-5" />
          <span>Seleção de Veículo e Cliente</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de Veículo */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Car className="h-4 w-4" />
            <span>Veículo (Opcional)</span>
          </Label>
          <Select
            value={selectedVehicle?.id || ''}
            onValueChange={(value) => {
              const vehicle = vehicles.find(v => v.id === value);
              onVehicleSelect(vehicle);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.filter(v => v.category === 'forSale').map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} {vehicle.year} - {vehicle.color} - {formatCurrency(vehicle.sale_price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valor do Veículo */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Valor do Veículo</span>
          </Label>
          <Input
            type="number"
            value={vehiclePrice}
            onChange={(e) => onVehiclePriceChange(parseFloat(e.target.value) || 0)}
            placeholder="Informe o valor do veículo"
            min="0"
            step="100"
          />
          {vehiclePrice > 0 && (
            <p className="text-sm text-gray-500">
              Valor: {formatCurrency(vehiclePrice)}
            </p>
          )}
        </div>

        {/* Seleção de Cliente */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Cliente (Opcional)</span>
          </Label>
          <Select
            value={selectedCustomer?.id || ''}
            onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              onCustomerSelect(customer);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Informações do veículo selecionado com imagem */}
        {selectedVehicle && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Veículo Selecionado</h4>
            
            {/* Imagem do veículo */}
            {selectedVehicle.image_url && (
              <div className="mb-3 flex justify-center">
                <img 
                  src={selectedVehicle.image_url} 
                  alt={`${selectedVehicle.name} ${selectedVehicle.year}`}
                  className="max-w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="text-sm text-blue-700 space-y-1">
              <p><span className="font-medium">Nome:</span> {selectedVehicle.name}</p>
              <p><span className="font-medium">Ano:</span> {selectedVehicle.year}</p>
              <p><span className="font-medium">Cor:</span> {selectedVehicle.color}</p>
              <p><span className="font-medium">VIN:</span> {selectedVehicle.vin}</p>
              <p><span className="font-medium">Preço:</span> {formatCurrency(selectedVehicle.sale_price)}</p>
            </div>
          </div>
        )}

        {/* Informações do cliente selecionado */}
        {selectedCustomer && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Cliente Selecionado</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><span className="font-medium">Nome:</span> {selectedCustomer.name}</p>
              <p><span className="font-medium">Telefone:</span> {selectedCustomer.phone}</p>
              {selectedCustomer.email && (
                <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleClientSelector;
