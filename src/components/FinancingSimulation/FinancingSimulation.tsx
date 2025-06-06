
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer } from 'lucide-react';
import VehicleClientSelector from './VehicleClientSelector';
import FinancingCalculator from './FinancingCalculator';
import FinancingResults from './FinancingResults';
import { useVehicles } from '@/hooks/useVehicles';
import { useCustomers } from '@/hooks/useCustomers';

interface FinancingData {
  vehicle?: any;
  customer?: any;
  vehiclePrice: number;
  downPayment: number;
  interestRate: number;
  installments: number;
  dealerFee: number;
  taxRate: number;
  registrationFee: number;
  otherFees: number;
  otherFeesDescription: string;
}

interface CalculationResults {
  downPaymentAmount: number;
  financedAmount: number;
  totalTaxes: number;
  totalFees: number;
  totalLoanAmount: number;
  monthlyPayment: number;
  totalAmount: number;
}

const FinancingSimulation = () => {
  const { vehicles } = useVehicles();
  const { customers } = useCustomers();
  
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

  const calculateFinancing = () => {
    const {
      vehiclePrice,
      downPayment,
      interestRate,
      installments,
      dealerFee,
      taxRate,
      registrationFee,
      otherFees
    } = financingData;

    // Cálculos
    const downPaymentAmount = (vehiclePrice * downPayment) / 100;
    const totalTaxes = (vehiclePrice * taxRate) / 100;
    const totalFees = dealerFee + registrationFee + otherFees;
    const financedAmount = vehiclePrice - downPaymentAmount + totalTaxes + totalFees;
    
    // Converter taxa anual para mensal
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // Fórmula de pagamento mensal com juros compostos
    const monthlyPayment = financedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, installments)) / (Math.pow(1 + monthlyInterestRate, installments) - 1);
    
    const totalAmount = monthlyPayment * installments;

    const calculationResults: CalculationResults = {
      downPaymentAmount,
      financedAmount,
      totalTaxes,
      totalFees,
      totalLoanAmount: financedAmount,
      monthlyPayment,
      totalAmount
    };

    setResults(calculationResults);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Implementação simples para export PDF usando window.print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Simulação de Financiamento</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Simulação de Financiamento</h1>
              <p>Data: ${new Date().toLocaleDateString()}</p>
            </div>
            ${results ? `
              <div class="section">
                <h3>Dados do Financiamento</h3>
                <div class="grid">
                  <div><span class="label">Valor do Veículo:</span> $${financingData.vehiclePrice.toLocaleString()}</div>
                  <div><span class="label">Down Payment:</span> ${financingData.downPayment}% ($${results.downPaymentAmount.toLocaleString()})</div>
                  <div><span class="label">Taxa de Juros:</span> ${financingData.interestRate}% ao ano</div>
                  <div><span class="label">Parcelas:</span> ${financingData.installments}x</div>
                </div>
              </div>
              <div class="section">
                <h3>Resumo do Cálculo</h3>
                <div class="grid">
                  <div><span class="label">Valor Financiado:</span> $${results.financedAmount.toLocaleString()}</div>
                  <div><span class="label">Pagamento Mensal:</span> $${results.monthlyPayment.toLocaleString()}</div>
                  <div><span class="label">Total de Impostos:</span> $${results.totalTaxes.toLocaleString()}</div>
                  <div><span class="label">Total de Taxas:</span> $${results.totalFees.toLocaleString()}</div>
                </div>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Simulação de Financiamento</h1>
        {results && (
          <div className="flex space-x-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VehicleClientSelector
            vehicles={vehicles}
            customers={customers}
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
            onCalculate={calculateFinancing}
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
