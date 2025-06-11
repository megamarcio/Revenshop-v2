
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface FinancingInfoFormProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const financingBanks = [
  { value: 'lendbuz', label: 'Lendbuz' },
  { value: 'lobel', label: 'Lobel' },
  { value: 'westlake', label: 'Westlake' },
  { value: 'wells-fargo', label: 'Wells Fargo' },
  { value: 'capital-one', label: 'Capital One' },
  { value: 'banco-vw', label: 'Banco VW' },
  { value: 'toyota-financial', label: 'Toyota Financial Services' },
  { value: 'exeter-finance', label: 'Exeter Finance' },
  { value: 'outra', label: 'Outra' },
];

const FinancingInfoForm = ({
  formData,
  errors,
  onInputChange,
  isOpen,
  onToggle
}: FinancingInfoFormProps) => {

  // Calcular parcelas restantes automaticamente
  const calculateRemainingInstallments = () => {
    const total = parseInt(formData.totalInstallments) || 0;
    const paid = parseInt(formData.paidInstallments) || 0;
    const remaining = total - paid;
    return remaining.toString();
  };

  // Calcular total a pagar parcelado automaticamente
  const calculateTotalToPay = () => {
    const remaining = parseInt(formData.remainingInstallments) || 0;
    const installmentValue = parseFloat(formData.installmentValue) || 0;
    const total = remaining * installmentValue;
    return total.toFixed(2);
  };

  // Calcular taxa de juros usando a fórmula
  const calculateInterestRate = () => {
    const financedAmount = parseFloat(formData.financedAmount) || 0;
    const installmentValue = parseFloat(formData.installmentValue) || 0;
    const totalInstallments = parseInt(formData.totalInstallments) || 0;

    if (financedAmount > 0 && installmentValue > 0 && totalInstallments > 0) {
      const totalPayment = installmentValue * totalInstallments;
      const rate = Math.pow(totalPayment / financedAmount, 1.0 / totalInstallments) - 1;
      // Retorna a taxa mensal em percentual
      return (rate * 100).toFixed(4);
    }
    return '';
  };

  // Atualizar campos calculados quando necessário
  React.useEffect(() => {
    if (formData.totalInstallments && formData.paidInstallments) {
      const newRemaining = calculateRemainingInstallments();
      if (newRemaining !== formData.remainingInstallments) {
        onInputChange('remainingInstallments', newRemaining);
      }
    }
  }, [formData.totalInstallments, formData.paidInstallments]);

  React.useEffect(() => {
    if (formData.remainingInstallments && formData.installmentValue) {
      const newTotal = calculateTotalToPay();
      if (newTotal !== formData.totalToPay) {
        onInputChange('totalToPay', newTotal);
      }
    }
  }, [formData.remainingInstallments, formData.installmentValue]);

  // Calcular taxa de juros automaticamente
  React.useEffect(() => {
    if (formData.financedAmount && formData.installmentValue && formData.totalInstallments) {
      const newRate = calculateInterestRate();
      if (newRate !== formData.interestRate && newRate !== '') {
        onInputChange('interestRate', newRate);
      }
    }
  }, [formData.financedAmount, formData.installmentValue, formData.totalInstallments]);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Informações de Financiamento
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Financiamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="financingBank">Nome da Financeira</Label>
                <Select value={formData.financingBank} onValueChange={(value) => onInputChange('financingBank', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a financeira" />
                  </SelectTrigger>
                  <SelectContent>
                    {financingBanks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.financingBank === 'outra' && (
                  <div className="mt-2">
                    <Label htmlFor="customFinancingBank">Nome da Financeira</Label>
                    <Input 
                      id="customFinancingBank"
                      value={formData.customFinancingBank} 
                      onChange={(e) => onInputChange('customFinancingBank', e.target.value)} 
                      placeholder="Digite o nome da financeira"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Comprou Direto ou Assumiu Financiamento?</Label>
                <RadioGroup 
                  value={formData.financingType} 
                  onValueChange={(value) => onInputChange('financingType', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comprou-direto" id="comprou-direto" />
                    <Label htmlFor="comprou-direto">Comprou Direto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assumiu-financiamento" id="assumiu-financiamento" />
                    <Label htmlFor="assumiu-financiamento">Assumiu Financiamento</Label>
                  </div>
                </RadioGroup>
                
                {formData.financingType === 'assumiu-financiamento' && (
                  <div className="mt-2">
                    <Label htmlFor="originalFinancedName">Nome do Financiado Original</Label>
                    <Input 
                      id="originalFinancedName"
                      value={formData.originalFinancedName} 
                      onChange={(e) => onInputChange('originalFinancedName', e.target.value)} 
                      placeholder="Digite o nome do financiado original"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="purchaseDate">Data da Compra</Label>
                <Input 
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate} 
                  onChange={(e) => onInputChange('purchaseDate', e.target.value)} 
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Dia de Vencimento (1-30)</Label>
                <Input 
                  id="dueDate"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.dueDate} 
                  onChange={(e) => onInputChange('dueDate', e.target.value)} 
                  placeholder="Ex: 15"
                />
              </div>

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

              <div>
                <Label htmlFor="interestRate">Taxa de Juros (% mensal)</Label>
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
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FinancingInfoForm;
