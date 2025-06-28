import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FluxoCaixaData } from './types';

interface FluxoCaixaPieChartProps {
  data: FluxoCaixaData[];
}

const FluxoCaixaPieChart: React.FC<FluxoCaixaPieChartProps> = ({ data }) => {
  const processDataByCategory = (type: 'receita' | 'despesa') => {
    const filteredData = data.filter(item => item.type === type);
    const categoryTotals: { [key: string]: { amount: number; color: string } } = {};

    filteredData.forEach(item => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = {
          amount: 0,
          color: item.color || (type === 'receita' ? '#10b981' : '#ef4444')
        };
      }
      categoryTotals[item.category].amount += item.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, data]) => ({
        name,
        value: data.amount,
        color: data.color
      }))
      .sort((a, b) => b.value - a.value);
  };

  const receitasData = processDataByCategory('receita');
  const despesasData = processDataByCategory('despesa');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = (data: any[], title: string) => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Nenhum dado disponível para {title.toLowerCase()}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Lista de categorias */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-sm font-bold">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="receitas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receitas" className="mt-4">
            {renderPieChart(receitasData, 'Receitas')}
          </TabsContent>
          
          <TabsContent value="despesas" className="mt-4">
            {renderPieChart(despesasData, 'Despesas')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FluxoCaixaPieChart; 