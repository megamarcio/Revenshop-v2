
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List, LayoutGrid, Minus } from 'lucide-react';
import RevenueDateFilters, { DateFilterType } from './RevenueDateFilters';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

interface RevenueManagementHeaderProps {
  showConfirmed: boolean;
  viewMode: ViewMode;
  dateFilter: DateFilterType;
  onToggleShowConfirmed: () => void;
  onToggleViewMode: () => void;
  onDateFilterChange: (filter: DateFilterType) => void;
  onNewRevenue: () => void;
}

const RevenueManagementHeader: React.FC<RevenueManagementHeaderProps> = ({
  showConfirmed,
  viewMode,
  dateFilter,
  onToggleShowConfirmed,
  onToggleViewMode,
  onDateFilterChange,
  onNewRevenue,
}) => {
  const getViewIcon = () => {
    switch (viewMode) {
      case 'list':
        return <List className="h-4 w-4" />;
      case 'compact':
        return <LayoutGrid className="h-4 w-4" />;
      case 'ultra-compact':
        return <Minus className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case 'list':
        return 'Lista';
      case 'compact':
        return 'Compacto';
      case 'ultra-compact':
        return 'Ultra-compacto';
      default:
        return 'Lista';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <RevenueDateFilters
          selectedFilter={dateFilter}
          onFilterChange={onDateFilterChange}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowConfirmed}
          className="text-xs"
        >
          {showConfirmed ? 'Todas' : 'Confirmadas'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleViewMode}
          className="flex items-center gap-1 text-xs"
        >
          {getViewIcon()}
          {getViewLabel()}
        </Button>
        
        <Button size="sm" onClick={onNewRevenue}>
          <Plus className="h-4 w-4 mr-1" />
          Nova Receita
        </Button>
      </div>
    </div>
  );
};

export default RevenueManagementHeader;
