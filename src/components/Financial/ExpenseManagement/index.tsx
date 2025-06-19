
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

type ViewMode = 'list' | 'compact' | 'ultra-compact';

const ExpenseManagement = () => {
  const { expenses, deleteExpense, refetch } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [expenseToReplicate, setExpenseToReplicate] = useState(null);
  const [showPaid, setShowPaid] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { formatCurrency, getTypeColor, canReplicate } = useExpenseManagementUtils();

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => 
      showPaid ? true : !expense.is_paid
    );
  }, [expenses, showPaid]);

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
        onToggleShowPaid={handleToggleShowPaid}
        onToggleViewMode={handleToggleViewMode}
        onNewExpense={handleNewExpense}
      />

      <div className="text-center text-sm text-muted-foreground">
        {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'} {showPaid ? 'total' : 'não pagas'}
      </div>

      {renderExpenseView()}

      {filteredExpenses.length === 0 && (
        <Card className="text-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {showPaid ? 'Nenhuma despesa encontrada' : 'Nenhuma despesa pendente encontrada'}
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
