
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VehicleFormData } from '../../types/vehicleFormTypes';
import { financingBanks } from './constants';

interface BasicInfoSectionProps {
  formData: VehicleFormData;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
}

const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  return (
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
    </div>
  );
};

export default BasicInfoSection;
