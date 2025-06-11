
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { VehicleFormData } from '../../types/vehicleFormTypes';
import { calculateMonthlyRate } from './calculationUtils';

interface InstallmentsSectionProps {
  formData: VehicleFormData;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const InstallmentsSection = ({ formData, onInputChange }: InstallmentsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="totalInstallments">Total de Parcelas</Label>
        <Input 
          id="totalInstallments"
          type="number"
          value={formData.totalInstallments} 
          onChange={(e) => onInputChange('totalInstallments', e.target.value)} 
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="paidInstallments">Parcelas Pagas</Label>
        <Input 
          id="paidInstallments"
          type="number"
          value={formData.paidInstallments} 
          onChange={(e) => onInputChange('paidInstallments', e.target.value)} 
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="remainingInstallments">Parcelas Restantes</Label>
        <Input 
          id="remainingInstallments"
          type="number"
          value={formData.remainingInstallments} 
          readOnly
          className="bg-gray-100"
          placeholder="Calculado automaticamente"
        />
      </div>

      <div>
        <Label htmlFor="totalToPay">Total a Pagar Parcelado</Label>
        <Input 
          id="totalToPay"
          type="number"
          step="0.01"
          value={formData.totalToPay} 
          readOnly
          className="bg-gray-100"
          placeholder="Calculado automaticamente"
        />
      </div>

      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor="interestRate" className="cursor-help">Taxa de Juros (% anual)</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>Taxa de juros aproximada mensal: {calculateMonthlyRate(formData.financedAmount, formData.installmentValue, formData.totalInstallments)}%</p>
          </TooltipContent>
        </Tooltip>
        <Input 
          id="interestRate"
          type="number"
          step="0.0001"
          value={formData.interestRate} 
          readOnly
          className="bg-gray-100"
          placeholder="Calculada automaticamente"
        />
        {formData.interestRate && (
          <p className="text-xs text-gray-600 mt-1">
            Calculada com base no valor financiado, parcela e total de parcelas
          </p>
        )}
      </div>
    </div>
  );
};

export default InstallmentsSection;
