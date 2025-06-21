import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChevronDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleFormData } from '../types/vehicleFormTypes';
import BasicInfoSection from './FinancingInfo/BasicInfoSection';
import AmountsSection from './FinancingInfo/AmountsSection';
import InstallmentsSection from './FinancingInfo/InstallmentsSection';
import { 
  calculateRemainingInstallments, 
  calculateTotalToPay, 
  calculateInterestRate 
} from './FinancingInfo/calculationUtils';

interface FinancingInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FinancingInfoForm = ({
  formData,
  errors,
  onInputChange,
  isOpen,
  onToggle
}: FinancingInfoFormProps) => {

  // Atualizar campos calculados quando necessário
  React.useEffect(() => {
    if (formData.totalInstallments && formData.paidInstallments) {
      const newRemaining = calculateRemainingInstallments(formData.totalInstallments, formData.paidInstallments);
      if (newRemaining !== formData.remainingInstallments) {
        onInputChange('remainingInstallments', newRemaining);
      }
    }
  }, [formData.totalInstallments, formData.paidInstallments]);

  React.useEffect(() => {
    if (formData.remainingInstallments && formData.installmentValue) {
      const newTotal = calculateTotalToPay(formData.remainingInstallments, formData.installmentValue);
      if (newTotal !== formData.totalToPay) {
        onInputChange('totalToPay', newTotal);
      }
    }
  }, [formData.remainingInstallments, formData.installmentValue]);

  // Calcular taxa de juros automaticamente
  React.useEffect(() => {
    if (formData.financedAmount && formData.installmentValue && formData.totalInstallments) {
      const newRate = calculateInterestRate(formData.financedAmount, formData.installmentValue, formData.totalInstallments);
      if (newRate !== formData.interestRate && newRate !== '') {
        onInputChange('interestRate', newRate);
      }
    }
  }, [formData.financedAmount, formData.installmentValue, formData.totalInstallments]);

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Financiado
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados do Financiamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BasicInfoSection formData={formData} onInputChange={onInputChange} />
              <AmountsSection formData={formData} onInputChange={onInputChange} />
              <InstallmentsSection formData={formData} onInputChange={onInputChange} />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

export default FinancingInfoForm;
