
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  interested_vehicle?: {
    name: string;
    model: string;
    year: number;
    sale_price: number;
  };
}

interface QuoteGeneratorProps {
  customer: Customer;
  onBack: () => void;
}

const QuoteGenerator = ({ customer, onBack }: QuoteGeneratorProps) => {
  const { t } = useLanguage();
  const [totalAmount, setTotalAmount] = useState(customer.interested_vehicle?.sale_price || 0);
  const [downPayment, setDownPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(12);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Implementar exportação do deal
    console.log('Exporting deal...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">{t('generateQuote')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dealDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalAmount">{t('totalAmount')}</Label>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="downPayment">{t('downPayment')}</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="monthlyPayment">{t('monthlyPayment')}</Label>
              <Input
                id="monthlyPayment"
                type="number"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="termMonths">{t('termMonths')}</Label>
              <Input
                id="termMonths"
                type="number"
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="interestRate">{t('interestRate')}</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview do Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle>Preview do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">REVENSHOP</h3>
                <p className="text-sm text-gray-600">Orçamento de Veículo</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium">{t('customerDetails')}</h4>
                <p>{customer.name}</p>
                <p>{customer.phone}</p>
                <p>{customer.email}</p>
                <p>{customer.address}</p>
              </div>

              {customer.interested_vehicle && (
                <div className="border-t pt-4">
                  <h4 className="font-medium">{t('vehicleDetails')}</h4>
                  <p>{customer.interested_vehicle.year} {customer.interested_vehicle.name} {customer.interested_vehicle.model}</p>
                  <p>Preço: R$ {customer.interested_vehicle.sale_price.toLocaleString()}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium">{t('dealDetails')}</h4>
                <p>Valor Total: R$ {totalAmount.toLocaleString()}</p>
                <p>Entrada: R$ {downPayment.toLocaleString()}</p>
                <p>Parcela Mensal: R$ {monthlyPayment.toLocaleString()}</p>
                <p>Prazo: {termMonths} meses</p>
                <p>Taxa de Juros: {interestRate}%</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium">{t('signature')}</h4>
                <div className="border-b border-gray-300 mt-8 mb-2"></div>
                <p className="text-sm">Cliente</p>
                <div className="mt-4">
                  <p className="text-sm">{t('signatureDate')}: ___/___/_____</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          {t('printQuote')}
        </Button>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t('exportDeal')}
        </Button>
      </div>
    </div>
  );
};

export default QuoteGenerator;
