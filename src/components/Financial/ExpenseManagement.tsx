
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from './ExpenseForm';
import ReplicateExpenseModal from './ReplicateExpenseModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExpenseManagement = () => {
  const { expenses, deleteExpense, refetch } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [expenseToReplicate, setExpenseToReplicate] = useState(null);
  const [showPaid, setShowPaid] = useState(true);

  const filteredExpenses = expenses.filter(expense => 
    showPaid ? true : !expense.is_paid
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixa': return 'bg-red-100 text-red-800';
      case 'variavel': return 'bg-blue-100 text-blue-800';
      case 'sazonal': return 'bg-yellow-100 text-yellow-800';
      case 'investimento': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold">Despesas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas despesas e obrigações</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPaid(!showPaid)}
          >
            {showPaid ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showPaid ? 'Ocultar Pagas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Nova Despesa
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="text-sm">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-medium text-sm">{expense.description}</h3>
                    <Badge className={`${getTypeColor(expense.type)} text-xs px-1.5 py-0.5`}>
                      {expense.type}
                    </Badge>
                    {expense.is_paid && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                        Pago
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Data: {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {expense.due_date && (
                      <p>Vencimento: {format(new Date(expense.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    )}
                    {expense.category && <p>Categoria: {expense.category.name}</p>}
                    {expense.notes && <p>Obs: {expense.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-bold text-red-600">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    {expense.type === 'fixa' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleReplicate(expense)}
                        title="Replicar para próximos meses"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExpenses.length === 0 && (
          <Card className="text-sm">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhuma despesa encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>

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
