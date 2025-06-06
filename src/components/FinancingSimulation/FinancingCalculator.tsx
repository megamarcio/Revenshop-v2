
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Percent, DollarSign, CreditCard, FileText, Settings } from 'lucide-react';

interface FinancingCalculatorProps {
  data: {
    vehiclePrice: number;
    downPayment: number;
    interestRate: number;
    installments: number;
    dealerFee: number;
    taxRate: number;
    registrationFee: number;
    otherFees: number;
    otherFeesDescription: string;
  };
  onChange: (field: string, value: any) => void;
  onCalculate: () => void;
}

const FinancingCalculator = ({ data, onChange, onCalculate }: FinancingCalculatorProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const isCalculationValid = data.vehiclePrice > 0;
  const suggestedDownPayment = data.vehiclePrice * 0.2; // 20% do valor

  React.useEffect(() => {
    if (data.vehiclePrice > 0 && data.downPayment === 0) {
      onChange('downPayment', suggestedDownPayment);
    }
  }, [data.vehiclePrice]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Calculadora de Financiamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primeira linha - Down Payment e Taxa de Juros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Down Payment</span>
            </Label>
            <Input
              type="number"
              value={data.downPayment}
              onChange={(e) => onChange('downPayment', parseFloat(e.target.value) || 0)}
              placeholder={`Sugerido: ${formatCurrency(suggestedDownPayment)}`}
              min="0"
              step="100"
            />
            {data.vehiclePrice > 0 && (
              <p className="text-sm text-gray-500">
                Sugerido: {formatCurrency(suggestedDownPayment)} (20% do valor)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Percent className="h-4 w-4" />
              <span>Taxa de Juros (% ao ano)</span>
            </Label>
            <Input
              type="number"
              value={data.interestRate}
              onChange={(e) => onChange('interestRate', parseFloat(e.target.value) || 0)}
              placeholder="12"
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>

        {/* Segunda linha - Parcelas e Dealer Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Quantidade de Parcelas</span>
            </Label>
            <Input
              type="number"
              value={data.installments}
              onChange={(e) => onChange('installments', parseInt(e.target.value) || 0)}
              placeholder="72"
              min="1"
              max="120"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Dealer Fee</span>
            </Label>
            <Input
              type="number"
              value={data.dealerFee}
              onChange={(e) => onChange('dealerFee', parseFloat(e.target.value) || 0)}
              placeholder="499"
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Terceira linha - Taxa do Imposto e Emplacamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Percent className="h-4 w-4" />
              <span>Taxa do Imposto (%)</span>
            </Label>
            <Input
              type="number"
              value={data.taxRate}
              onChange={(e) => onChange('taxRate', parseFloat(e.target.value) || 0)}
              placeholder="6"
              min="0"
              max="20"
              step="0.1"
            />
            {data.vehiclePrice > 0 && (
              <p className="text-sm text-gray-500">
                Valor: {formatCurrency((data.vehiclePrice * data.taxRate) / 100)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Valor do Emplacamento</span>
            </Label>
            <Input
              type="number"
              value={data.registrationFee}
              onChange={(e) => onChange('registrationFee', parseFloat(e.target.value) || 0)}
              placeholder="450"
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Outros */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Outros</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              value={data.otherFees}
              onChange={(e) => onChange('otherFees', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="1"
            />
            <Textarea
              value={data.otherFeesDescription}
              onChange={(e) => onChange('otherFeesDescription', e.target.value)}
              placeholder="Descrição dos outros custos..."
              rows={1}
            />
          </div>
          {data.otherFees > 0 && (
            <p className="text-sm text-gray-500">
              Valor: {formatCurrency(data.otherFees)}
            </p>
          )}
        </div>

        {/* Botão de Calcular */}
        <Button 
          onClick={onCalculate} 
          className="w-full" 
          size="lg"
          disabled={!isCalculationValid}
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calcular Financiamento
        </Button>

        {!isCalculationValid && (
          <p className="text-sm text-red-500 text-center">
            Informe o valor do veículo para realizar o cálculo
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingCalculator;
