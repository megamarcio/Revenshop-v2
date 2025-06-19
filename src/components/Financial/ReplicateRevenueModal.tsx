
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRevenues, Revenue } from '@/hooks/useRevenues';
import { toast } from '@/hooks/use-toast';
import { addMonths, format } from 'date-fns';

interface ReplicateRevenueModalProps {
  revenue: Revenue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ReplicateRevenueModal: React.FC<ReplicateRevenueModalProps> = ({
  revenue,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [months, setMonths] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { createRevenue } = useRevenues();

  const handleReplicate = async () => {
    if (!revenue || months < 1) return;

    setIsLoading(true);
    try {
      const promises = [];
      
      for (let i = 1; i <= months; i++) {
        const referenceDate = new Date(revenue.date);
        const newDate = addMonths(referenceDate, i);
        
        const replicatedRevenue = {
          description: revenue.description,
          amount: revenue.amount,
          category_id: revenue.category_id,
          type: revenue.type,
          date: format(newDate, 'yyyy-MM-dd'),
          is_confirmed: false, // Nova receita sempre não confirmada
          notes: revenue.notes,
          created_by: revenue.created_by,
        };

        promises.push(createRevenue(replicatedRevenue));
      }

      await Promise.all(promises);
      
      const revenueTypeLabel = revenue.type === 'mensal' ? 'receita mensal' : 
                              revenue.type === 'estimada' ? 'receita estimada' : 'receita';
      
      toast({
        title: 'Sucesso',
        description: `${revenueTypeLabel.charAt(0).toUpperCase() + revenueTypeLabel.slice(1)} replicada para ${months} ${months === 1 ? 'mês' : 'meses'}`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error replicating revenue:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao replicar receita',
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

  const getRevenueTypeLabel = (type: string) => {
    switch (type) {
      case 'mensal': return 'Receita Mensal';
      case 'estimada': return 'Receita Estimada';
      case 'avulsa': return 'Receita Avulsa';
      case 'comissao': return 'Comissão';
      case 'extra': return 'Receita Extra';
      case 'investimento': return 'Retorno de Investimento';
      case 'padrao': return 'Receita Padrão';
      default: return 'Receita';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Replicar {revenue ? getRevenueTypeLabel(revenue.type) : 'Receita'}
          </DialogTitle>
        </DialogHeader>
        
        {revenue && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Receita:</strong> {revenue.description}</p>
              <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(revenue.amount)}</p>
              <p><strong>Tipo:</strong> {getRevenueTypeLabel(revenue.type)}</p>
              <p><strong>Data:</strong> {format(new Date(revenue.date), 'dd/MM/yyyy')}</p>
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

export default ReplicateRevenueModal;
