
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface SaleInfoFormProps {
  formData: {
    category: 'forSale' | 'sold';
    saleDate?: string;
    finalSalePrice?: string;
    customerName?: string;
    customerPhone?: string;
    seller?: string;
    saleNotes?: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const SaleInfoForm = ({ formData, errors, onInputChange }: SaleInfoFormProps) => {
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
                <Label htmlFor="finalSalePrice">Valor Final de Venda (R$)</Label>
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
