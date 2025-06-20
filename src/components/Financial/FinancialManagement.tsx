
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import FinancialDashboard from './FinancialDashboard';
import ExpenseManagement from './ExpenseManagement';
import RevenueManagement from './RevenueManagement';
import FinancialSettings from './FinancialSettings';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import { useFinancialChartData } from '@/hooks/useFinancialChartData';

interface FinancialManagementProps {
  initialTab?: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ initialTab = 'dashboard' }) => {
  const { data: monthlyData, isLoading } = useFinancialChartData();

  // Calcular totais a partir dos dados mensais
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.receitasConfirmadas, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.despesasPrevistas, 0);
  const netProfit = totalRevenue - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Determinar a aba ativa baseada no initialTab
  const getActiveTab = () => {
    switch (initialTab) {
      case 'expenses':
        return 'expenses';
      case 'revenues':
        return 'revenues';
      case 'bank-statements':
        return 'bank-statements';
      case 'software':
        return 'software';
      case 'financial-config':
        return 'settings';
      default:
        return 'dashboard';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
        <p className="text-muted-foreground">
          Gerencie receitas, despesas e acompanhe a performance financeira
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={getActiveTab()} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="revenues">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="bank-statements">Extratos</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="revenues">
          <RevenueManagement />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseManagement />
        </TabsContent>

        <TabsContent value="bank-statements">
          <BankStatementImport />
        </TabsContent>

        <TabsContent value="software">
          <SoftwareManagement />
        </TabsContent>

        <TabsContent value="settings">
          <FinancialSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
