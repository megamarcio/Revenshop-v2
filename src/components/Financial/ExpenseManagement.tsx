
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from './ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExpenseManagement = () => {
  const { expenses, deleteExpense, refetch } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Despesas</h2>
          <p className="text-muted-foreground">Gerencie suas despesas e obrigações</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPaid(!showPaid)}
          >
            {showPaid ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPaid ? 'Ocultar Pagas' : 'Mostrar Todas'}
          </Button>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{expense.description}</h3>
                    <Badge className={getTypeColor(expense.type)}>
                      {expense.type}
                    </Badge>
                    {expense.is_paid && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Pago
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Data: {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {expense.due_date && (
                      <p>Vencimento: {format(new Date(expense.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    )}
                    {expense.category && <p>Categoria: {expense.category.name}</p>}
                    {expense.notes && <p>Obs: {expense.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma despesa encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
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
    </div>
  );
};

export default ExpenseManagement;
