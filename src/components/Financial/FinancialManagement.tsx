
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialDashboard from './FinancialDashboard';
import RevenueManagement from './RevenueManagement';
import ExpenseManagement from './ExpenseManagement';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import FinancialSettings from './FinancialSettings';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">Gestão financeira completa da empresa</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="revenues">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="bank">Extratos</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="settings">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="revenues" className="mt-6">
          <RevenueManagement />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <ExpenseManagement />
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <BankStatementImport />
        </TabsContent>

        <TabsContent value="software" className="mt-6">
          <SoftwareManagement />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <FinancialSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
