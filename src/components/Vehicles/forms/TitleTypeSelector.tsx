
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useTitleTypes } from '@/hooks/useTitleTypes';

interface TitleTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TitleTypeSelector = ({ value, onChange, error }: TitleTypeSelectorProps) => {
  const { titleTypes, loading } = useTitleTypes();

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Título</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Selecione o tipo de título do veículo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Selecione o tipo de título" />
        </SelectTrigger>
        <SelectContent>
          {titleTypes.map((titleType) => (
            <TooltipProvider key={titleType.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectItem value={titleType.id}>
                    {titleType.name}
                  </SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>{titleType.description}</p>
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

export default TitleTypeSelector;
