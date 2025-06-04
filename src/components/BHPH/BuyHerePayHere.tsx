
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import VehicleSelector from './VehicleSelector';
import FinancingSimulation from './FinancingSimulation';
import DealSummary from './DealSummary';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useVehicles';

export interface Vehicle {
  id: string;
  name: string;
  year: number;
  color: string;
  vin: string;
  purchasePrice: number;
  salePrice: number;
  internalCode: string;
}

export interface Deal {
  vehicle: Vehicle;
  downPayment: number;
  installments: number;
  installmentValue: number;
  interestRate: number;
}

const BuyHerePayHere = () => {
  const { isAdmin } = useAuth();
  const { vehicles, loading } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);

  // Converter veículos do banco para o formato esperado pelo componente
  const formattedVehicles: Vehicle[] = vehicles
    .filter(vehicle => vehicle.category === 'forSale') // Apenas veículos à venda
    .map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      year: vehicle.year,
      color: vehicle.color,
      vin: vehicle.vin,
      purchasePrice: vehicle.purchase_price,
      salePrice: vehicle.sale_price,
      internalCode: vehicle.internal_code
    }));

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeal(null);
  };

  const handleDealCalculated = (calculatedDeal: Deal) => {
    setDeal(calculatedDeal);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buy Here Pay Here</h1>
          <p className="text-gray-600 mt-1">Sistema de financiamento interno</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buy Here Pay Here</h1>
        <p className="text-gray-600 mt-1">Sistema de financiamento interno</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seleção de Veículo */}
        <VehicleSelector 
          vehicles={formattedVehicles}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
        />

        {/* Simulação de Financiamento */}
        {selectedVehicle && (
          <FinancingSimulation
            vehicle={selectedVehicle}
            isAdmin={isAdmin}
            onDealCalculated={handleDealCalculated}
          />
        )}
      </div>

      {/* Resumo do Deal */}
      {deal && (
        <DealSummary 
          deal={deal}
          isAdmin={isAdmin}
        />
      )}

      {/* Cards de estatísticas - mantidos como placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes BHPH</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos Hoje</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyHerePayHere;
