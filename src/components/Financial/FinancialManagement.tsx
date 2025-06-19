
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialDashboard from './FinancialDashboard';
import RevenueManagement from './RevenueManagement';
import ExpenseManagement from './ExpenseManagement';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import FinancialSettings from './FinancialSettings';

interface FinancialManagementProps {
  initialTab?: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ initialTab = 'financial' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  console.log('FinancialManagement - initialTab:', initialTab);
  console.log('FinancialManagement - activeTab:', activeTab);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestão Financeira</h1>
        <p className="text-muted-foreground">
          Controle completo das suas finanças
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Dashboard</TabsTrigger>
          <TabsTrigger value="revenues">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="bank-statements">Extratos</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="financial-config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="revenues">
          <RevenueManagement />
        </TabsContent>

        <TabsContent value="expenses">
          {console.log('Renderizando ExpenseManagement')}
          <ExpenseManagement />
        </TabsContent>

        <TabsContent value="bank-statements">
          <BankStatementImport />
        </TabsContent>

        <TabsContent value="software">
          <SoftwareManagement />
        </TabsContent>

        <TabsContent value="financial-config">
          <FinancialSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
