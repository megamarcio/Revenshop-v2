
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { useVehiclesOptimized } from '@/hooks/useVehiclesOptimized';
import { useCustomersOptimized } from '@/hooks/useCustomersOptimized';
import { useAuth } from '@/contexts/AuthContext';

import VehicleSearch from './VehicleSearch';
import VehiclePrice from './VehiclePrice';
import CustomerSearch from './CustomerSearch';
import VehicleInfo from './VehicleInfo';
import CustomerInfo from './CustomerInfo';

interface VehicleClientSelectorProps {
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
  const { user, isAdmin, isManager } = useAuth();

  // Usar hooks otimizados com filtros específicos
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehiclesOptimized({ 
    category: 'forSale',
    searchTerm: '', // Não usar searchTerm aqui, faremos a filtragem no componente
    limit: 100
  });

  // Filtrar clientes baseado no vendedor (apenas se não for admin/manager)
  const { customers, loading: customersLoading } = useCustomersOptimized({
    searchTerm: customerSearch,
    sellerId: (!isAdmin && !isManager) ? user?.id : undefined,
    limit: 50
  });

  // Memoizar veículos filtrados para melhor performance
  const availableVehicles = useMemo(() => {
    console.log('VehicleClientSelector - all vehicles:', vehicles);
    const filtered = vehicles.filter(v => v.category === 'forSale');
    console.log('VehicleClientSelector - filtered vehicles:', filtered);
    return filtered;
  }, [vehicles]);

  // Função para lidar com a seleção de veículo
  const handleVehicleSelect = (vehicle: any) => {
    console.log('VehicleClientSelector - vehicle selected:', vehicle);
    onVehicleSelect(vehicle);
    
    // Automaticamente definir o preço do veículo com o valor de venda
    if (vehicle && vehicle.salePrice) {
      console.log('VehicleClientSelector - setting vehicle price to:', vehicle.salePrice);
      onVehiclePriceChange(vehicle.salePrice);
    } else if (vehicle && vehicle.sale_price) {
      console.log('VehicleClientSelector - setting vehicle price to:', vehicle.sale_price);
      onVehiclePriceChange(vehicle.sale_price);
    }
  };

  console.log('VehicleClientSelector - vehiclesLoading:', vehiclesLoading);
  console.log('VehicleClientSelector - vehiclesError:', vehiclesError);
  console.log('VehicleClientSelector - availableVehicles count:', availableVehicles.length);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Car className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Seleção de Veículo e Cliente</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar erro se houver */}
        {vehiclesError && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            Erro ao carregar veículos: {vehiclesError}
          </div>
        )}

        {/* Vehicle Search Component */}
        <VehicleSearch
          vehicles={availableVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
          vehicleSearch={vehicleSearch}
          setVehicleSearch={setVehicleSearch}
          isLoading={vehiclesLoading}
        />

        {/* Vehicle Price Component */}
        <VehiclePrice
          vehiclePrice={vehiclePrice}
          onVehiclePriceChange={onVehiclePriceChange}
        />

        {/* Customer Search Component */}
        <CustomerSearch
          customers={customers}
          selectedCustomer={selectedCustomer}
          onCustomerSelect={onCustomerSelect}
          customerSearch={customerSearch}
          setCustomerSearch={setCustomerSearch}
          isLoading={customersLoading}
        />

        {/* Display Vehicle Info if selected */}
        {selectedVehicle && <VehicleInfo vehicle={selectedVehicle} />}

        {/* Display Customer Info if selected */}
        {selectedCustomer && <CustomerInfo customer={selectedCustomer} />}
      </CardContent>
    </Card>
  );
};

export default VehicleClientSelector;
