
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { revenueSortOptions, RevenueSortField, SortOrder } from './RevenueSortingUtils';

interface RevenueSortSelectorProps {
  selectedSortField: RevenueSortField;
  selectedSortOrder: SortOrder;
  onSortChange: (field: RevenueSortField, order: SortOrder) => void;
}

const RevenueSortSelector: React.FC<RevenueSortSelectorProps> = ({
  selectedSortField,
  selectedSortOrder,
  onSortChange,
}) => {
  const selectedOption = revenueSortOptions.find(
    option => option.field === selectedSortField && option.order === selectedSortOrder
  );

  const handleValueChange = (value: string) => {
    const option = revenueSortOptions.find((_, index) => index.toString() === value);
    if (option) {
      onSortChange(option.field, option.order);
    }
  };

  return (
    <Select 
      value={revenueSortOptions.findIndex(option => 
        option.field === selectedSortField && option.order === selectedSortOrder
      ).toString()} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-48 h-8 text-xs">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3 w-3" />
          <SelectValue placeholder="Ordenar por..." />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {revenueSortOptions.map((option, index) => (
          <SelectItem key={index} value={index.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RevenueSortSelector;
