
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

interface ExpenseCompactViewProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onReplicate: (expense: Expense) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
  canReplicate: (expense: Expense) => boolean;
}

const ExpenseCompactView: React.FC<ExpenseCompactViewProps> = ({
  expenses,
  onEdit,
  onReplicate,
  onDelete,
  formatCurrency,
  getTypeColor,
  canReplicate,
}) => {
  return (
    <div className="grid gap-2">
      {expenses.map((expense) => (
        <Card key={expense.id} className="text-xs">
          <CardContent className="p-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-xs truncate">{expense.description}</h3>
                  <Badge className={`${getTypeColor(expense.type)} text-xs px-1 py-0`}>
                    {expense.type.charAt(0).toUpperCase()}
                  </Badge>
                  {expense.is_paid && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(expense.due_date), 'dd/MM', { locale: ptBR })} • 
                  {expense.category ? ` ${expense.category.name}` : ' Sem categoria'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-red-600">
                  {formatCurrency(expense.amount)}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-2.5 w-2.5" />
                  </Button>
                  
                  {canReplicate(expense) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onReplicate(expense)}
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
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

export default ExpenseCompactView;
