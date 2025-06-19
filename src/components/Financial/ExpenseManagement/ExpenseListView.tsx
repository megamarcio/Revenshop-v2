
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Expense {
  id: string;
  description: string;
  amount: number;
  type: 'fixa' | 'variavel' | 'sazonal' | 'investimento';
  date?: string;
  due_date: string;
  is_paid: boolean;
  notes?: string;
  category?: {
    name: string;
    type: string;
  };
}

interface ExpenseListViewProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onReplicate: (expense: Expense) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
  canReplicate: (expense: Expense) => boolean;
}

const ExpenseListView: React.FC<ExpenseListViewProps> = ({
  expenses,
  onEdit,
  onReplicate,
  onDelete,
  formatCurrency,
  getTypeColor,
  canReplicate,
}) => {
  return (
    <div className="grid gap-3">
      {expenses.map((expense) => (
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
                  <p>Vencimento: {format(new Date(expense.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
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
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  {canReplicate(expense) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onReplicate(expense)}
                      title={`Replicar ${expense.type === 'fixa' ? 'despesa fixa' : 'investimento'} para próximos meses`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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

export default ExpenseListView;
