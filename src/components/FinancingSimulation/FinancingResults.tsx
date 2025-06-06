
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, CreditCard, TrendingUp, Car } from 'lucide-react';
import { FinancingData, CalculationResults } from './types';

interface FinancingResultsProps {
  data: FinancingData;
  results: CalculationResults;
}

const FinancingResults = ({ data, results }: FinancingResultsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Resultado da Simulação</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Destaque Principal - Down Payment + Parcelas */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <DollarSign className="h-10 w-10 mx-auto text-blue-600 mb-3" />
              <p className="text-sm text-blue-600 font-medium mb-1">Down Payment</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(results.downPaymentAmount)}
              </p>
            </div>

            <div className="text-center">
              <CreditCard className="h-10 w-10 mx-auto text-green-600 mb-3" />
              <p className="text-sm text-green-600 font-medium mb-1">Financiamento</p>
              <p className="text-lg font-bold text-green-900">
                {data.installments}x de {formatCurrency(results.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>

        {/* Detalhes do Pagamento */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Detalhes do Pagamento
          </h4>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Valor Financiado:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(results.financedAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Taxa de Juros:</span>
              <span className="font-medium text-gray-900">
                {data.interestRate}% ao ano
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Sales Tax:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(results.totalTaxes)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Total de Taxas:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(results.totalFees)}
              </span>
            </div>
          </div>
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
              <span>Sales Tax ({data.taxRate}%):</span>
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

        {/* Foto do Veículo */}
        {data.vehicle && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Veículo
            </h4>
            {data.vehicle.image_url ? (
              <div className="flex justify-center">
                <img 
                  src={data.vehicle.image_url} 
                  alt={`${data.vehicle.name} ${data.vehicle.year}`}
                  className="max-w-full h-48 object-cover rounded-lg border"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Car className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Imagem não disponível</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingResults;
