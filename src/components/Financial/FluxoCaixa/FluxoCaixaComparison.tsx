import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FluxoCaixaData } from './types';

interface FluxoCaixaComparisonProps {
  currentData: FluxoCaixaData[];
  month: number;
  year: number;
}

interface ComparisonData {
  current: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
  previous: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
  changes: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
}

const FluxoCaixaComparison: React.FC<FluxoCaixaComparisonProps> = ({ 
  currentData, 
  month, 
  year 
}) => {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviousMonthData();
  }, [month, year]);

  const getPreviousMonth = () => {
    if (month === 1) {
      return { month: 12, year: year - 1 };
    }
    return { month: month - 1, year };
  };

  const fetchPreviousMonthData = async () => {
    try {
      setLoading(true);
      const previousMonth = getPreviousMonth();

      // Buscar receitas do mês anterior
      const { data: prevRevenues, error: revenueError } = await supabase
        .from('revenue_forecasts')
        .select('amount, due_day')
        .eq('is_active', true);

      if (revenueError) throw revenueError;

      // Buscar despesas do mês anterior
      const { data: prevExpenses, error: expenseError } = await supabase
        .from('expense_forecasts')
        .select('amount, due_day')
        .eq('is_active', true);

      if (expenseError) throw expenseError;

      // Calcular totais do mês atual
      const currentReceitas = currentData
        .filter(item => item.type === 'receita')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const currentDespesas = currentData
        .filter(item => item.type === 'despesa')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const currentSaldo = currentReceitas - currentDespesas;

      // Calcular totais do mês anterior (assumindo mesmos valores das previsões)
      const previousReceitas = (prevRevenues || [])
        .reduce((sum, item) => sum + Number(item.amount), 0);
      
      const previousDespesas = (prevExpenses || [])
        .reduce((sum, item) => sum + Number(item.amount), 0);
      
      const previousSaldo = previousReceitas - previousDespesas;

      // Calcular variações
      const receitasChange = currentReceitas - previousReceitas;
      const despesasChange = currentDespesas - previousDespesas;
      const saldoChange = currentSaldo - previousSaldo;

      setComparisonData({
        current: {
          receitas: currentReceitas,
          despesas: currentDespesas,
          saldo: currentSaldo
        },
        previous: {
          receitas: previousReceitas,
          despesas: previousDespesas,
          saldo: previousSaldo
        },
        changes: {
          receitas: receitasChange,
          despesas: despesasChange,
          saldo: saldoChange
        }
      });

    } catch (error) {
      console.error('Erro ao buscar dados de comparação:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const formatPercentage = (current: number, previous: number) => {
    if (previous === 0) return 'N/A';
    const percentage = ((current - previous) / Math.abs(previous)) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getChangeColor = (value: number, isExpense = false) => {
    if (value === 0) return 'text-gray-500';
    
    // Para despesas, diminuição é positiva (verde), aumento é negativa (vermelha)
    if (isExpense) {
      return value < 0 ? 'text-green-600' : 'text-red-600';
    }
    
    // Para receitas e saldo, aumento é positivo (verde), diminuição é negativa (vermelha)
    return value > 0 ? 'text-green-600' : 'text-red-600';
  };

  const previousMonth = getPreviousMonth();
  const previousMonthName = new Date(previousMonth.year, previousMonth.month - 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Comparação com Período Anterior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!comparisonData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Comparação com {previousMonthName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Receitas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Receitas</span>
              {getChangeIcon(comparisonData.changes.receitas)}
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(comparisonData.current.receitas)}
              </div>
              <div className="text-xs text-muted-foreground">
                Anterior: {formatCurrency(comparisonData.previous.receitas)}
              </div>
              <Badge 
                variant="outline" 
                className={getChangeColor(comparisonData.changes.receitas)}
              >
                {comparisonData.changes.receitas > 0 ? '+' : ''}
                {formatCurrency(comparisonData.changes.receitas)} 
                ({formatPercentage(comparisonData.current.receitas, comparisonData.previous.receitas)})
              </Badge>
            </div>
          </div>

          {/* Despesas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Despesas</span>
              {getChangeIcon(comparisonData.changes.despesas)}
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(comparisonData.current.despesas)}
              </div>
              <div className="text-xs text-muted-foreground">
                Anterior: {formatCurrency(comparisonData.previous.despesas)}
              </div>
              <Badge 
                variant="outline" 
                className={getChangeColor(comparisonData.changes.despesas, true)}
              >
                {comparisonData.changes.despesas > 0 ? '+' : ''}
                {formatCurrency(comparisonData.changes.despesas)}
                ({formatPercentage(comparisonData.current.despesas, comparisonData.previous.despesas)})
              </Badge>
            </div>
          </div>

          {/* Saldo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Saldo</span>
              {getChangeIcon(comparisonData.changes.saldo)}
            </div>
            <div className="space-y-1">
              <div className={`text-lg font-bold ${
                comparisonData.current.saldo >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(comparisonData.current.saldo)}
              </div>
              <div className="text-xs text-muted-foreground">
                Anterior: {formatCurrency(comparisonData.previous.saldo)}
              </div>
              <Badge 
                variant="outline" 
                className={getChangeColor(comparisonData.changes.saldo)}
              >
                {comparisonData.changes.saldo > 0 ? '+' : ''}
                {formatCurrency(comparisonData.changes.saldo)}
                ({formatPercentage(comparisonData.current.saldo, comparisonData.previous.saldo)})
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FluxoCaixaComparison; 