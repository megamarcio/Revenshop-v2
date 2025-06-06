
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
    const downPaymentAmount = downPayment; // Já é valor absoluto
    const totalTaxes = (vehiclePrice * taxRate) / 100;
    const totalFees = dealerFee + registrationFee + otherFees;
    const financedAmount = vehiclePrice - downPaymentAmount + totalTaxes + totalFees;
    
    // Converter taxa anual para mensal
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // Fórmula de pagamento mensal com juros compostos
    const monthlyPayment = financedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, installments)) / (Math.pow(1 + monthlyInterestRate, installments) - 1);
    
    const totalAmount = downPaymentAmount + (monthlyPayment * installments);

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
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Simulação de Financiamento - RevenShop</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.6;
              }
              .header { 
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo-section {
                display: flex;
                align-items: center;
                gap: 15px;
              }
              .logo {
                width: 60px;
                height: 60px;
                background: #2563eb;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 20px;
              }
              .company-info h1 {
                color: #2563eb;
                font-size: 28px;
                font-weight: bold;
              }
              .company-info p {
                color: #666;
                font-size: 14px;
              }
              .document-info {
                text-align: right;
              }
              .document-info h2 {
                color: #1f2937;
                margin-bottom: 5px;
              }
              .document-info p {
                color: #666;
                font-size: 14px;
              }
              .section { 
                margin-bottom: 25px;
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
              }
              .section h3 {
                color: #1f2937;
                margin-bottom: 15px;
                font-size: 18px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 8px;
              }
              .info-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 15px; 
              }
              .info-item {
                background: white;
                padding: 12px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
              }
              .label { 
                font-weight: 600; 
                color: #374151;
                display: block;
                margin-bottom: 4px;
              }
              .value {
                color: #1f2937;
                font-size: 16px;
              }
              .highlight {
                background: #dbeafe;
                border-left: 4px solid #2563eb;
                padding: 15px;
                margin: 20px 0;
                border-radius: 6px;
              }
              .highlight .value {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
              }
              .total-section {
                background: #1f2937;
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin-top: 30px;
              }
              .total-section h3 {
                color: white;
                margin-bottom: 10px;
              }
              .total-value {
                font-size: 32px;
                font-weight: bold;
                color: #60a5fa;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-section">
                <div class="logo">RS</div>
                <div class="company-info">
                  <h1>RevenShop</h1>
                  <p>Simulação de Financiamento Automotivo</p>
                </div>
              </div>
              <div class="document-info">
                <h2>Simulação de Financiamento</h2>
                <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                <p>Hora: ${new Date().toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>

            ${financingData.customer ? `
              <div class="section">
                <h3>Informações do Cliente</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Nome:</span>
                    <span class="value">${financingData.customer.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Telefone:</span>
                    <span class="value">${financingData.customer.phone}</span>
                  </div>
                  ${financingData.customer.email ? `
                    <div class="info-item">
                      <span class="label">Email:</span>
                      <span class="value">${financingData.customer.email}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            ${financingData.vehicle ? `
              <div class="section">
                <h3>Informações do Veículo</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Veículo:</span>
                    <span class="value">${financingData.vehicle.name} ${financingData.vehicle.year}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Cor:</span>
                    <span class="value">${financingData.vehicle.color}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">VIN:</span>
                    <span class="value">${financingData.vehicle.vin}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Preço de Venda:</span>
                    <span class="value">${formatCurrency(financingData.vehicle.sale_price)}</span>
                  </div>
                </div>
              </div>
            ` : ''}

            ${results ? `
              <div class="section">
                <h3>Detalhes do Financiamento</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Valor do Veículo:</span>
                    <span class="value">${formatCurrency(financingData.vehiclePrice)}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Down Payment:</span>
                    <span class="value">${formatCurrency(results.downPaymentAmount)}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Taxa de Juros:</span>
                    <span class="value">${financingData.interestRate}% ao ano</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Quantidade de Parcelas:</span>
                    <span class="value">${financingData.installments}x</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Dealer Fee:</span>
                    <span class="value">${formatCurrency(financingData.dealerFee)}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Taxa de Imposto:</span>
                    <span class="value">${financingData.taxRate}% (${formatCurrency(results.totalTaxes)})</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Emplacamento:</span>
                    <span class="value">${formatCurrency(financingData.registrationFee)}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Outros Custos:</span>
                    <span class="value">${formatCurrency(financingData.otherFees)}</span>
                  </div>
                </div>
              </div>

              <div class="highlight">
                <div class="info-grid">
                  <div>
                    <span class="label">Valor Financiado:</span>
                    <span class="value">${formatCurrency(results.financedAmount)}</span>
                  </div>
                  <div>
                    <span class="label">Pagamento Mensal:</span>
                    <span class="value">${formatCurrency(results.monthlyPayment)}</span>
                  </div>
                </div>
              </div>

              <div class="total-section">
                <h3>Total a Pagar</h3>
                <div class="total-value">${formatCurrency(results.totalAmount)}</div>
                <p>Down payment + ${financingData.installments} parcelas de ${formatCurrency(results.monthlyPayment)}</p>
              </div>

              ${financingData.otherFeesDescription ? `
                <div class="section">
                  <h3>Observações</h3>
                  <p>${financingData.otherFeesDescription}</p>
                </div>
              ` : ''}
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
