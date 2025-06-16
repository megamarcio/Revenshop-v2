
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, DollarSign } from 'lucide-react';
import { useMaintenanceCosts } from '../../../hooks/useMaintenanceCosts';

const MaintenanceCostsSummary = () => {
  const { monthlyCosts, getCostsByMonth, totalCostAllTime } = useMaintenanceCosts();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const selectedMonthData = selectedMonth ? getCostsByMonth(selectedMonth) : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          Custos por Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Mês */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Selecionar Mês para Comparação:
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um mês..." />
            </SelectTrigger>
            <SelectContent>
              {monthlyCosts.map((monthData) => (
                <SelectItem key={monthData.formattedMonth} value={monthData.formattedMonth}>
                  {monthData.formattedMonth} - {formatCurrency(monthData.totalCost)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Detalhes do Mês Selecionado */}
        {selectedMonthData && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Detalhes - {selectedMonthData.formattedMonth}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-blue-700">Custo Total:</span>
                <div className="font-bold text-blue-900">
                  {formatCurrency(selectedMonthData.totalCost)}
                </div>
              </div>
              <div>
                <span className="text-sm text-blue-700">Manutenções:</span>
                <div className="font-bold text-blue-900">
                  {selectedMonthData.count}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumo Geral */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Geral:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatCurrency(totalCostAllTime)}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Meses com dados:</span>
            <span className="text-xs text-gray-600">{monthlyCosts.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCostsSummary;
