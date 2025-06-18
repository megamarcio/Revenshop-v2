
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRevenues } from '@/hooks/useRevenues';
import { useExpenses } from '@/hooks/useExpenses';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FinancialDashboard = () => {
  const { revenues } = useRevenues();
  const { expenses } = useExpenses();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenues = revenues.filter(r => {
    const date = new Date(r.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalRevenues = monthlyRevenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const cashFlow = totalRevenues - totalExpenses;

  const pendingExpenses = expenses.filter(e => !e.is_paid && e.due_date);
  const estimatedRevenues = revenues.filter(r => r.type === 'estimada' && !r.is_confirmed);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenues)}</div>
            <p className="text-xs text-muted-foreground">
              {monthlyRevenues.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {monthlyExpenses.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              {cashFlow >= 0 ? 'Positivo' : 'Negativo'} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Despesas pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contas a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingExpenses.slice(0, 10).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {expense.due_date ? format(new Date(expense.due_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definido'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                    <Badge variant="outline" className="text-xs">
                      {expense.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {pendingExpenses.length === 0 && (
                <p className="text-center text-muted-foreground">Nenhuma conta pendente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas Estimadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {estimatedRevenues.slice(0, 10).map((revenue) => (
                <div key={revenue.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{revenue.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Data: {format(new Date(revenue.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(revenue.amount)}</p>
                    <Badge variant="outline" className="text-xs">
                      {revenue.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {estimatedRevenues.length === 0 && (
                <p className="text-center text-muted-foreground">Nenhuma receita estimada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
