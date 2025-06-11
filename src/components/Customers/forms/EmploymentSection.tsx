
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EmploymentSectionProps {
  formData: {
    monthly_income: number;
    current_job: string;
    employer_name: string;
    employer_phone: string;
    employment_duration: string;
  };
  onInputChange: (field: string, value: string | number) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const EmploymentSection = ({ formData, onInputChange, isOpen, onToggle }: EmploymentSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="font-semibold text-lg">Informações de Emprego e Renda</span>
          <span>{isOpen ? '−' : '+'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monthly_income">Rendimento Mensal (R$)</Label>
            <Input
              id="monthly_income"
              type="number"
              value={formData.monthly_income}
              onChange={(e) => onInputChange('monthly_income', Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="current_job">Emprego Atual</Label>
            <Input
              id="current_job"
              value={formData.current_job}
              onChange={(e) => onInputChange('current_job', e.target.value)}
              placeholder="Ex: Vendedor, Motorista, etc."
            />
          </div>
          <div>
            <Label htmlFor="employer_name">Nome do Empregador</Label>
            <Input
              id="employer_name"
              value={formData.employer_name}
              onChange={(e) => onInputChange('employer_name', e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
          <div>
            <Label htmlFor="employer_phone">Telefone do Empregador</Label>
            <Input
              id="employer_phone"
              value={formData.employer_phone}
              onChange={(e) => onInputChange('employer_phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="employment_duration">Há quanto tempo trabalha no local?</Label>
            <Input
              id="employment_duration"
              value={formData.employment_duration}
              onChange={(e) => onInputChange('employment_duration', e.target.value)}
              placeholder="Ex: 2 anos, 6 meses, etc."
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
