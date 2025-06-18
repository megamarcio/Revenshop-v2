
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialDashboard from './FinancialDashboard';
import RevenueManagement from './RevenueManagement';
import ExpenseManagement from './ExpenseManagement';
import PendingExpenses from './PendingExpenses';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import FinancialSettings from './FinancialSettings';
import ExpenseForm from './ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useExpenses } from '@/hooks/useExpenses';

interface FinancialManagementProps {
  initialTab?: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { deleteExpense, refetch } = useExpenses();

  // Map sidebar tabs to internal tabs
  const mapSidebarTabToInternalTab = (sidebarTab: string) => {
    switch (sidebarTab) {
      case 'financial': return 'dashboard';
      case 'revenues': return 'revenues';
      case 'expenses': return 'expenses';
      case 'bank-statements': return 'bank';
      case 'software': return 'software';
      case 'financial-config': return 'settings';
      default: return 'dashboard';
    }
  };

  useEffect(() => {
    if (initialTab) {
      const mappedTab = mapSidebarTabToInternalTab(initialTab);
      setActiveTab(mappedTab);
    }
  }, [initialTab]);

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteExpense(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
    refetch();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">Gestão financeira completa da empresa</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="revenues">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
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

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Despesas Pendentes</h2>
              <p className="text-sm text-muted-foreground">Despesas aguardando confirmação de pagamento</p>
            </div>
            <PendingExpenses onEdit={handleEdit} onDelete={handleDelete} />
          </div>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Editar Despesa
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={selectedExpense}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedExpense(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialManagement;
