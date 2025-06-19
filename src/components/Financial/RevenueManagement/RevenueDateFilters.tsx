
import React from 'react';
import { Button } from '@/components/ui/button';
import { type DateFilterType, getFilterButtonLabel } from './dateFilterUtils';

interface RevenueDateFiltersProps {
  selectedFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

const RevenueDateFilters: React.FC<RevenueDateFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters: DateFilterType[] = ['today', 'week', 'fortnight', 'month', 'year', 'all'];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={selectedFilter === filter ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className="text-xs"
        >
          {getFilterButtonLabel(filter)}
        </Button>
      ))}
    </div>
  );
};

export default RevenueDateFilters;
export type { DateFilterType };
