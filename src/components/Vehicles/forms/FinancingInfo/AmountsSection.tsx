
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VehicleFormData } from '../../types/vehicleFormTypes';

interface AmountsSectionProps {
  formData: VehicleFormData;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const AmountsSection = ({ formData, onInputChange }: AmountsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="installmentValue">Valor da Parcela</Label>
        <Input 
          id="installmentValue"
          type="number"
          step="0.01"
          value={formData.installmentValue} 
          onChange={(e) => onInputChange('installmentValue', e.target.value)} 
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="downPayment">Down Payment</Label>
        <Input 
          id="downPayment"
          type="number"
          step="0.01"
          value={formData.downPayment} 
          onChange={(e) => onInputChange('downPayment', e.target.value)} 
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="financedAmount">Valor Financiado</Label>
        <Input 
          id="financedAmount"
          type="number"
          step="0.01"
          value={formData.financedAmount} 
          onChange={(e) => onInputChange('financedAmount', e.target.value)} 
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="payoffValue">Valor do Payoff</Label>
        <Input 
          id="payoffValue"
          type="number"
          step="0.01"
          value={formData.payoffValue} 
          onChange={(e) => onInputChange('payoffValue', e.target.value)} 
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="payoffDate">Data Payoff</Label>
        <Input 
          id="payoffDate"
          type="date"
          value={formData.payoffDate} 
          onChange={(e) => onInputChange('payoffDate', e.target.value)} 
        />
      </div>
    </div>
  );
};

export default AmountsSection;
