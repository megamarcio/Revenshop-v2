import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import FinancialDashboard from './FinancialDashboard';
import ExpenseManagement from './ExpenseManagement';
import RevenueManagement from './RevenueManagement/index';
import FinancialSettings from './FinancialSettings';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import { useFinancialChartData } from '@/hooks/useFinancialChartData';

interface FinancialManagementProps {
  initialTab?: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ initialTab = 'dashboard' }) => {
  const { data: monthlyData, isLoading } = useFinancialChartData();

  // Debug: verificar se o componente está sendo renderizado
  console.log('FinancialManagement rendered with initialTab:', initialTab);

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

  // Controle de tab sincronizado com prop
  const [tabValue, setTabValue] = useState(getActiveTab());
  useEffect(() => {
    setTabValue(getActiveTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab]);

  const handleTabChange = (value: string) => {
    setTabValue(value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestão Financeira</h1>
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

      <Tabs value={tabValue} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="flex w-full gap-1 p-1">
          <TabsTrigger 
            value="dashboard" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation flex-1"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="revenues" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation flex-1"
          >
            Receitas
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation flex-1"
          >
            Despesas
          </TabsTrigger>
          <TabsTrigger 
            value="bank-statements" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation hidden sm:inline-flex"
          >
            Extratos
          </TabsTrigger>
          <TabsTrigger 
            value="software" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation hidden sm:inline-flex"
          >
            Software
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] touch-manipulation hidden sm:inline-flex"
          >
            Config
          </TabsTrigger>
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
