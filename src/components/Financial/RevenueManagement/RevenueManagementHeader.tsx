import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff, List, LayoutGrid, Minus } from 'lucide-react';
import RevenueDateFilters from './RevenueDateFilters';
import { DateFilterType } from './dateFilterUtils';

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
  const getViewModeIcon = () => {
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

  const getViewModeLabel = () => {
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
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold">Receitas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas receitas e previsões</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleViewMode}
          >
            {getViewModeIcon()}
            {getViewModeLabel()}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleShowConfirmed}
          >
            {showConfirmed ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showConfirmed ? 'Ocultar Confirmadas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={onNewRevenue} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Nova Receita
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <RevenueDateFilters
          selectedFilter={dateFilter}
          onFilterChange={onDateFilterChange}
        />
      </div>
    </div>
  );
};

export default RevenueManagementHeader;
