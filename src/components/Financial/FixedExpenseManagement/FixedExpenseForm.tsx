
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { format } from 'date-fns';

interface FixedExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FixedExpenseForm: React.FC<FixedExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
  const { createExpense, updateExpense } = useExpenses();
  const { categories } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category_id: expense?.category_id || '',
    type: expense?.type || 'fixa' as const,
    due_date: expense?.due_date || format(new Date(), 'yyyy-MM-dd'),
    is_paid: expense?.is_paid || false,
    notes: expense?.notes || '',
    is_recurring: true,
    recurring_interval: expense?.recurring_interval || 1,
    recurring_start_date: expense?.recurring_start_date || format(new Date(), 'yyyy-MM-dd'),
    recurring_end_date: expense?.recurring_end_date || '',
    is_active_recurring: expense?.is_active_recurring ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const expenseCategories = categories.filter(cat => cat.type === 'despesa');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        date: formData.due_date,
        recurring_end_date: formData.recurring_end_date || null,
      };

      if (expense) {
        await updateExpense(expense.id, dataToSubmit);
      } else {
        await createExpense(dataToSubmit);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving fixed expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa'}</CardTitle>
      </CardHeader>
      <CardContent>
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

            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento (Primeiro Mês)</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring_interval">Intervalo (em meses)</Label>
              <Select
                value={formData.recurring_interval.toString()}
                onValueChange={(value) => handleInputChange('recurring_interval', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Todo mês</SelectItem>
                  <SelectItem value="2">A cada 2 meses</SelectItem>
                  <SelectItem value="3">A cada 3 meses (Trimestral)</SelectItem>
                  <SelectItem value="6">A cada 6 meses (Semestral)</SelectItem>
                  <SelectItem value="12">A cada 12 meses (Anual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring_start_date">Data de Início da Recorrência</Label>
              <Input
                id="recurring_start_date"
                type="date"
                value={formData.recurring_start_date}
                onChange={(e) => handleInputChange('recurring_start_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring_end_date">Data de Fim da Recorrência (Opcional)</Label>
              <Input
                id="recurring_end_date"
                type="date"
                value={formData.recurring_end_date}
                onChange={(e) => handleInputChange('recurring_end_date', e.target.value)}
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
              <Label htmlFor="is_paid">Primeiro mês já está pago</Label>
            </div>
          </div>

          {expense && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active_recurring"
                  checked={formData.is_active_recurring}
                  onCheckedChange={(checked) => handleInputChange('is_active_recurring', checked)}
                />
                <Label htmlFor="is_active_recurring">Recorrência ativa</Label>
              </div>
            </div>
          )}

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

export default FixedExpenseForm;
