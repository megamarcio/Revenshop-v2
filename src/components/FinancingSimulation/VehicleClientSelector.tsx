
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, User, DollarSign, Search } from 'lucide-react';
import { useVehiclesOptimized } from '@/hooks/useVehiclesOptimized';
import { useCustomersOptimized } from '@/hooks/useCustomersOptimized';

interface VehicleClientSelectorProps {
  vehicles?: any[];
  customers?: any[];
  selectedVehicle?: any;
  selectedCustomer?: any;
  vehiclePrice: number;
  onVehicleSelect: (vehicle: any) => void;
  onCustomerSelect: (customer: any) => void;
  onVehiclePriceChange: (price: number) => void;
}

const VehicleClientSelector = ({
  selectedVehicle,
  selectedCustomer,
  vehiclePrice,
  onVehicleSelect,
  onCustomerSelect,
  onVehiclePriceChange
}: VehicleClientSelectorProps) => {
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Usar hooks otimizados com filtros específicos
  const { vehicles, loading: vehiclesLoading } = useVehiclesOptimized({ 
    category: 'forSale',
    searchTerm: vehicleSearch,
    limit: 50
  });

  const { customers, loading: customersLoading } = useCustomersOptimized({
    searchTerm: customerSearch,
    limit: 50
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Memoizar veículos filtrados para melhor performance
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => v.category === 'forSale');
  }, [vehicles]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Car className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Seleção de Veículo e Cliente</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de Veículo */}
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
              const vehicle = filteredVehicles.find(v => v.id === value);
              onVehicleSelect(vehicle);
            }}
            disabled={vehiclesLoading}
          >
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder={vehiclesLoading ? "Carregando..." : "Selecione um veículo"} />
            </SelectTrigger>
            <SelectContent className="max-h-48 sm:max-h-60">
              {filteredVehicles.map((vehicle) => (
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

        {/* Valor do Veículo */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Valor do Veículo</span>
          </Label>
          <Input
            type="number"
            value={vehiclePrice}
            onChange={(e) => onVehiclePriceChange(parseFloat(e.target.value) || 0)}
            placeholder="Informe o valor"
            min="0"
            step="100"
            className="text-sm h-9 sm:h-10"
          />
          {vehiclePrice > 0 && (
            <p className="text-xs sm:text-sm text-gray-500">
              Valor: {formatCurrency(vehiclePrice)}
            </p>
          )}
        </div>

        {/* Seleção de Cliente */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-sm">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Cliente (Opcional)</span>
          </Label>

          {/* Campo de busca para clientes */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
            />
          </div>

          <Select
            value={selectedCustomer?.id || ''}
            onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              onCustomerSelect(customer);
            }}
            disabled={customersLoading}
          >
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder={customersLoading ? "Carregando..." : "Selecione um cliente"} />
            </SelectTrigger>
            <SelectContent className="max-h-48 sm:max-h-60">
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id} className="text-sm">
                  <div className="flex flex-col">
                    <span>{customer.name}</span>
                    <span className="text-xs text-muted-foreground">{customer.phone}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Informações do veículo selecionado com imagem */}
        {selectedVehicle && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 text-sm">Veículo Selecionado</h4>
            
            {/* Imagem do veículo */}
            {selectedVehicle.image_url && (
              <div className="mb-3 flex justify-center">
                <img 
                  src={selectedVehicle.image_url} 
                  alt={`${selectedVehicle.name} ${selectedVehicle.year}`}
                  className="max-w-full h-24 sm:h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="text-xs sm:text-sm text-blue-700 space-y-1">
              <p><span className="font-medium">Nome:</span> {selectedVehicle.name}</p>
              <p><span className="font-medium">Ano:</span> {selectedVehicle.year}</p>
              <p><span className="font-medium">Cor:</span> {selectedVehicle.color}</p>
              <p className="hidden sm:block"><span className="font-medium">VIN:</span> {selectedVehicle.vin}</p>
              <p><span className="font-medium">Preço:</span> {formatCurrency(selectedVehicle.sale_price)}</p>
            </div>
          </div>
        )}

        {/* Informações do cliente selecionado */}
        {selectedCustomer && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 text-sm">Cliente Selecionado</h4>
            <div className="text-xs sm:text-sm text-green-700 space-y-1">
              <p><span className="font-medium">Nome:</span> {selectedCustomer.name}</p>
              <p><span className="font-medium">Telefone:</span> {selectedCustomer.phone}</p>
              {selectedCustomer.email && (
                <p className="hidden sm:block"><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleClientSelector;
