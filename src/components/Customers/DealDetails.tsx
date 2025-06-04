
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deal_status: string;
  payment_type: string;
  payment_details?: any;
  interested_vehicle?: {
    id: string;
    name: string;
    model: string;
    year: number;
    sale_price: number;
  };
}

interface DealDetailsProps {
  customer: Customer;
  onBack: () => void;
}

const DealDetails = ({ customer, onBack }: DealDetailsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [paymentType, setPaymentType] = useState(customer.payment_type || 'cash');
  const [dealStatus, setDealStatus] = useState(customer.deal_status || 'quote');
  const [paymentDetails, setPaymentDetails] = useState({
    // Cash details
    cashAmount: customer.payment_details?.cashAmount || '',
    
    // Financing details
    financingCompany: customer.payment_details?.financingCompany || '',
    downPayment: customer.payment_details?.downPayment || '',
    monthlyPayment: customer.payment_details?.monthlyPayment || '',
    termMonths: customer.payment_details?.termMonths || '',
    interestRate: customer.payment_details?.interestRate || '',
    
    // BHPH details
    bhphDownPayment: customer.payment_details?.bhphDownPayment || '',
    bhphMonthlyPayment: customer.payment_details?.bhphMonthlyPayment || '',
    bhphTermMonths: customer.payment_details?.bhphTermMonths || '',
    bhphInterestRate: customer.payment_details?.bhphInterestRate || '',
    
    // Additional details
    notes: customer.payment_details?.notes || '',
    taxes: customer.payment_details?.taxes || '',
    fees: customer.payment_details?.fees || ''
  });

  const updateDealMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('bhph_customers')
        .update({
          payment_type: paymentType,
          deal_status: dealStatus,
          payment_details: paymentDetails
        })
        .eq('id', customer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Sucesso!',
        description: 'Detalhes do deal atualizados com sucesso!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao atualizar deal: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateDealMutation.mutate({});
  };

  const handleExportDeal = () => {
    // Implementar exportação
    toast({
      title: 'Exportação',
      description: 'Funcionalidade de exportação será implementada em breve.',
    });
  };

  const handlePrintDeal = () => {
    window.print();
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const renderPaymentDetailsForm = () => {
    switch (paymentType) {
      case 'cash':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cashAmount">Valor Total à Vista</Label>
              <Input
                id="cashAmount"
                type="number"
                value={paymentDetails.cashAmount}
                onChange={(e) => handleInputChange('cashAmount', e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
        );

      case 'financing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="financingCompany">Financeira</Label>
                <Input
                  id="financingCompany"
                  value={paymentDetails.financingCompany}
                  onChange={(e) => handleInputChange('financingCompany', e.target.value)}
                  placeholder="Nome da financeira"
                />
              </div>
              <div>
                <Label htmlFor="downPayment">Entrada</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={paymentDetails.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="monthlyPayment">Parcela Mensal</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  value={paymentDetails.monthlyPayment}
                  onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="termMonths">Prazo (meses)</Label>
                <Input
                  id="termMonths"
                  type="number"
                  value={paymentDetails.termMonths}
                  onChange={(e) => handleInputChange('termMonths', e.target.value)}
                  placeholder="36"
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Taxa de Juros (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={paymentDetails.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  placeholder="12.5"
                />
              </div>
            </div>
          </div>
        );

      case 'bhph':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bhphDownPayment">Entrada BHPH</Label>
                <Input
                  id="bhphDownPayment"
                  type="number"
                  value={paymentDetails.bhphDownPayment}
                  onChange={(e) => handleInputChange('bhphDownPayment', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="bhphMonthlyPayment">Parcela Mensal BHPH</Label>
                <Input
                  id="bhphMonthlyPayment"
                  type="number"
                  value={paymentDetails.bhphMonthlyPayment}
                  onChange={(e) => handleInputChange('bhphMonthlyPayment', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="bhphTermMonths">Prazo BHPH (meses)</Label>
                <Input
                  id="bhphTermMonths"
                  type="number"
                  value={paymentDetails.bhphTermMonths}
                  onChange={(e) => handleInputChange('bhphTermMonths', e.target.value)}
                  placeholder="24"
                />
              </div>
              <div>
                <Label htmlFor="bhphInterestRate">Taxa de Juros BHPH (%)</Label>
                <Input
                  id="bhphInterestRate"
                  type="number"
                  step="0.1"
                  value={paymentDetails.bhphInterestRate}
                  onChange={(e) => handleInputChange('bhphInterestRate', e.target.value)}
                  placeholder="15.0"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Deal - {customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Deal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dealStatus">Status do Deal</Label>
              <Select value={dealStatus} onValueChange={setDealStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">Orçamento</SelectItem>
                  <SelectItem value="completed">Venda Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentType">Tipo de Pagamento</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">À Vista</SelectItem>
                  <SelectItem value="financing">Financiado</SelectItem>
                  <SelectItem value="bhph">Buy Here Pay Here</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderPaymentDetailsForm()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxes">Impostos</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={paymentDetails.taxes}
                  onChange={(e) => handleInputChange('taxes', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="fees">Taxas Adicionais</Label>
                <Input
                  id="fees"
                  type="number"
                  value={paymentDetails.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={paymentDetails.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações sobre o deal..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Deal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">Cliente</h4>
                <p>{customer.name}</p>
                <p>{customer.phone}</p>
                {customer.email && <p>{customer.email}</p>}
              </div>

              {customer.interested_vehicle && (
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Veículo</h4>
                  <p>{customer.interested_vehicle.year} {customer.interested_vehicle.name} {customer.interested_vehicle.model}</p>
                  <p>Preço: R$ {customer.interested_vehicle.sale_price?.toLocaleString()}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <p>Deal: {dealStatus === 'quote' ? 'Orçamento' : 'Venda Concluída'}</p>
                <p>Pagamento: {paymentType === 'cash' ? 'À Vista' : paymentType === 'financing' ? 'Financiado' : 'Buy Here Pay Here'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleSave} disabled={updateDealMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateDealMutation.isPending ? 'Salvando...' : 'Salvar Deal'}
        </Button>
        <Button onClick={handlePrintDeal} variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Imprimir Deal
        </Button>
        <Button onClick={handleExportDeal} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Deal
        </Button>
      </div>
    </div>
  );
};

export default DealDetails;
