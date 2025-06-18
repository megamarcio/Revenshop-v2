
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useFinancialChartData } from '@/hooks/useFinancialChartData';

const chartConfig = {
  despesasPrevistas: {
    label: 'Despesas Previstas',
    color: '#ef4444'
  },
  receitasPagas: {
    label: 'Receitas Pagas',
    color: '#22c55e'
  },
  previsaoReceitas: {
    label: 'Previsão Receitas',
    color: '#3b82f6'
  },
  receitasConfirmadas: {
    label: 'Receitas Confirmadas',
    color: '#10b981'
  }
};

const FinancialChart = () => {
  const { data, isLoading } = useFinancialChartData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fluxo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fluxo Financeiro - Últimos 6 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 sm:h-80">
          <LineChart data={data}>
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={formatCurrency} />
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name) => [formatCurrency(Number(value)), chartConfig[name as keyof typeof chartConfig]?.label]}
              />} 
            />
            <Line 
              type="monotone" 
              dataKey="despesasPrevistas" 
              stroke={chartConfig.despesasPrevistas.color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="receitasPagas" 
              stroke={chartConfig.receitasPagas.color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="previsaoReceitas" 
              stroke={chartConfig.previsaoReceitas.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="receitasConfirmadas" 
              stroke={chartConfig.receitasConfirmadas.color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>Despesas Previstas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Receitas Pagas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" style={{backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 3px, transparent 3px, transparent 6px)'}}></div>
            <span>Previsão Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span>Receitas Confirmadas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
