import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FluxoCaixaChart from './FluxoCaixaChart';
import FluxoCaixaTable from './FluxoCaixaTable';
import { FluxoCaixaData, FluxoCaixaFilters } from './types';

const FluxoCaixa: React.FC = () => {
  const [data, setData] = useState<FluxoCaixaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FluxoCaixaFilters>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    view: 'mensal'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFluxoCaixaData();
  }, [filters]);

  const fetchFluxoCaixaData = async () => {
    try {
      setLoading(true);
      
      // Buscar previsões de receitas
      const { data: revenues, error: revenueError } = await supabase
        .from('revenue_forecasts')
        .select(`
          id,
          description,
          amount,
          type,
          due_day,
          is_active,
          financial_categories (
            name,
            color
          )
        `)
        .eq('is_active', true);

      if (revenueError) throw revenueError;

      // Buscar previsões de despesas
      const { data: expenses, error: expenseError } = await supabase
        .from('expense_forecasts')
        .select(`
          id,
          description,
          amount,
          type,
          due_day,
          is_active,
          financial_categories (
            name,
            color
          )
        `)
        .eq('is_active', true);

      if (expenseError) throw expenseError;

      // Processar dados para o fluxo de caixa
      const processedData = processFluxoCaixaData(revenues || [], expenses || []);
      setData(processedData);

    } catch (error) {
      console.error('Erro ao buscar dados do fluxo de caixa:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do fluxo de caixa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processFluxoCaixaData = (revenues: any[], expenses: any[]): FluxoCaixaData[] => {
    const processedData: FluxoCaixaData[] = [];
    const daysInMonth = new Date(filters.year, filters.month, 0).getDate();

    // Processar receitas
    revenues.forEach(revenue => {
      processedData.push({
        id: revenue.id,
        date: new Date(filters.year, filters.month - 1, revenue.due_day),
        description: revenue.description,
        amount: Number(revenue.amount),
        type: 'receita',
        category: revenue.financial_categories?.name || 'Sem categoria',
        color: revenue.financial_categories?.color || '#10b981'
      });
    });

    // Processar despesas
    expenses.forEach(expense => {
      processedData.push({
        id: expense.id,
        date: new Date(filters.year, filters.month - 1, expense.due_day),
        description: expense.description,
        amount: Number(expense.amount),
        type: 'despesa',
        category: expense.financial_categories?.name || 'Sem categoria',
        color: expense.financial_categories?.color || '#ef4444'
      });
    });

    return processedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const calculateTotals = () => {
    const totalReceitas = data
      .filter(item => item.type === 'receita')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalDespesas = data
      .filter(item => item.type === 'despesa')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const saldoFinal = totalReceitas - totalDespesas;

    return { totalReceitas, totalDespesas, saldoFinal };
  };

  const { totalReceitas, totalDespesas, saldoFinal } = calculateTotals();

  const exportData = () => {
    // Implementar exportação para Excel/PDF
    toast({
      title: "Exportação",
      description: "Funcionalidade de exportação será implementada em breve",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">
            Acompanhe as entradas e saídas previstas
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.month.toString()}
            onValueChange={(value) => setFilters(prev => ({ ...prev, month: parseInt(value) }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filters.year.toString()}
            onValueChange={(value) => setFilters(prev => ({ ...prev, year: parseInt(value) }))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => (
                <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                  {2024 + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <Badge variant={saldoFinal >= 0 ? 'default' : 'destructive'} className="mt-2">
              {saldoFinal >= 0 ? 'Positivo' : 'Negativo'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <FluxoCaixaChart data={data} />
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <FluxoCaixaTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FluxoCaixa; 