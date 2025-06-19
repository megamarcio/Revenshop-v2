
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { DateFilterType } from './dateFilterUtils';

interface RevenueDateFiltersProps {
  selectedFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

const RevenueDateFilters: React.FC<RevenueDateFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = [
    { key: 'day' as DateFilterType, label: 'Hoje' },
    { key: 'week' as DateFilterType, label: 'Semana' },
    { key: 'biweekly' as DateFilterType, label: 'Quinzena' },
    { key: 'month' as DateFilterType, label: 'Mês' },
    { key: 'year' as DateFilterType, label: 'Ano' },
    { key: 'all' as DateFilterType, label: 'Total' },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
      <Filter className="h-3 w-3 text-muted-foreground mx-1" />
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={selectedFilter === filter.key ? "default" : "ghost"}
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default RevenueDateFilters;
