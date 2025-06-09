
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Wrench, Eye } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

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
  vehicleId?: string;
}

const FinancialInfoForm = ({ formData, errors, onInputChange, calculateProfitMargin, vehicleId }: FinancialInfoFormProps) => {
  const { isAdmin, isInternalSeller } = useAuth();
  
  // Mock data para demonstração - em produção viria de uma consulta real
  const maintenanceCost = vehicleId ? 1250.00 : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleViewMaintenance = () => {
    // TODO: Implementar modal ou navegação para ver manutenções
    console.log('Ver manutenções do veículo:', vehicleId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Calculator className="h-5 w-5" />
        <span>Informações Financeiras</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Valor de Compra ($) *</Label>
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
          <Label htmlFor="salePrice">Valor de Venda ($) *</Label>
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
          <Label htmlFor="minNegotiable">Valor Mín. Negociável ($)</Label>
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
          <Label htmlFor="carfaxPrice">Valor Carfax ($)</Label>
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
          <Label htmlFor="mmrValue">Valor MMR ($)</Label>
          <Input
            id="mmrValue"
            type="number"
            step="0.01"
            value={formData.mmrValue}
            onChange={(e) => onInputChange('mmrValue', e.target.value)}
            placeholder="Ex: 66000"
          />
        </div>

        {/* Custo Total de Manutenções - apenas para admins e vendedores internos */}
        {(isAdmin || isInternalSeller) && vehicleId && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Custo Total Manutenções
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(maintenanceCost)}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewMaintenance}
                className="flex items-center gap-1"
                title="Ver Manutenções"
              >
                <Eye className="h-4 w-4" />
                Ver
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInfoForm;
