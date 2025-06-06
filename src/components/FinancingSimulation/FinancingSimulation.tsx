
import React, { useState, useCallback } from 'react';
import VehicleClientSelector from './VehicleClientSelector';
import FinancingCalculator from './FinancingCalculator';
import FinancingResults from './FinancingResults';
import FinancingActions from './FinancingActions';
import { FinancingData, CalculationResults } from './types';
import { calculateFinancing } from './utils/financingCalculations';

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
    const calculationResults = calculateFinancing(financingData);
    setResults(calculationResults);
  }, [financingData]);

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Simulação de Financiamento</h1>
        {results && (
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

          <FinancingCalculator
            data={financingData}
            onChange={handleDataChange}
            onCalculate={handleCalculateFinancing}
          />
        </div>

        <div className="lg:sticky lg:top-4">
          {results && (
            <FinancingResults
              data={financingData}
              results={results}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancingSimulation;
