
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TitleStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const titleStatusOptions = [
  { value: 'clean-title-financiado-proprio', label: 'Clean Title - financiado Próprio nome' },
  { value: 'clean-title-financiado-terceiro', label: 'Clean Title - financiado nome terceiro' },
  { value: 'clean-title-leilao-aguardando', label: 'Clean Title - Leilão - Aguardando' },
  { value: 'rebuilt-leilao-aguardando', label: 'Rebuilt - Leilão - Aguardando' },
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
