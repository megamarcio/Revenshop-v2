
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { toast } from '@/hooks/use-toast';
import { addMonths, format } from 'date-fns';

interface ReplicateExpenseModalProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ReplicateExpenseModal: React.FC<ReplicateExpenseModalProps> = ({
  expense,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [months, setMonths] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { createExpense } = useExpenses();

  const handleReplicate = async () => {
    if (!expense || months < 1) return;

    setIsLoading(true);
    try {
      const promises = [];
      
      for (let i = 1; i <= months; i++) {
        // Usar due_date como referência principal, fallback para date
        const referenceDate = expense.due_date ? new Date(expense.due_date) : new Date(expense.date || expense.due_date);
        const newDueDate = addMonths(referenceDate, i);
        
        const replicatedExpense = {
          description: expense.description,
          amount: expense.amount,
          category_id: expense.category_id,
          type: expense.type,
          due_date: format(newDueDate, 'yyyy-MM-dd'),
          date: format(newDueDate, 'yyyy-MM-dd'), // Manter compatibilidade
          is_paid: false, // Nova despesa sempre não paga
          notes: expense.notes,
          created_by: expense.created_by,
          is_recurring: false,
          is_active_recurring: false,
        };

        promises.push(createExpense(replicatedExpense));
      }

      await Promise.all(promises);
      
      const expenseTypeLabel = expense.type === 'fixa' ? 'despesa fixa' : 
                              expense.type === 'investimento' ? 'investimento' : 'despesa';
      
      toast({
        title: 'Sucesso',
        description: `${expenseTypeLabel.charAt(0).toUpperCase() + expenseTypeLabel.slice(1)} replicada para ${months} ${months === 1 ? 'mês' : 'meses'}`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error replicating expense:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao replicar despesa',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMonths(1);
    onOpenChange(false);
  };

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'fixa': return 'Despesa Fixa';
      case 'investimento': return 'Investimento';
      default: return 'Despesa';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Replicar {expense ? getExpenseTypeLabel(expense.type) : 'Despesa'}
          </DialogTitle>
        </DialogHeader>
        
        {expense && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Despesa:</strong> {expense.description}</p>
              <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'USD',
              }).format(expense.amount)}</p>
              <p><strong>Tipo:</strong> {getExpenseTypeLabel(expense.type)}</p>
              <p><strong>Vencimento:</strong> {format(new Date(expense.due_date), 'dd/MM/yyyy')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="months">Quantidade de meses</Label>
              <Input
                id="months"
                type="number"
                min="1"
                max="72"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
                placeholder="Digite a quantidade de meses"
              />
              <p className="text-xs text-muted-foreground">
                Máximo de 72 meses
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleReplicate} 
                disabled={isLoading || months < 1 || months > 72}
                className="flex-1"
              >
                {isLoading ? 'Replicando...' : `Replicar para ${months} ${months === 1 ? 'mês' : 'meses'}`}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReplicateExpenseModal;
