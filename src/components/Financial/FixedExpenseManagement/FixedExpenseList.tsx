
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useExpenses } from '@/hooks/useExpenses';

interface Expense {
  id: string;
  description: string;
  amount: number;
  type: string;
  due_date: string;
  is_paid: boolean;
  notes?: string;
  is_recurring: boolean;
  recurring_interval?: number;
  recurring_start_date?: string;
  recurring_end_date?: string;
  is_active_recurring: boolean;
  category?: {
    name: string;
    type: string;
  };
}

interface FixedExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
  showActions: boolean;
}

const FixedExpenseList: React.FC<FixedExpenseListProps> = ({
  expenses,
  onEdit,
  formatCurrency,
  getTypeColor,
  showActions,
}) => {
  const { cancelRecurring } = useExpenses();

  const handleCancelRecurring = async (expense: Expense) => {
    if (confirm('Tem certeza que deseja cancelar esta despesa fixa? Isso impedirá a geração automática de novas despesas.')) {
      await cancelRecurring(expense.id);
    }
  };

  const getIntervalText = (interval?: number) => {
    if (!interval) return 'Mensal';
    switch (interval) {
      case 1: return 'Mensal';
      case 2: return 'Bimestral';
      case 3: return 'Trimestral';
      case 6: return 'Semestral';
      case 12: return 'Anual';
      default: return `A cada ${interval} meses`;
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma despesa fixa encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id} className={`border-l-4 ${expense.is_active_recurring ? 'border-l-blue-400' : 'border-l-gray-400'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{expense.description}</h3>
                  <Badge className={getTypeColor(expense.type)}>
                    {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                  </Badge>
                  {expense.is_active_recurring ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Cancelada
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-lg text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                  <span>{getIntervalText(expense.recurring_interval)}</span>
                  {expense.category && (
                    <span>• {expense.category.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Início: {format(new Date(expense.recurring_start_date || expense.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  {expense.recurring_end_date && (
                    <span>
                      Fim: {format(new Date(expense.recurring_end_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  )}
                  {!expense.recurring_end_date && expense.is_active_recurring && (
                    <span className="text-green-600">• Sem data de fim (infinita)</span>
                  )}
                </div>

                {expense.notes && (
                  <p className="text-sm text-muted-foreground">{expense.notes}</p>
                )}
              </div>

              {showActions && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {expense.is_active_recurring && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleCancelRecurring(expense)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FixedExpenseList;
