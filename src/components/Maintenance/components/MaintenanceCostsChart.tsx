
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

interface MonthlyCosts {
  month: string;
  year: number;
  totalCost: number;
  count: number;
  formattedMonth: string;
}

interface MaintenanceCostsChartProps {
  data: MonthlyCosts[];
}

const chartConfig = {
  totalCost: {
    label: "Custo Total",
    color: "#3b82f6",
  },
};

const MaintenanceCostsChart = ({ data }: MaintenanceCostsChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-sm font-semibold">Custos dos Últimos 4 Meses</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="formattedMonth" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      "Custo Total"
                    ]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                }
              />
              <Bar 
                dataKey="totalCost" 
                fill={chartConfig.totalCost.color}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Valores em Reais (R$)
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCostsChart;
