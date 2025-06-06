
import React, { useState } from 'react';
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

  const handleDataChange = (field: keyof FinancingData, value: any) => {
    setFinancingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculateFinancing = () => {
    const calculationResults = calculateFinancing(financingData);
    setResults(calculationResults);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Simulação de Financiamento</h1>
        {results && (
          <FinancingActions 
            financingData={financingData} 
            results={results} 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
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

        <div>
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
