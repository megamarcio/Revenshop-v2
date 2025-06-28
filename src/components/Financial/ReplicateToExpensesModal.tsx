import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useExpenseForecasts, type ExpenseForecast } from '@/hooks/useExpenseForecasts';
import { toast } from '@/hooks/use-toast';

interface ReplicateToExpensesModalProps {
  forecast: ExpenseForecast | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ReplicateToExpensesModal: React.FC<ReplicateToExpensesModalProps> = ({
  forecast,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { replicateToExpenses } = useExpenseForecasts();
  const [startDate, setStartDate] = useState<Date>();
  const [installments, setInstallments] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forecast || !startDate) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma data de início.',
        variant: 'destructive',
      });
      return;
    }

    if (installments < 1 || installments > 60) {
      toast({
        title: 'Erro',
        description: 'O número de parcelas deve estar entre 1 e 60.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await replicateToExpenses(forecast.id, startDate, installments);
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setStartDate(undefined);
      setInstallments(1);
    } catch (error) {
      // Error already handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = forecast ? forecast.amount * installments : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Replicar para Despesas</DialogTitle>
        </DialogHeader>

        {forecast && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informações da Previsão */}
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">Previsão Selecionada:</h4>
              <p className="text-sm">{forecast.description}</p>
              <p className="text-sm text-muted-foreground">
                Valor: {formatCurrency(forecast.amount)} • Todo dia {forecast.due_day}
              </p>
            </div>

            {/* Data de Início */}
            <div>
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Número de Parcelas */}
            <div>
              <Label htmlFor="installments">Número de Parcelas *</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                max="60"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                placeholder="Ex: 12"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Máximo: 60 parcelas
              </p>
            </div>

            {/* Resumo */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">Resumo da Replicação:</h4>
              <ul className="text-sm space-y-1">
                <li>• {installments} despesas serão criadas</li>
                <li>• Valor total: {formatCurrency(totalAmount)}</li>
                <li>• Uma despesa por mês a partir da data selecionada</li>
                <li>• Todas no dia {forecast.due_day} de cada mês</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Replicando...' : 'Replicar Despesas'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReplicateToExpensesModal; 