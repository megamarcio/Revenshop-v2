
import React, { useState, useCallback } from 'react';
import VehicleClientSelector from './VehicleSelector';
import FinancingCalculator from './FinancingCalculator';
import FinancingResults from './FinancingResults';
import FinancingActions from './FinancingActions';
import { FinancingData, CalculationResults } from './types';
import { calculateFinancing } from './utils/financingCalculations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, UserCheck } from 'lucide-react';

const FinancingSimulation = () => {
  const [financingData, setFinancingData] = useState<FinancingData>({
    vehiclePrice: 0,
    downPayment: 0,
    interestRate: 12, // 12% ao ano
    installments: 72,
    dealerFee: 499,
    taxRate: 6, // 6%
    registrationFee: 450,
    otherFees: 0,
    otherFeesDescription: ''
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleDataChange = useCallback((field: keyof FinancingData, value: any) => {
    setFinancingData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCalculateFinancing = useCallback(() => {
    // Verificar se cliente está selecionado antes de calcular
    if (!financingData.customer) {
      return;
    }
    
    const calculationResults = calculateFinancing(financingData);
    setResults(calculationResults);
  }, [financingData]);

  // Verificar se cliente está selecionado
  const isClientSelected = !!financingData.customer;

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Simulação de Financiamento</h1>
        {results && isClientSelected && (
          <div className="w-full sm:w-auto">
            <FinancingActions 
              financingData={financingData} 
              results={results} 
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <VehicleClientSelector
            selectedVehicle={financingData.vehicle}
            selectedCustomer={financingData.customer}
            vehiclePrice={financingData.vehiclePrice}
            onVehicleSelect={(vehicle) => {
              handleDataChange('vehicle', vehicle);
              handleDataChange('vehiclePrice', vehicle?.sale_price || 0);
            }}
            onCustomerSelect={(customer) => handleDataChange('customer', customer)}
            onVehiclePriceChange={(price) => handleDataChange('vehiclePrice', price)}
          />

          {/* Alerta quando cliente não está selecionado */}
          {!isClientSelected && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Cliente Obrigatório:</strong> Selecione um cliente registrado para acessar a simulação de financiamento.
              </AlertDescription>
            </Alert>
          )}

          {/* Calculadora só aparece se cliente estiver selecionado */}
          {isClientSelected ? (
            <FinancingCalculator
              data={financingData}
              onChange={handleDataChange}
              onCalculate={handleCalculateFinancing}
            />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Acesso Restrito
              </h3>
              <p className="text-gray-600 mb-4">
                A simulação de financiamento é disponível apenas para clientes registrados.
              </p>
              <p className="text-sm text-gray-500">
                Por favor, selecione um cliente na seção acima para continuar.
              </p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-4">
          {results && isClientSelected && (
            <FinancingResults
              data={financingData}
              results={results}
            />
          )}
          
          {/* Mensagem quando cliente não está selecionado */}
          {!isClientSelected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <UserCheck className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <h4 className="font-medium text-blue-900 mb-2">
                Selecione um Cliente
              </h4>
              <p className="text-sm text-blue-700">
                Os resultados da simulação aparecerão aqui após selecionar um cliente registrado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancingSimulation;
