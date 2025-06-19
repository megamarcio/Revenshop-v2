
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff, List, Grid } from 'lucide-react';

interface ExpenseManagementHeaderProps {
  showPaid: boolean;
  viewMode: 'list' | 'compact';
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
  return (
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
          {viewMode === 'list' ? <List className="h-3 w-3 mr-1" /> : <Grid className="h-3 w-3 mr-1" />}
          {viewMode === 'list' ? 'Compacto' : 'Lista'}
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
  );
};

export default ExpenseManagementHeader;
