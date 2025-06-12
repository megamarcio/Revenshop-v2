
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface VehicleCategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  consignmentStore?: string;
  onConsignmentStoreChange?: (value: string) => void;
  error?: string;
}

const categoryOptions = [
  { value: 'forSale', label: 'À Venda', description: 'Veículo disponível para venda' },
  { value: 'sold', label: 'Vendido', description: 'Veículo já foi vendido' },
  { value: 'consigned', label: 'Consignado', description: 'Veículo em consignação' },
  { value: 'rental', label: 'Aluguel', description: 'Veículo para locação' },
  { value: 'maintenance', label: 'Manutenção', description: 'Veículo em manutenção' }
];

const VehicleCategorySelector = ({ 
  value, 
  onChange, 
  consignmentStore, 
  onConsignmentStoreChange, 
  error 
}: VehicleCategorySelectorProps) => {
  console.log('VehicleCategorySelector - current value:', value);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Categoria do Veículo *</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Selecione a categoria atual do veículo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={value} onValueChange={(newValue) => {
        console.log('VehicleCategorySelector - onChange:', newValue);
        onChange(newValue);
      }}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <TooltipProvider key={option.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value={option.value}>
                    {option.label}
                  </SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>{option.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </SelectContent>
      </Select>
      
      {/* Campo de loja de consignação aparece apenas quando categoria é 'consigned' */}
      {value === 'consigned' && (
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-600">Loja de Consignação</label>
          <Input
            type="text"
            value={consignmentStore || ''}
            onChange={(e) => onConsignmentStoreChange?.(e.target.value)}
            placeholder="Nome da loja onde está consignado"
            className="mt-1"
          />
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default VehicleCategorySelector;
