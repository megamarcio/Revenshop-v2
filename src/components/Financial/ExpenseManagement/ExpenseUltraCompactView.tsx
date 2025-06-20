
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

interface ExpenseUltraCompactViewProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onReplicate: (expense: Expense) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
  canReplicate: (expense: Expense) => boolean;
}

const ExpenseUltraCompactView: React.FC<ExpenseUltraCompactViewProps> = ({
  expenses,
  onEdit,
  onReplicate,
  onDelete,
  formatCurrency,
  getTypeColor,
  canReplicate,
}) => {
  return (
    <div className="space-y-1">
      {expenses.map((expense) => (
        <Card key={expense.id} className="border-l-2 border-l-red-200">
          <CardContent className="p-1 px-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              {/* Data de Vencimento */}
              <div className="text-muted-foreground min-w-12 text-center">
                {format(new Date(expense.due_date), 'dd/MM', { locale: ptBR })}
              </div>

              {/* Descrição e categoria */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-medium truncate">{expense.description}</span>
                <Badge className={`${getTypeColor(expense.type)} text-xs px-1 py-0 h-4`}>
                  {expense.type.charAt(0).toUpperCase()}
                </Badge>
                {expense.category && (
                  <span className="text-muted-foreground text-xs truncate">
                    {expense.category.name}
                  </span>
                )}
              </div>

              {/* Status e valor */}
              <div className="flex items-center gap-2">
                {expense.is_paid && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1 py-0 h-4">
                    ✓
                  </Badge>
                )}
                <div className="text-xs font-bold text-red-600 min-w-16 text-right">
                  {formatCurrency(expense.amount)}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => onEdit(expense)}
                >
                  <Edit className="h-2 w-2" />
                </Button>
                
                {canReplicate(expense) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => onReplicate(expense)}
                  >
                    <Copy className="h-2 w-2" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseUltraCompactView;
