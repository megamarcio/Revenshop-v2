import React, { useState, useEffect, useRef } from 'react';
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

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
  const { createExpense, updateExpense } = useExpenses();
  const { categories, createCategory } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category_id: expense?.category_id || '',
    type: expense?.type || 'variavel' as const,
    date: expense?.date || format(new Date(), 'yyyy-MM-dd'),
    is_paid: expense?.is_paid || false,
    due_date: expense?.due_date || '',
    notes: expense?.notes || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const categoryCreationAttempted = useRef(false);

  // Create "Parcela Carro" category if it doesn't exist - only once
  useEffect(() => {
    const createCarInstallmentCategory = async () => {
      // Prevent multiple attempts
      if (categoryCreationAttempted.current) return;
      
      // Only try to create if we have categories loaded
      if (categories.length === 0) return;
      
      // Check if category already exists
      const carCategory = categories.find(cat => cat.name === 'Parcela Carro' && cat.type === 'despesa');
      if (carCategory) {
        categoryCreationAttempted.current = true;
        return;
      }
      
      try {
        categoryCreationAttempted.current = true;
        await createCategory({
          name: 'Parcela Carro',
          type: 'despesa',
          is_default: true,
        });
      } catch (error) {
        console.error('Error creating Parcela Carro category:', error);
        // Reset the flag on error so it can be retried
        categoryCreationAttempted.current = false;
      }
    };

    createCarInstallmentCategory();
  }, [categories, createCategory]);

  const expenseCategories = categories.filter(cat => cat.type === 'despesa');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        due_date: formData.due_date || null,
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
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
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
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
