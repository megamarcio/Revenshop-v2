
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

interface FinancingResultsProps {
  data: {
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
  };
  results: {
    downPaymentAmount: number;
    financedAmount: number;
    totalTaxes: number;
    totalFees: number;
    totalLoanAmount: number;
    monthlyPayment: number;
    totalAmount: number;
  };
}

const FinancingResults = ({ data, results }: FinancingResultsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const downPaymentPercentage = data.vehiclePrice > 0 ? ((data.downPayment / data.vehiclePrice) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Resultado da Simulação</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo Principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-sm text-blue-600 font-medium">Down Payment</p>
            <p className="text-xl font-bold text-blue-900">
              {formatCurrency(results.downPaymentAmount)}
            </p>
            <p className="text-xs text-blue-500">
              {downPaymentPercentage}% do valor
            </p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm text-green-600 font-medium">Valor Financiado</p>
            <p className="text-xl font-bold text-green-900">
              {formatCurrency(results.financedAmount)}
            </p>
            <p className="text-xs text-green-500">
              Incluindo taxas e impostos
            </p>
          </div>
        </div>

        {/* Detalhes do Pagamento */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Detalhes do Pagamento
          </h4>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Quantidade de Parcelas:</span>
              <Badge variant="outline">{data.installments}x</Badge>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="text-gray-600">Valor da Parcela:</span>
              <span className="font-bold text-yellow-700 text-lg">
                {formatCurrency(results.monthlyPayment)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total de Impostos:</span>
              <span className="font-medium">
                {formatCurrency(results.totalTaxes)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total de Taxas:</span>
              <span className="font-medium">
                {formatCurrency(results.totalFees)}
              </span>
            </div>
          </div>
        </div>

        {/* Resumo Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total a Pagar:</span>
            <span className="text-red-600">
              {formatCurrency(results.totalAmount)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Down payment + {data.installments} parcelas de {formatCurrency(results.monthlyPayment)}
          </p>
        </div>

        {/* Breakdown de Custos */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Breakdown de Custos:</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Valor do Veículo:</span>
              <span>{formatCurrency(data.vehiclePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dealer Fee:</span>
              <span>{formatCurrency(data.dealerFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impostos ({data.taxRate}%):</span>
              <span>{formatCurrency(results.totalTaxes)}</span>
            </div>
            <div className="flex justify-between">
              <span>Emplacamento:</span>
              <span>{formatCurrency(data.registrationFee)}</span>
            </div>
            {data.otherFees > 0 && (
              <div className="flex justify-between">
                <span>Outros:</span>
                <span>{formatCurrency(data.otherFees)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Juros ({data.interestRate}% ao ano):</span>
              <span>{formatCurrency(results.totalAmount - results.downPaymentAmount - data.vehiclePrice - results.totalTaxes - results.totalFees)}</span>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        {(data.vehicle || data.customer) && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold text-gray-900">Informações Adicionais:</h4>
            {data.vehicle && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Veículo:</span> {data.vehicle.name} {data.vehicle.year}
              </p>
            )}
            {data.customer && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Cliente:</span> {data.customer.name}
              </p>
            )}
            {data.otherFeesDescription && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Observações:</span> {data.otherFeesDescription}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingResults;
