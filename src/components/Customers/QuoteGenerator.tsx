
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Print } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  interested_vehicle_id?: string;
  responsible_seller_id?: string;
  deal_status: string;
  payment_type: string;
}

interface QuoteGeneratorProps {
  customer: Customer;
  onBack: () => void;
}

const QuoteGenerator = ({ customer, onBack }: QuoteGeneratorProps) => {
  const { t } = useLanguage();
  const [signatureDate, setSignatureDate] = useState(new Date().toLocaleDateString());

  // Fetch vehicle details
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', customer.interested_vehicle_id],
    queryFn: async () => {
      if (!customer.interested_vehicle_id) return null;
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', customer.interested_vehicle_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!customer.interested_vehicle_id,
  });

  // Fetch seller details
  const { data: seller } = useQuery({
    queryKey: ['seller', customer.responsible_seller_id],
    queryFn: async () => {
      if (!customer.responsible_seller_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customer.responsible_seller_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!customer.responsible_seller_id,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create a downloadable document
    const content = document.getElementById('quote-content')?.innerHTML;
    const blob = new Blob([`
      <html>
        <head>
          <title>${customer.deal_status === 'completed' ? 'Contrato' : 'Orçamento'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; }
            .signature-line { border-bottom: 1px solid #000; width: 300px; margin: 20px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customer.deal_status === 'completed' ? 'contrato' : 'orcamento'}-${customer.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {customer.deal_status === 'completed' ? t('generateContract') : t('generateQuote')}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Print className="h-4 w-4 mr-2" />
            {t('printQuote')}
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t('exportDeal')}
          </Button>
        </div>
      </div>

      <Card id="quote-content">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-revenshop-primary">
            REVENSHOP
          </CardTitle>
          <p className="text-lg">
            {customer.deal_status === 'completed' ? 'CONTRATO DE VENDA' : 'ORÇAMENTO'}
          </p>
          <p className="text-sm text-gray-600">
            Data: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Customer Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">{t('customerDetails')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Nome:</strong> {customer.name}
              </div>
              <div>
                <strong>Telefone:</strong> {customer.phone}
              </div>
              <div>
                <strong>Email:</strong> {customer.email || 'Não informado'}
              </div>
              <div>
                <strong>Endereço:</strong> {customer.address || 'Não informado'}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          {vehicle && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">{t('vehicleDetails')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Veículo:</strong> {vehicle.year} {vehicle.name} {vehicle.model}
                </div>
                <div>
                  <strong>VIN:</strong> {vehicle.vin}
                </div>
                <div>
                  <strong>Cor:</strong> {vehicle.color}
                </div>
                <div>
                  <strong>Milhas:</strong> {vehicle.miles?.toLocaleString()}
                </div>
                <div>
                  <strong>Preço de Venda:</strong> ${vehicle.sale_price?.toLocaleString()}
                </div>
                <div>
                  <strong>Mínimo Negociável:</strong> ${vehicle.min_negotiable?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Deal Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">{t('dealDetails')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Tipo de Pagamento:</strong> {
                  customer.payment_type === 'cash' ? t('cash') :
                  customer.payment_type === 'financing' ? t('financing') :
                  customer.payment_type === 'bhph' ? t('bhph') : customer.payment_type
                }
              </div>
              <div>
                <strong>Status:</strong> {
                  customer.deal_status === 'completed' ? t('completedSale') : t('quote')
                }
              </div>
              {vehicle && (
                <>
                  <div>
                    <strong>Valor Total:</strong> ${vehicle.sale_price?.toLocaleString()}
                  </div>
                  {customer.payment_type === 'bhph' && (
                    <>
                      <div>
                        <strong>Entrada:</strong> $___________
                      </div>
                      <div>
                        <strong>Financiado:</strong> $___________
                      </div>
                      <div>
                        <strong>Pagamento Mensal:</strong> $___________
                      </div>
                      <div>
                        <strong>Prazo:</strong> _______ meses
                      </div>
                      <div>
                        <strong>Taxa de Juros:</strong> _______ %
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Seller Details */}
          {seller && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Vendedor Responsável</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Nome:</strong> {seller.first_name} {seller.last_name}
                </div>
                <div>
                  <strong>Email:</strong> {seller.email}
                </div>
                <div>
                  <strong>Telefone:</strong> {seller.phone || 'Não informado'}
                </div>
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div className="space-y-8 pt-8">
            <div>
              <h3 className="font-semibold mb-4">Termos e Condições:</h3>
              <p className="text-sm text-gray-600 mb-4">
                Este {customer.deal_status === 'completed' ? 'contrato' : 'orçamento'} está sujeito aos termos e condições da REVENSHOP. 
                O cliente declara estar ciente de todas as condições apresentadas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="mb-4">Assinatura do Cliente:</p>
                <div className="border-b border-black w-full h-16 mb-2"></div>
                <p className="text-sm">
                  {customer.name}<br/>
                  Data: {signatureDate}
                </p>
              </div>
              <div>
                <p className="mb-4">Assinatura do Vendedor:</p>
                <div className="border-b border-black w-full h-16 mb-2"></div>
                <p className="text-sm">
                  {seller ? `${seller.first_name} ${seller.last_name}` : '_______________'}<br/>
                  Data: {signatureDate}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteGenerator;
