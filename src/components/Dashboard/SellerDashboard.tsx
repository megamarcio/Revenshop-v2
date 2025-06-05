
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, FileText, CheckSquare, TrendingUp } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();

  // Buscar estatísticas do vendedor
  const { data: stats, isLoading } = useQuery({
    queryKey: ['seller-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [customersRes, salesRes, tasksRes] = await Promise.all([
        // Clientes (Leads)
        supabase
          .from('bhph_customers')
          .select('*')
          .eq('responsible_seller_id', user.id),
        
        // Vendas realizadas
        supabase
          .from('sales')
          .select('*')
          .eq('seller_id', user.id),
        
        // Tarefas pendentes
        supabase
          .from('tasks')
          .select('*')
          .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      ]);

      const customers = customersRes.data || [];
      const sales = salesRes.data || [];
      const tasks = tasksRes.data || [];

      // Calcular orçamentos (quotes)
      const quotes = customers.filter(c => c.deal_status === 'quote').length;
      
      // Calcular vendas do mês atual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      });

      // Calcular valor total vendido
      const totalSalesValue = sales.reduce((sum, sale) => sum + (sale.final_sale_price || 0), 0);

      // Tarefas pendentes
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;

      return {
        totalLeads: customers.length,
        quotes,
        salesCount: monthlySales.length,
        totalSalesValue,
        pendingTasks,
        recentCustomers: customers.slice(0, 5),
        recentTasks: tasks.filter(task => task.status === 'pending').slice(0, 5)
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.first_name}!
        </h1>
        <p className="text-gray-600">Aqui está um resumo da sua performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalLeads || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamentos Feitos</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.quotes || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas este Mês</p>
                <p className="text-3xl font-bold text-green-600">{stats?.salesCount || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tarefas Pendentes</p>
                <p className="text-3xl font-bold text-red-600">{stats?.pendingTasks || 0}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valor Total Vendido */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Valor Total Vendido</p>
              <p className="text-4xl font-bold">
                ${stats?.totalSalesValue?.toLocaleString() || '0'}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-100" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clientes Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentCustomers?.map((customer: any) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <Badge variant={customer.deal_status === 'quote' ? 'secondary' : 'default'}>
                    {customer.deal_status === 'quote' ? 'Orçamento' : 'Lead'}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">Nenhum cliente recente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentTasks?.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      {task.due_date && `Vence: ${new Date(task.due_date).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">Nenhuma tarefa pendente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
