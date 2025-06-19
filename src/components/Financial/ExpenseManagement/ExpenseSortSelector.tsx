
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { expenseSortOptions, ExpenseSortField, SortOrder } from './ExpenseSortingUtils';

interface ExpenseSortSelectorProps {
  selectedSortField: ExpenseSortField;
  selectedSortOrder: SortOrder;
  onSortChange: (field: ExpenseSortField, order: SortOrder) => void;
}

const ExpenseSortSelector: React.FC<ExpenseSortSelectorProps> = ({
  selectedSortField,
  selectedSortOrder,
  onSortChange,
}) => {
  const selectedOption = expenseSortOptions.find(
    option => option.field === selectedSortField && option.order === selectedSortOrder
  );

  const handleValueChange = (value: string) => {
    const option = expenseSortOptions.find((_, index) => index.toString() === value);
    if (option) {
      onSortChange(option.field, option.order);
    }
  };

  return (
    <Select 
      value={expenseSortOptions.findIndex(option => 
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
        {expenseSortOptions.map((option, index) => (
          <SelectItem key={index} value={index.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ExpenseSortSelector;
