
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface FinancialInfoFormProps {
  formData: {
    purchasePrice: string;
    salePrice: string;
    minNegotiable: string;
    carfaxPrice: string;
    mmrValue: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  calculateProfitMargin: () => string;
}

const FinancialInfoForm = ({ formData, errors, onInputChange, calculateProfitMargin }: FinancialInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Calculator className="h-5 w-5" />
        <span>Informações Financeiras</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Valor de Compra (R$) *</Label>
          <Input
            id="purchasePrice"
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => onInputChange('purchasePrice', e.target.value)}
            placeholder="Ex: 55000"
            className={errors.purchasePrice ? 'border-red-500' : ''}
          />
          {errors.purchasePrice && <p className="text-sm text-red-500">{errors.purchasePrice}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">Valor de Venda (R$) *</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            value={formData.salePrice}
            onChange={(e) => onInputChange('salePrice', e.target.value)}
            placeholder="Ex: 68000"
            className={errors.salePrice ? 'border-red-500' : ''}
          />
          {errors.salePrice && <p className="text-sm text-red-500">{errors.salePrice}</p>}
        </div>

        <div className="space-y-2">
          <Label>Margem de Lucro</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-lg font-bold text-green-600">
              {calculateProfitMargin()}x
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minNegotiable">Valor Mín. Negociável (R$)</Label>
          <Input
            id="minNegotiable"
            type="number"
            step="0.01"
            value={formData.minNegotiable}
            onChange={(e) => onInputChange('minNegotiable', e.target.value)}
            placeholder="Ex: 65000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carfaxPrice">Valor Carfax (R$)</Label>
          <Input
            id="carfaxPrice"
            type="number"
            step="0.01"
            value={formData.carfaxPrice}
            onChange={(e) => onInputChange('carfaxPrice', e.target.value)}
            placeholder="Ex: 67000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mmrValue">Valor MMR (R$)</Label>
          <Input
            id="mmrValue"
            type="number"
            step="0.01"
            value={formData.mmrValue}
            onChange={(e) => onInputChange('mmrValue', e.target.value)}
            placeholder="Ex: 66000"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInfoForm;
