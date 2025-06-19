
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff, List, Grid, Minus } from 'lucide-react';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

interface ExpenseManagementHeaderProps {
  showPaid: boolean;
  viewMode: ViewMode;
  onToggleShowPaid: () => void;
  onToggleViewMode: () => void;
  onNewExpense: () => void;
}

const ExpenseManagementHeader: React.FC<ExpenseManagementHeaderProps> = ({
  showPaid,
  viewMode,
  onToggleShowPaid,
  onToggleViewMode,
  onNewExpense,
}) => {
  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'list':
        return <List className="h-3 w-3 mr-1" />;
      case 'compact':
        return <Grid className="h-3 w-3 mr-1" />;
      case 'ultra-compact':
        return <Minus className="h-3 w-3 mr-1" />;
      default:
        return <List className="h-3 w-3 mr-1" />;
    }
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'list':
        return 'Compacto';
      case 'compact':
        return 'Ultra';
      case 'ultra-compact':
        return 'Lista';
      default:
        return 'Compacto';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold">Despesas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas despesas e obrigações</p>
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
            onClick={onToggleShowPaid}
          >
            {showPaid ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showPaid ? 'Ocultar Pagas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={onNewExpense} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Nova Despesa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagementHeader;
