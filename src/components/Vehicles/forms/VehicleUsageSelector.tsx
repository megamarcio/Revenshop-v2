
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleUsageSelectorProps {
  usage: string;
  consignmentStore?: string;
  onUsageChange: (usage: string) => void;
  onConsignmentStoreChange: (store: string) => void;
  error?: string;
}

const usageOptions = [
  { value: 'rental', label: 'Aluguel' },
  { value: 'personal', label: 'Uso próprio' },
  { value: 'sale', label: 'Venda' },
  { value: 'consigned', label: 'Consignado' }
];

const VehicleUsageSelector = ({ 
  usage, 
  consignmentStore = '', 
  onUsageChange, 
  onConsignmentStoreChange, 
  error 
}: VehicleUsageSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Uso do Veículo *</Label>
        
        <Select value={usage} onValueChange={onUsageChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o uso do veículo" />
          </SelectTrigger>
          <SelectContent>
            {usageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {usage === 'consigned' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nome da Loja de Consignação</Label>
          <Input
            value={consignmentStore}
            onChange={(e) => onConsignmentStoreChange(e.target.value)}
            placeholder="Digite o nome da loja"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default VehicleUsageSelector;
