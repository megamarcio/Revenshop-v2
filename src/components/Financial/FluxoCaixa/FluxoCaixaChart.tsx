import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FluxoCaixaData, ChartDataPoint } from './types';

interface FluxoCaixaChartProps {
  data: FluxoCaixaData[];
}

const FluxoCaixaChart: React.FC<FluxoCaixaChartProps> = ({ data }) => {
  // Processar dados para o gráfico
  const processChartData = (): ChartDataPoint[] => {
    const groupedData: { [key: string]: { receitas: number; despesas: number } } = {};

    data.forEach(item => {
      const dateKey = item.date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { receitas: 0, despesas: 0 };
      }

      if (item.type === 'receita') {
        groupedData[dateKey].receitas += item.amount;
      } else {
        groupedData[dateKey].despesas += item.amount;
      }
    });

    // Converter para array e calcular saldo acumulado
    let saldoAcumulado = 0;
    return Object.entries(groupedData)
      .sort(([a], [b]) => {
        const [dayA, monthA] = a.split('/').map(Number);
        const [dayB, monthB] = b.split('/').map(Number);
        return dayA - dayB;
      })
      .map(([date, values]) => {
        const saldoDia = values.receitas - values.despesas;
        saldoAcumulado += saldoDia;
        
        return {
          date,
          receitas: values.receitas,
          despesas: values.despesas,
          saldo: saldoAcumulado
        };
      });
  };

  const chartData = processChartData();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Data: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey === 'receitas' ? 'Receitas' : 
                 entry.dataKey === 'despesas' ? 'Despesas' : 'Saldo'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Nenhum dado disponível para o período selecionado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Barras - Receitas vs Despesas */}
      <div>
        <h3 className="text-lg font-medium mb-4">Receitas vs Despesas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
            <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Linha - Saldo Acumulado */}
      <div>
        <h3 className="text-lg font-medium mb-4">Saldo Acumulado</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Saldo Acumulado"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FluxoCaixaChart; 