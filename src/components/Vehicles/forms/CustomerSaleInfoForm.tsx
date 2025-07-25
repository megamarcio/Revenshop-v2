
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface CustomerSaleInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  onNavigateToCustomers?: () => void;
}

const CustomerSaleInfoForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  onNavigateToCustomers 
}: CustomerSaleInfoFormProps) => {
  const isVehicleSold = formData.category === 'sold';

  return (
    <div className="space-y-4">
      {isVehicleSold && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Informações da Venda</h3>
            {onNavigateToCustomers && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onNavigateToCustomers}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Gerenciar Clientes
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller">Vendedor</Label>
              <Input
                id="seller"
                value={formData.seller}
                onChange={(e) => onInputChange('seller', e.target.value)}
                placeholder="Nome do vendedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalSalePrice">Valor Final de Venda ($)</Label>
              <Input
                id="finalSalePrice"
                type="number"
                step="0.01"
                value={formData.finalSalePrice}
                onChange={(e) => onInputChange('finalSalePrice', e.target.value)}
                placeholder="Ex: 67500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saleDate">Data da Venda</Label>
              <Input
                id="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={(e) => onInputChange('saleDate', e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome do Cliente</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => onInputChange('customerName', e.target.value)}
                placeholder="Nome completo do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone do Cliente</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => onInputChange('customerPhone', e.target.value)}
                placeholder="Ex: (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select
              value={formData.paymentMethod || ''}
              onValueChange={(value) => onInputChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="financing">Financiamento</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod === 'financing' && (
            <div className="space-y-2">
              <Label htmlFor="financingCompany">Empresa de Financiamento</Label>
              <Input
                id="financingCompany"
                value={formData.financingCompany}
                onChange={(e) => onInputChange('financingCompany', e.target.value)}
                placeholder="Nome da financeira"
              />
            </div>
          )}

          {formData.paymentMethod === 'check' && (
            <div className="space-y-2">
              <Label htmlFor="checkDetails">Detalhes do Cheque</Label>
              <Input
                id="checkDetails"
                value={formData.checkDetails}
                onChange={(e) => onInputChange('checkDetails', e.target.value)}
                placeholder="Banco, número do cheque, etc."
              />
            </div>
          )}

          {formData.paymentMethod === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="otherPaymentDetails">Detalhes do Pagamento</Label>
              <Input
                id="otherPaymentDetails"
                value={formData.otherPaymentDetails}
                onChange={(e) => onInputChange('otherPaymentDetails', e.target.value)}
                placeholder="Descreva o método de pagamento"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="saleNotes">Observações da Venda</Label>
            <Textarea
              id="saleNotes"
              value={formData.saleNotes}
              onChange={(e) => onInputChange('saleNotes', e.target.value)}
              placeholder="Observações adicionais sobre a venda"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSaleInfoForm;
