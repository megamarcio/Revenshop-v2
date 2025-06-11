
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TitleStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const titleStatusOptions = [
  { value: 'em-maos', label: 'Em Mãos' },
  { value: 'financiado-proprio', label: 'Financiado Próprio nome' },
  { value: 'financiado-terceiro', label: 'Financiado Nome Terceiro' },
  { value: 'leilao-aguardando', label: 'Leilão - Aguardando' },
  { value: 'junk', label: 'Junk' },
  { value: 'sem-titulo', label: 'Sem Título' },
];

const TitleStatusSelector = ({ value, onChange, error }: TitleStatusSelectorProps) => {
  return (
    <div>
      <Label htmlFor="titleStatus">Status do Título</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Selecione o status do título" />
        </SelectTrigger>
        <SelectContent>
          {titleStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default TitleStatusSelector;
