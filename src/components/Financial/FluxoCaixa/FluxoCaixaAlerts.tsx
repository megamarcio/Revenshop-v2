import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Calendar, Info } from 'lucide-react';
import { FluxoCaixaData } from './types';

interface FluxoCaixaAlertsProps {
  data: FluxoCaixaData[];
  month: number;
  year: number;
}

const FluxoCaixaAlerts: React.FC<FluxoCaixaAlertsProps> = ({ data, month, year }) => {
  const calculateTotals = () => {
    const totalReceitas = data
      .filter(item => item.type === 'receita')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalDespesas = data
      .filter(item => item.type === 'despesa')
      .reduce((sum, item) => sum + item.amount, 0);
    
    return { totalReceitas, totalDespesas, saldoFinal: totalReceitas - totalDespesas };
  };

  const getUpcomingTransactions = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= today && itemDate <= nextWeek;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getLargeTransactions = () => {
    const averageAmount = data.length > 0 
      ? data.reduce((sum, item) => sum + item.amount, 0) / data.length 
      : 0;
    
    const threshold = averageAmount * 2; // Transações 2x acima da média
    
    return data.filter(item => item.amount > threshold && threshold > 1000)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3); // Top 3 maiores
  };

  const { totalReceitas, totalDespesas, saldoFinal } = calculateTotals();
  const upcomingTransactions = getUpcomingTransactions();
  const largeTransactions = getLargeTransactions();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Alerta de Saldo Negativo */}
      {saldoFinal < 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Saldo Negativo</AlertTitle>
          <AlertDescription>
            O fluxo de caixa do mês está negativo em{' '}
            <strong>{formatCurrency(Math.abs(saldoFinal))}</strong>.
            Considere revisar as despesas ou aumentar as receitas.
          </AlertDescription>
        </Alert>
      )}

      {/* Alerta de Despesas Altas */}
      {totalDespesas > totalReceitas * 0.8 && saldoFinal >= 0 && (
        <Alert>
          <TrendingDown className="h-4 w-4" />
          <AlertTitle>Despesas Elevadas</AlertTitle>
          <AlertDescription>
            As despesas representam{' '}
            <strong>{((totalDespesas / totalReceitas) * 100).toFixed(1)}%</strong>{' '}
            das receitas. Monitore os gastos para manter a margem saudável.
          </AlertDescription>
        </Alert>
      )}

      {/* Transações Próximas */}
      {upcomingTransactions.length > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Próximas Transações (7 dias)</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {upcomingTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <span className="text-sm">
                    {formatDate(transaction.date)} - {transaction.description}
                  </span>
                  <Badge variant={transaction.type === 'receita' ? 'default' : 'destructive'}>
                    {transaction.type === 'receita' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </Badge>
                </div>
              ))}
              {upcomingTransactions.length > 5 && (
                <div className="text-sm text-muted-foreground">
                  + {upcomingTransactions.length - 5} outras transações
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Transações de Alto Valor */}
      {largeTransactions.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Transações de Alto Valor</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {largeTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center">
                  <span className="text-sm">
                    {transaction.description} - {transaction.category}
                  </span>
                  <Badge variant={transaction.type === 'receita' ? 'default' : 'destructive'}>
                    {formatCurrency(transaction.amount)}
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Resumo Positivo */}
      {saldoFinal > 0 && totalDespesas <= totalReceitas * 0.7 && (
        <Alert className="border-green-200 bg-green-50">
          <Info className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Fluxo Saudável</AlertTitle>
          <AlertDescription className="text-green-700">
            Excelente controle financeiro! O saldo positivo de{' '}
            <strong>{formatCurrency(saldoFinal)}</strong>{' '}
            representa uma margem saudável de{' '}
            <strong>{((saldoFinal / totalReceitas) * 100).toFixed(1)}%</strong>.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FluxoCaixaAlerts; 