
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ConditionReportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const crOptions = [
  { value: '10', label: '10' },
  { value: '15', label: '15' },
  { value: '20', label: '20' },
  { value: '25', label: '25' },
  { value: '30', label: '30' },
  { value: '35', label: '35' },
  { value: '40', label: '40' },
  { value: '45', label: '45' },
  { value: '50', label: '50' },
];

const ConditionReportSelector = ({ value, onChange, error }: ConditionReportSelectorProps) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <Label htmlFor="caNote">CR *</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Condition Report (10-50)</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Selecione CR" />
        </SelectTrigger>
        <SelectContent>
          {crOptions.map((option) => (
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

export default ConditionReportSelector;
