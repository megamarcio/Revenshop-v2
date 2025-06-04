
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import VehicleSelector from './VehicleSelector';
import FinancingSimulation from './FinancingSimulation';
import DealSummary from './DealSummary';
import { useAuth } from '../../contexts/AuthContext';

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
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);

  // Mock vehicles data - em produção viria da API
  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Honda Civic EXL 2.0',
      year: 2020,
      color: 'Preto',
      vin: '1HGCV1F30JA123456',
      purchasePrice: 55000,
      salePrice: 68000,
      internalCode: 'HC001'
    },
    {
      id: '2',
      name: 'Toyota Corolla XEI 2.0',
      year: 2021,
      color: 'Branco',
      vin: '1NXBR32E37Z123456',
      purchasePrice: 60000,
      salePrice: 75000,
      internalCode: 'TC002'
    },
    {
      id: '3',
      name: 'Honda Civic',
      year: 2019,
      color: 'Azul',
      vin: '123456789465',
      purchasePrice: 7200,
      salePrice: 12000,
      internalCode: 'HC003'
    }
  ];

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeal(null);
  };

  const handleDealCalculated = (calculatedDeal: Deal) => {
    setDeal(calculatedDeal);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buy Here Pay Here</h1>
        <p className="text-gray-600 mt-1">Sistema de financiamento interno</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seleção de Veículo */}
        <VehicleSelector 
          vehicles={vehicles}
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
