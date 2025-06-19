
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { format } from 'date-fns';
import { Calendar, Repeat } from 'lucide-react';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
  const { createExpense, updateExpense, cancelRecurring } = useExpenses();
  const { categories } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category_id: expense?.category_id || '',
    type: expense?.type || 'variavel' as const,
    due_date: expense?.due_date || format(new Date(), 'yyyy-MM-dd'),
    is_paid: expense?.is_paid || false,
    notes: expense?.notes || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const expenseCategories = categories.filter(cat => cat.type === 'despesa');
  const isGeneratedExpense = expense?.parent_expense_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        date: formData.due_date,
        is_recurring: false,
        is_active_recurring: false,
      };

      if (expense) {
        await updateExpense(expense.id, dataToSubmit);
      } else {
        await createExpense(dataToSubmit);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRecurring = async () => {
    if (!expense?.parent_expense_id) return;
    
    if (confirm('Deseja cancelar a recorrência desta despesa fixa? Isso impedirá a geração de novas despesas.')) {
      await cancelRecurring(expense.parent_expense_id);
      onSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {expense ? 'Editar Despesa' : 'Nova Despesa'}
          {isGeneratedExpense && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Repeat className="h-3 w-3 mr-1" />
              Gerada Automaticamente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGeneratedExpense && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Calendar className="h-4 w-4" />
              <span>Esta despesa foi gerada automaticamente a partir de uma despesa fixa.</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-700"
              onClick={handleCancelRecurring}
            >
              Cancelar Recorrência
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleInputChange('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                  <SelectItem value="sazonal">Sazonal</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_paid"
                checked={formData.is_paid}
                onCheckedChange={(checked) => handleInputChange('is_paid', checked)}
              />
              <Label htmlFor="is_paid">Pago</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : expense ? 'Atualizar' : 'Criar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
