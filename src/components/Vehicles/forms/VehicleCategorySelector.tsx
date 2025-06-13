
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface VehicleCategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const categoryOptions = [
  { value: 'forSale', label: 'À Venda', description: 'Veículo disponível para venda' },
  { value: 'sold', label: 'Vendido', description: 'Veículo já foi vendido' }
];

const VehicleCategorySelector = ({ value, onChange, error }: VehicleCategorySelectorProps) => {
  console.log('VehicleCategorySelector - current value:', value);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Status do Veículo *</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Selecione o status atual do veículo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={value} onValueChange={(newValue) => {
        console.log('VehicleCategorySelector - onChange:', newValue);
        onChange(newValue);
      }}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Selecione o status" />
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
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default VehicleCategorySelector;
