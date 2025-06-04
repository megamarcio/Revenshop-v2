
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Vehicle, Deal } from './BuyHerePayHere';

interface FinancingSimulationProps {
  vehicle: Vehicle;
  isAdmin: boolean;
  onDealCalculated: (deal: Deal) => void;
}

const FinancingSimulation = ({ vehicle, isAdmin, onDealCalculated }: FinancingSimulationProps) => {
  const [downPayment, setDownPayment] = useState(0);
  const [installments, setInstallments] = useState(12);
  const [customDownPayment, setCustomDownPayment] = useState('');
  const [isCustomDownPayment, setIsCustomDownPayment] = useState(false);

  const interestRate = 0.12; // 12% ao mês
  const suggestedDownPayment = Math.round(vehicle.purchasePrice * 0.6); // 60% do valor de compra

  useEffect(() => {
    setDownPayment(suggestedDownPayment);
    setIsCustomDownPayment(false);
    setCustomDownPayment('');
  }, [vehicle, suggestedDownPayment]);

  useEffect(() => {
    calculateDeal();
  }, [downPayment, installments]);

  const calculateDeal = () => {
    const remainingBalance = vehicle.salePrice - downPayment;
    
    // Compound interest calculation: PMT = PV * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const r = interestRate; // monthly interest rate
    const n = installments; // number of payments
    const pv = remainingBalance; // present value (amount to finance)
    
    let installmentValue;
    if (r === 0) {
      // If no interest, simple division
      installmentValue = Math.round(pv / n);
    } else {
      // Compound interest formula
      const factor = Math.pow(1 + r, n);
      installmentValue = Math.round(pv * (r * factor) / (factor - 1));
    }

    const deal: Deal = {
      vehicle,
      downPayment,
      installments,
      installmentValue,
      interestRate
    };

    onDealCalculated(deal);
  };

  const handleDownPaymentChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setDownPayment(numValue);
  };

  const handleCustomDownPaymentSubmit = () => {
    const numValue = parseInt(customDownPayment) || 0;
    if (numValue > 0) {
      setDownPayment(numValue);
      setIsCustomDownPayment(true);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulação do Financiamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Down Payment */}
        <div className="space-y-2">
          <Label>Entrada (Down Payment)</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-green-600">{formatCurrency(suggestedDownPayment)}</span>
            </div>
            
            {isAdmin && (
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                placeholder="Valor da entrada"
              />
            )}

            {!isAdmin && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={customDownPayment}
                    onChange={(e) => setCustomDownPayment(e.target.value)}
                    placeholder="Sugerir outro valor"
                    className="flex-1"
                  />
                  <button
                    onClick={handleCustomDownPaymentSubmit}
                    className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Sugerir
                  </button>
                </div>
                {isCustomDownPayment && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Valor sujeito à aprovação da administração
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Parcelamento */}
        <div className="space-y-2">
          <Label htmlFor="installments">Quantas parcelas deseja? (máximo 15)</Label>
          <Input
            id="installments"
            type="number"
            min="1"
            max="15"
            value={installments}
            onChange={(e) => setInstallments(Math.min(15, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>

        {/* Preview dos cálculos */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Cálculo Atual</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>Valor do veículo: {formatCurrency(vehicle.salePrice)}</p>
            <p>Entrada: {formatCurrency(downPayment)}</p>
            <p>Saldo a financiar: {formatCurrency(vehicle.salePrice - downPayment)}</p>
            <p>Parcelas: {installments}x de {formatCurrency(Math.round((vehicle.salePrice - downPayment) * (interestRate * Math.pow(1 + interestRate, installments)) / (Math.pow(1 + interestRate, installments) - 1)))}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancingSimulation;
