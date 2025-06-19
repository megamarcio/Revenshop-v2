
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import FixedExpenseForm from './FixedExpenseForm';
import FixedExpenseList from './FixedExpenseList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const FixedExpenseManagement = () => {
  const { expenses, refetch } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fixedExpenses = useMemo(() => {
    return expenses.filter(expense => expense.is_recurring && !expense.parent_expense_id);
  }, [expenses]);

  const activeFixedExpenses = useMemo(() => {
    return fixedExpenses.filter(expense => expense.is_active_recurring);
  }, [fixedExpenses]);

  const inactiveFixedExpenses = useMemo(() => {
    return fixedExpenses.filter(expense => !expense.is_active_recurring);
  }, [fixedExpenses]);

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
    refetch();
  };

  const handleNewFixedExpense = () => {
    setSelectedExpense(null);
    setIsFormOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'fixa': 'bg-blue-100 text-blue-800',
      'variavel': 'bg-green-100 text-green-800',
      'sazonal': 'bg-yellow-100 text-yellow-800',
      'investimento': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Despesas Fixas</h1>
          <p className="text-muted-foreground">
            Gerencie despesas que se repetem automaticamente todos os meses
          </p>
        </div>
        <Button onClick={handleNewFixedExpense}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa Fixa
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Ativas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFixedExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Sendo geradas automaticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Mensal Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                activeFixedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de despesas fixas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveFixedExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Despesas fixas canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Fixed Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas Fixas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <FixedExpenseList
            expenses={activeFixedExpenses}
            onEdit={handleEdit}
            formatCurrency={formatCurrency}
            getTypeColor={getTypeColor}
            showActions={true}
          />
        </CardContent>
      </Card>

      {/* Inactive Fixed Expenses */}
      {inactiveFixedExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Despesas Fixas Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <FixedExpenseList
              expenses={inactiveFixedExpenses}
              onEdit={handleEdit}
              formatCurrency={formatCurrency}
              getTypeColor={getTypeColor}
              showActions={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa'}
            </DialogTitle>
          </DialogHeader>
          <FixedExpenseForm
            expense={selectedExpense}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedExpense(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixedExpenseManagement;
