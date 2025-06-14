import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, DollarSign, UserPlus } from 'lucide-react';
interface SaleInfoFormProps {
  formData: {
    category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
    consignmentStore?: string;
    saleDate?: string;
    finalSalePrice?: string;
    customerName?: string;
    customerPhone?: string;
    seller?: string;
    saleNotes?: string;
    paymentMethod?: string;
    financingCompany?: string;
    checkDetails?: string;
    otherPaymentDetails?: string;
    sellerCommission?: string;
    titleStatus?: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onNavigateToCustomers?: () => void;
}
const SaleInfoForm = ({
  formData,
  errors,
  onInputChange,
  onNavigateToCustomers
}: SaleInfoFormProps) => {
  const renderPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case 'financing':
        return <div className="space-y-2">
            <Label htmlFor="financingCompany">Nome da Financeira</Label>
            <Input id="financingCompany" value={formData.financingCompany || ''} onChange={e => onInputChange('financingCompany', e.target.value)} placeholder="Ex: Banco do Brasil, Santander..." />
          </div>;
      case 'check':
        return <div className="space-y-2">
            <Label htmlFor="checkDetails">Informações dos Cheques</Label>
            <Textarea id="checkDetails" value={formData.checkDetails || ''} onChange={e => onInputChange('checkDetails', e.target.value)} placeholder="Ex: 3 cheques de $5000 cada, datas de vencimento..." rows={3} />
          </div>;
      case 'other':
        return <div className="space-y-2">
            <Label htmlFor="otherPaymentDetails">Detalhes da Forma de Pagamento</Label>
            <Textarea id="otherPaymentDetails" value={formData.otherPaymentDetails || ''} onChange={e => onInputChange('otherPaymentDetails', e.target.value)} placeholder="Descreva os detalhes da forma de pagamento..." rows={3} />
          </div>;
      default:
        return null;
    }
  };
  return <div className="space-y-4">
      
      <div className="space-y-4">
        

        {formData.category === 'consigned' && <div className="space-y-2">
            <Label htmlFor="consignmentStore">Nome da Loja *</Label>
            <Input id="consignmentStore" value={formData.consignmentStore || ''} onChange={e => onInputChange('consignmentStore', e.target.value)} placeholder="Ex: Auto Center Silva" className={errors.consignmentStore ? 'border-red-500' : ''} />
            {errors.consignmentStore && <p className="text-sm text-red-500">{errors.consignmentStore}</p>}
          </div>}

        {formData.category === 'sold' && <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-5 w-5" />
                Informações da Venda
              </CardTitle>
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-600">
                  Para registrar a venda, primeiro cadastre o cliente
                </p>
                {onNavigateToCustomers && <Button type="button" variant="outline" size="sm" onClick={onNavigateToCustomers} className="border-green-300 text-green-700 hover:bg-green-50">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar Cliente
                  </Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Dados do Cliente</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nome do Cliente *</Label>
                    <Input id="customerName" value={formData.customerName} onChange={e => onInputChange('customerName', e.target.value)} placeholder="Ex: João Silva" className={errors.customerName ? 'border-red-500' : ''} />
                    {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Telefone do Cliente *</Label>
                    <Input id="customerPhone" value={formData.customerPhone} onChange={e => onInputChange('customerPhone', e.target.value)} placeholder="Ex: (11) 99999-9999" className={errors.customerPhone ? 'border-red-500' : ''} />
                    {errors.customerPhone && <p className="text-sm text-red-500">{errors.customerPhone}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saleDate">Data da Venda *</Label>
                  <Input id="saleDate" type="date" value={formData.saleDate} onChange={e => onInputChange('saleDate', e.target.value)} className={errors.saleDate ? 'border-red-500' : ''} />
                  {errors.saleDate && <p className="text-sm text-red-500">{errors.saleDate}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="finalSalePrice">Valor Final de Venda ($) *</Label>
                  <Input id="finalSalePrice" type="number" step="0.01" value={formData.finalSalePrice} onChange={e => onInputChange('finalSalePrice', e.target.value)} placeholder="Ex: 66500" className={errors.finalSalePrice ? 'border-red-500' : ''} />
                  {errors.finalSalePrice && <p className="text-sm text-red-500">{errors.finalSalePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller">Nome do Vendedor</Label>
                  <Input id="seller" value={formData.seller} onChange={e => onInputChange('seller', e.target.value)} placeholder="Ex: Maria Santos" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerCommission">Comissão do Vendedor ($)</Label>
                  <Input id="sellerCommission" type="number" step="0.01" value={formData.sellerCommission} onChange={e => onInputChange('sellerCommission', e.target.value)} placeholder="Ex: 1500" />
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                  <Select value={formData.paymentMethod || ''} onValueChange={value => onInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="financing">Financiamento</SelectItem>
                      <SelectItem value="bhph">BHPH</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderPaymentDetails()}
              </div>

              <div className="space-y-2">
                <Label htmlFor="saleNotes">Observações da Venda</Label>
                <Textarea id="saleNotes" value={formData.saleNotes} onChange={e => onInputChange('saleNotes', e.target.value)} placeholder="Ex: Cliente pagou à vista, entrega agendada para..." rows={3} />
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default SaleInfoForm;