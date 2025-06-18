
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyData {
  month: string;
  despesasPrevistas: number;
  receitasPagas: number;
  previsaoReceitas: number;
  receitasConfirmadas: number;
}

export const useFinancialChartData = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const chartData: MonthlyData[] = [];
      
      // Últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthLabel = format(date, 'MMM/yy');
        
        // Buscar despesas não pagas do mês
        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('date', monthStart.toISOString().split('T')[0])
          .lte('date', monthEnd.toISOString().split('T')[0])
          .eq('is_paid', false);
        
        const despesasPrevistas = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
        
        // Buscar todas as receitas do mês
        const { data: allRevenues } = await supabase
          .from('revenues')
          .select('amount, is_confirmed')
          .gte('date', monthStart.toISOString().split('T')[0])
          .lte('date', monthEnd.toISOString().split('T')[0]);
        
        const previsaoReceitas = allRevenues?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0;
        const receitasConfirmadas = allRevenues?.filter(rev => rev.is_confirmed)
          ?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0;
        
        // Para receitas pagas, consideramos as confirmadas como pagas
        const receitasPagas = receitasConfirmadas;
        
        chartData.push({
          month: monthLabel,
          despesasPrevistas,
          receitasPagas,
          previsaoReceitas,
          receitasConfirmadas
        });
      }
      
      setData(chartData);
    } catch (error) {
      console.error('Error fetching financial chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  return {
    data,
    isLoading,
    refetch: fetchFinancialData
  };
};
