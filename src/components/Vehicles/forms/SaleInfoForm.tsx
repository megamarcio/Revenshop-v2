import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SaleInfoFormProps {
  formData: {
    category: 'forSale' | 'sold';
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
}

const SaleInfoForm = ({ formData, errors, onInputChange }: SaleInfoFormProps) => {
  const renderPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case 'financing':
        return (
          <div className="space-y-2">
            <Label htmlFor="financingCompany">Nome da Financeira</Label>
            <Input
              id="financingCompany"
              value={formData.financingCompany || ''}
              onChange={(e) => onInputChange('financingCompany', e.target.value)}
              placeholder="Ex: Banco do Brasil, Santander..."
            />
          </div>
        );
      case 'check':
        return (
          <div className="space-y-2">
            <Label htmlFor="checkDetails">Informações dos Cheques</Label>
            <Textarea
              id="checkDetails"
              value={formData.checkDetails || ''}
              onChange={(e) => onInputChange('checkDetails', e.target.value)}
              placeholder="Ex: 3 cheques de $5000 cada, datas de vencimento..."
              rows={3}
            />
          </div>
        );
      case 'other':
        return (
          <div className="space-y-2">
            <Label htmlFor="otherPaymentDetails">Detalhes da Forma de Pagamento</Label>
            <Textarea
              id="otherPaymentDetails"
              value={formData.otherPaymentDetails || ''}
              onChange={(e) => onInputChange('otherPaymentDetails', e.target.value)}
              placeholder="Descreva os detalhes da forma de pagamento..."
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status de Venda</h3>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={formData.category === 'forSale' ? 'default' : 'outline'}
            onClick={() => onInputChange('category', 'forSale')}
          >
            À Venda
          </Button>
          <Button
            type="button"
            variant={formData.category === 'sold' ? 'default' : 'outline'}
            onClick={() => onInputChange('category', 'sold')}
          >
            Vendido
          </Button>
        </div>

        {formData.category === 'sold' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Informações da Venda</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Venda *</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => onInputChange('saleDate', e.target.value)}
                  className={errors.saleDate ? 'border-red-500' : ''}
                />
                {errors.saleDate && <p className="text-sm text-red-500">{errors.saleDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="finalSalePrice">Valor Final de Venda ($)</Label>
                <Input
                  id="finalSalePrice"
                  type="number"
                  step="0.01"
                  value={formData.finalSalePrice}
                  onChange={(e) => onInputChange('finalSalePrice', e.target.value)}
                  placeholder="Ex: 66500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => onInputChange('customerName', e.target.value)}
                  placeholder="Ex: João Silva"
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefone do Cliente *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => onInputChange('customerPhone', e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  className={errors.customerPhone ? 'border-red-500' : ''}
                />
                {errors.customerPhone && <p className="text-sm text-red-500">{errors.customerPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller">Nome do Vendedor</Label>
                <Input
                  id="seller"
                  value={formData.seller}
                  onChange={(e) => onInputChange('seller', e.target.value)}
                  placeholder="Ex: Maria Santos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerCommission">Comissão do Vendedor ($)</Label>
                <Input
                  id="sellerCommission"
                  type="number"
                  step="0.01"
                  value={formData.sellerCommission}
                  onChange={(e) => onInputChange('sellerCommission', e.target.value)}
                  placeholder="Ex: 1500"
                />
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select value={formData.paymentMethod || ''} onValueChange={(value) => onInputChange('paymentMethod', value)}>
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
              <Textarea
                id="saleNotes"
                value={formData.saleNotes}
                onChange={(e) => onInputChange('saleNotes', e.target.value)}
                placeholder="Ex: Cliente pagou à vista, entrega agendada para..."
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleInfoForm;
