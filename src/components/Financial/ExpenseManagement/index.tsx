import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from '../ExpenseForm';
import ReplicateExpenseModal from '../ReplicateExpenseModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ExpenseManagementHeader from './ExpenseManagementHeader';
import ExpenseListView from './ExpenseListView';
import ExpenseCompactView from './ExpenseCompactView';
import ExpenseUltraCompactView from './ExpenseUltraCompactView';
import { useExpenseManagementUtils } from './useExpenseManagementUtils';
import { DateFilterType, getDateRangeForFilter, filterExpensesByDateRange, getFilterLabel } from './dateFilterUtils';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

const ExpenseManagement = () => {
  const { expenses, deleteExpense, refetch } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [expenseToReplicate, setExpenseToReplicate] = useState(null);
  const [showPaid, setShowPaid] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');

  const { formatCurrency, getTypeColor, canReplicate } = useExpenseManagementUtils();

  const filteredExpenses = useMemo(() => {
    // Primeiro aplica o filtro de pagamento
    let filtered = expenses.filter(expense => 
      showPaid ? true : !expense.is_paid
    );

    // Depois aplica o filtro de data com a nova lógica
    const dateRange = getDateRangeForFilter(dateFilter);
    filtered = filterExpensesByDateRange(filtered, dateRange, dateFilter);

    console.log('Filtros aplicados:', {
      totalExpenses: expenses.length,
      afterPaymentFilter: expenses.filter(expense => showPaid ? true : !expense.is_paid).length,
      afterDateFilter: filtered.length,
      dateFilter,
      dateRange,
      sampleDates: expenses.slice(0, 3).map(e => ({ id: e.id, due_date: e.due_date }))
    });

    return filtered;
  }, [expenses, showPaid, dateFilter]);

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleReplicate = (expense: any) => {
    setExpenseToReplicate(expense);
    setIsReplicateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteExpense(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
    refetch();
  };

  const handleReplicateSuccess = () => {
    setIsReplicateOpen(false);
    setExpenseToReplicate(null);
    refetch();
  };

  const handleNewExpense = () => setIsFormOpen(true);
  const handleToggleShowPaid = () => setShowPaid(!showPaid);
  
  const handleToggleViewMode = () => {
    setViewMode(current => {
      switch (current) {
        case 'list':
          return 'compact';
        case 'compact':
          return 'ultra-compact';
        case 'ultra-compact':
          return 'list';
        default:
          return 'list';
      }
    });
  };

  const handleDateFilterChange = (filter: DateFilterType) => {
    setDateFilter(filter);
  };

  const renderExpenseView = () => {
    const commonProps = {
      expenses: filteredExpenses,
      onEdit: handleEdit,
      onReplicate: handleReplicate,
      onDelete: handleDelete,
      formatCurrency,
      getTypeColor,
      canReplicate,
    };

    switch (viewMode) {
      case 'list':
        return <ExpenseListView {...commonProps} />;
      case 'compact':
        return <ExpenseCompactView {...commonProps} />;
      case 'ultra-compact':
        return <ExpenseUltraCompactView {...commonProps} />;
      default:
        return <ExpenseListView {...commonProps} />;
    }
  };

  return (
    <div className="space-y-4">
      <ExpenseManagementHeader
        showPaid={showPaid}
        viewMode={viewMode}
        dateFilter={dateFilter}
        onToggleShowPaid={handleToggleShowPaid}
        onToggleViewMode={handleToggleViewMode}
        onDateFilterChange={handleDateFilterChange}
        onNewExpense={handleNewExpense}
      />

      <div className="text-center text-sm text-muted-foreground">
        {dateFilter !== 'all' && (
          <div>{getFilterLabel(dateFilter)}</div>
        )}
        {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'} {showPaid ? 'encontradas' : 'não pagas'}
      </div>

      {renderExpenseView()}

      {filteredExpenses.length === 0 && (
        <Card className="text-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {dateFilter === 'all' 
                ? (showPaid ? 'Nenhuma despesa encontrada' : 'Nenhuma despesa pendente encontrada')
                : 'Nenhuma despesa encontrada para o período selecionado'
              }
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedExpense ? 'Editar Despesa' : 'Nova Despesa'}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={selectedExpense}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedExpense(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <ReplicateExpenseModal
        expense={expenseToReplicate}
        open={isReplicateOpen}
        onOpenChange={setIsReplicateOpen}
        onSuccess={handleReplicateSuccess}
      />
    </div>
  );
};

export default ExpenseManagement;
