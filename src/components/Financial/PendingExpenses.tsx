
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingExpensesProps {
  onEdit: (expense: any) => void;
  onDelete: (id: string) => void;
}

const PendingExpenses: React.FC<PendingExpensesProps> = ({ onEdit, onDelete }) => {
  const { expenses, updateExpense } = useExpenses();

  const pendingExpenses = expenses.filter(expense => !expense.is_paid);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleMarkAsPaid = async (expense: any) => {
    try {
      await updateExpense(expense.id, { is_paid: true });
    } catch (error) {
      console.error('Error marking expense as paid:', error);
    }
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

  if (pendingExpenses.length === 0) {
    return (
      <Card className="text-sm">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">Nenhuma despesa pendente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {pendingExpenses.map((expense) => (
        <Card key={expense.id} className="text-sm">
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{expense.description}</h3>
                  <Badge className={`${getTypeColor(expense.type)} text-xs px-1.5 py-0.5`}>
                    {expense.type}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Vencimento: {format(new Date(expense.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  {expense.category && <p>Categoria: {expense.category.name}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleMarkAsPaid(expense)}
                    title="Marcar como pago"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingExpenses;
