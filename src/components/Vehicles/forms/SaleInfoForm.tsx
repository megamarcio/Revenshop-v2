import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Wrench, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '../../../contexts/AuthContext';
import { useMaintenance } from '../../../hooks/useMaintenance';

interface SaleInfoFormProps {
  formData: {
    purchasePrice: string;
    salePrice: string;
    minNegotiable: string;
    carfaxPrice: string;
    mmrValue: string;
    seller: string;
    finalSalePrice: string;
    saleDate: string;
    saleNotes: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    financingCompany: string;
    checkDetails: string;
    otherPaymentDetails: string;
    sellerCommission: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  calculateProfitMargin: () => string;
  vehicleId?: string;
  onViewMaintenance?: () => void;
  onNavigateToCustomers?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SaleInfoForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  calculateProfitMargin, 
  vehicleId,
  onViewMaintenance,
  onNavigateToCustomers,
  isOpen = false,
  onToggle
}: SaleInfoFormProps) => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { getTotalMaintenanceCost } = useMaintenance();
  
  const maintenanceCost = vehicleId ? getTotalMaintenanceCost(vehicleId) : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatProfitMargin = () => {
    const margin = calculateProfitMargin();
    // Convert from "2.5x" format to "150%" format
    const numericValue = parseFloat(margin.replace('x', ''));
    if (isNaN(numericValue)) return '0%';
    const percentage = ((numericValue - 1) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          type="button"
        >
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            À Venda
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 mt-4">
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
                {formatProfitMargin()}
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

          {/* Custo Total de Manutenções - apenas exibição */}
          {(isAdmin || isInternalSeller) && vehicleId && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Custo Total Manutenções
              </Label>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(maintenanceCost)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SaleInfoForm;
