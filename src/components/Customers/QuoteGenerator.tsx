
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Download, Calendar, User, Car, Calculator } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const [taxes, setTaxes] = useState(0);
  const [fees, setFees] = useState(0);

  const calculateFinancing = () => {
    const principal = totalAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    setMonthlyPayment(Math.round(payment));
  };

  React.useEffect(() => {
    if (totalAmount > 0 && downPayment >= 0 && termMonths > 0 && interestRate > 0) {
      calculateFinancing();
    }
  }, [totalAmount, downPayment, termMonths, interestRate]);

  const finalTotal = totalAmount + taxes + fees;
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting quote...');
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              margin: 1cm;
              size: A4;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            
            .print\\:bg-white {
              background-color: white !important;
            }
            
            .print\\:text-black {
              color: black !important;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{t('generateQuote')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Cálculo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculadora de Financiamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="totalAmount">Valor Total do Veículo</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="downPayment">Entrada</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="termMonths">Prazo (meses)</Label>
                <Input
                  id="termMonths"
                  type="number"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Taxa de Juros (% ao ano)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="taxes">Impostos</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={taxes}
                  onChange={(e) => setTaxes(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fees">Taxas</Label>
                <Input
                  id="fees"
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview do Orçamento */}
          <Card className="print:shadow-none">
            <CardHeader className="bg-blue-600 text-white print:bg-white print:text-black">
              <CardTitle className="text-center">
                <div className="text-2xl font-bold">REVENSHOP</div>
                <div className="text-sm font-normal">ORÇAMENTO DE VEÍCULO</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Informações do Cliente */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">DADOS DO CLIENTE</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nome:</span> {customer.name}
                  </div>
                  <div>
                    <span className="font-medium">Telefone:</span> {customer.phone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {customer.email || 'Não informado'}
                  </div>
                  <div>
                    <span className="font-medium">Data:</span> {currentDate}
                  </div>
                </div>
                {customer.address && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Endereço:</span> {customer.address}
                  </div>
                )}
              </div>

              {/* Informações do Veículo */}
              {customer.interested_vehicle && (
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">DADOS DO VEÍCULO</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Veículo:</span> {customer.interested_vehicle.year} {customer.interested_vehicle.name} {customer.interested_vehicle.model}
                    </div>
                    <div>
                      <span className="font-medium">Preço Base:</span> R$ {customer.interested_vehicle.sale_price.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes Financeiros */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">DETALHES FINANCEIROS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Valor do Veículo:</span>
                    <span className="font-medium">R$ {totalAmount.toLocaleString('pt-BR')}</span>
                  </div>
                  {taxes > 0 && (
                    <div className="flex justify-between">
                      <span>Impostos:</span>
                      <span className="font-medium">R$ {taxes.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  {fees > 0 && (
                    <div className="flex justify-between">
                      <span>Taxas:</span>
                      <span className="font-medium">R$ {fees.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">VALOR TOTAL:</span>
                    <span className="font-bold text-lg">R$ {finalTotal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Opções de Pagamento */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">OPÇÕES DE PAGAMENTO</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="font-medium text-green-800">À Vista</div>
                    <div className="text-2xl font-bold text-green-600">R$ {finalTotal.toLocaleString('pt-BR')}</div>
                  </div>
                  
                  {downPayment > 0 && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="font-medium text-blue-800">Financiado</div>
                      <div className="space-y-1">
                        <div>Entrada: <span className="font-bold">R$ {downPayment.toLocaleString('pt-BR')}</span></div>
                        <div>{termMonths}x de <span className="font-bold text-blue-600">R$ {monthlyPayment.toLocaleString('pt-BR')}</span></div>
                        <div className="text-sm text-gray-600">Taxa: {interestRate}% a.a.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assinatura */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">CONFIRMAÇÃO</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="border-b-2 border-gray-300 h-12"></div>
                    <div className="text-sm text-center">Assinatura do Cliente</div>
                    <div className="text-xs text-center text-gray-500">Data: ___/___/_____</div>
                  </div>
                  <div className="space-y-2">
                    <div className="border-b-2 border-gray-300 h-12"></div>
                    <div className="text-sm text-center">Assinatura do Vendedor</div>
                    <div className="text-xs text-center text-gray-500">Data: ___/___/_____</div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="text-xs text-gray-600 border-t pt-4">
                <p>* Este orçamento tem validade de 7 dias.</p>
                <p>* Valores sujeitos a alteração conforme análise de crédito.</p>
                <p>* Documentação necessária: RG, CPF, Comprovante de Renda e Residência.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 print:hidden">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Imprimir Orçamento
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuoteGenerator;
