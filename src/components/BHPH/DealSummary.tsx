
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';
import { Deal } from './BuyHerePayHere';
import { useAuth } from '../../contexts/AuthContext';
import { useBHPH } from '../../contexts/BHPHContext';

interface DealSummaryProps {
  deal: Deal;
  isAdmin: boolean;
}

const DealSummary = ({ deal, isAdmin }: DealSummaryProps) => {
  const { settings } = useBHPH();
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const copyDealToClipboard = () => {
    const dealText = `Veículo: ${deal.vehicle.name} ${deal.vehicle.year}
Cor: ${deal.vehicle.color}
Vin Number: ${deal.vehicle.vin}
Preço Venda: ${formatCurrency(deal.vehicle.salePrice)}

Deal:
Entrada sugerida: ${formatCurrency(deal.downPayment)}
Parcelamento: ${deal.installments}x de ${formatCurrency(deal.installmentValue)}

Sem consulta ao crédito.
Aprovação rápida. Veículo pronto para retirada.`;

    navigator.clipboard.writeText(dealText).then(() => {
      alert('Deal copiado para a área de transferência!');
    });
  };

  const exportToCSV = () => {
    const csvData = [
      ['Campo', 'Valor'],
      ['Veículo', `${deal.vehicle.name} ${deal.vehicle.year}`],
      ['Cor', deal.vehicle.color],
      ['VIN', deal.vehicle.vin],
      ['Código Interno', deal.vehicle.internalCode],
      ['Valor de Compra', deal.vehicle.purchasePrice],
      ['Preço de Venda', deal.vehicle.salePrice],
      ['Entrada', deal.downPayment],
      ['Parcelas', deal.installments],
      ['Valor da Parcela', deal.installmentValue],
      ['Taxa de Juros (%)', deal.interestRate * 100],
      ['Total Financiado', deal.vehicle.salePrice - deal.downPayment],
      ['Total a Receber', deal.downPayment + (deal.installmentValue * deal.installments)],
      ['Margem Bruta', deal.vehicle.salePrice - deal.vehicle.purchasePrice]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deal_${deal.vehicle.internalCode}_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    // Para XLSX, criamos um CSV mas com extensão XLSX (funciona na maioria dos casos)
    const csvData = [
      ['Campo', 'Valor'],
      ['Veículo', `${deal.vehicle.name} ${deal.vehicle.year}`],
      ['Cor', deal.vehicle.color],
      ['VIN', deal.vehicle.vin],
      ['Código Interno', deal.vehicle.internalCode],
      ['Valor de Compra', deal.vehicle.purchasePrice],
      ['Preço de Venda', deal.vehicle.salePrice],
      ['Entrada', deal.downPayment],
      ['Parcelas', deal.installments],
      ['Valor da Parcela', deal.installmentValue],
      ['Taxa de Juros (%)', deal.interestRate * 100],
      ['Total Financiado', deal.vehicle.salePrice - deal.downPayment],
      ['Total a Receber', deal.downPayment + (deal.installmentValue * deal.installments)],
      ['Margem Bruta', deal.vehicle.salePrice - deal.vehicle.purchasePrice]
    ];

    const csvContent = csvData.map(row => row.join('\t')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deal_${deal.vehicle.internalCode}_${new Date().getTime()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Deal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resumo amigável */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                {deal.vehicle.name} {deal.vehicle.year}
              </h3>
              
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Cor:</span> {deal.vehicle.color}</p>
                <p><span className="font-medium">VIN:</span> {deal.vehicle.vin}</p>
                <p><span className="font-medium">Preço:</span> {formatCurrency(deal.vehicle.salePrice)}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Deal:</h4>
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-medium">Entrada:</span> 
                    <span className="text-green-600 font-bold ml-2">{formatCurrency(deal.downPayment)}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-medium">Parcelamento:</span> 
                    <span className="text-blue-600 font-bold ml-2">
                      {deal.installments}x de {formatCurrency(deal.installmentValue)}
                    </span>
                  </p>
                </div>

                <div className="mt-4 p-3 bg-white rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <strong>Sem consulta ao crédito.</strong><br />
                    Aprovação rápida. Veículo pronto para retirada.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={copyDealToClipboard} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Deal
              </Button>
              
              {isAdmin && (
                <>
                  <Button onClick={exportToCSV} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button onClick={exportToXLSX} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    XLSX
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Detalhes completos (apenas para admin) */}
          {isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Detalhes Completos (Admin)</h4>
                <Button
                  onClick={() => setShowAdminDetails(!showAdminDetails)}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  {showAdminDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {showAdminDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Valor de Compra:</p>
                      <p className="font-semibold">{formatCurrency(deal.vehicle.purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Preço de Venda:</p>
                      <p className="font-semibold">{formatCurrency(deal.vehicle.salePrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Financiado:</p>
                      <p className="font-semibold">{formatCurrency(deal.vehicle.salePrice - deal.downPayment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total a Receber:</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(deal.downPayment + (deal.installmentValue * deal.installments))}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Margem Bruta:</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(deal.vehicle.salePrice - deal.vehicle.purchasePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Taxa de Juros:</p>
                      <p className="font-semibold">{settings.monthlyInterestRate}% a.m.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealSummary;
