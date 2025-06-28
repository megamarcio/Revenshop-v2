import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Filter, 
  X, 
  Grid, 
  Copy, 
  Edit2, 
  Trash2, 
  TrendingDown, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ExpenseForecastForm from './ExpenseForecastForm';
import RevenueForecastForm from './RevenueForecastForm';
import ReplicateToExpensesModal from './ReplicateToExpensesModal';

import { useExpenseForecasts, type ExpenseForecast as ExpenseForecastType } from '@/hooks/useExpenseForecasts';
import { useRevenueForecasts, type RevenueForecast as RevenueForecastType } from '@/hooks/useRevenueForecasts';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';

type ViewMode = 'list' | 'compact';

const ExpenseForecast = () => {
  const { forecasts: expenseForecasts, deleteExpense: deleteExpenseForecast, refetch: refetchExpenses } = useExpenseForecasts();
  const { forecasts: revenueForecasts, deleteRevenue: deleteRevenueForecast, refetch: refetchRevenues } = useRevenueForecasts();
  const { categories } = useFinancialCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fixa' | 'variavel'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedExpenseForecast, setSelectedExpenseForecast] = useState<ExpenseForecastType | null>(null);
  const [selectedRevenueForecast, setSelectedRevenueForecast] = useState<RevenueForecastType | null>(null);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isRevenueFormOpen, setIsRevenueFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [forecastToReplicate, setForecastToReplicate] = useState<ExpenseForecastType | null>(null);

  const expenseForecastsWithCategory = useMemo(() => {
    if (!Array.isArray(expenseForecasts) || !Array.isArray(categories)) return [];
    return expenseForecasts.map(f => ({
      ...f,
      category: categories.find(c => c.id === f.category_id) || null,
    }));
  }, [expenseForecasts, categories]);

  const revenueForecastsWithCategory = useMemo(() => {
    if (!Array.isArray(revenueForecasts) || !Array.isArray(categories)) return [];
    return revenueForecasts.map(f => ({
      ...f,
      category: categories.find(c => c.id === f.category_id) || null,
    }));
  }, [revenueForecasts, categories]);

  const filteredExpenseForecasts = useMemo(() => {
    return expenseForecastsWithCategory.filter(f => {
      if (!f) return false;
      const typeMatch = typeFilter === 'all' || f.type === typeFilter;
      const categoryMatch = categoryFilter === 'all' || f.category_id === categoryFilter;
      const term = searchTerm.toLowerCase();
      const searchMatch = !term || 
                          f.description.toLowerCase().includes(term) ||
                          (f.category?.name && f.category.name.toLowerCase().includes(term));
      return f.is_active && typeMatch && categoryMatch && searchMatch;
    });
  }, [expenseForecastsWithCategory, typeFilter, categoryFilter, searchTerm]);

  const filteredRevenueForecasts = useMemo(() => {
    return revenueForecastsWithCategory.filter(f => {
      if (!f) return false;
      const typeMatch = typeFilter === 'all' || f.type === typeFilter;
      const categoryMatch = categoryFilter === 'all' || f.category_id === categoryFilter;
      const term = searchTerm.toLowerCase();
      const searchMatch = !term || 
                          f.description.toLowerCase().includes(term) ||
                          (f.category?.name && f.category.name.toLowerCase().includes(term));
      return f.is_active && typeMatch && categoryMatch && searchMatch;
    });
  }, [revenueForecastsWithCategory, typeFilter, categoryFilter, searchTerm]);

  const totalExpenses = useMemo(() => filteredExpenseForecasts.reduce((sum, f) => sum + f.amount, 0), [filteredExpenseForecasts]);
  const totalRevenues = useMemo(() => filteredRevenueForecasts.reduce((sum, f) => sum + f.amount, 0), [filteredRevenueForecasts]);
  const netCashFlow = totalRevenues - totalExpenses;

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const handleEditExpense = (forecast: ExpenseForecastType) => { setSelectedExpenseForecast(forecast); setIsExpenseFormOpen(true); };
  const handleEditRevenue = (forecast: RevenueForecastType) => { setSelectedRevenueForecast(forecast); setIsRevenueFormOpen(true); };
  const handleReplicate = (forecast: ExpenseForecastType) => { setForecastToReplicate(forecast); setIsReplicateOpen(true); };
  const handleDeleteExpense = async (id: string) => { if (confirm('Tem certeza?')) await deleteExpenseForecast(id); };
  const handleDeleteRevenue = async (id: string) => { if (confirm('Tem certeza?')) await deleteRevenueForecast(id); };
  const handleExpenseFormSuccess = () => { setIsExpenseFormOpen(false); setSelectedExpenseForecast(null); refetchExpenses(); };
  const handleRevenueFormSuccess = () => { setIsRevenueFormOpen(false); setSelectedRevenueForecast(null); refetchRevenues(); };
  const handleReplicateSuccess = () => { setIsReplicateOpen(false); setForecastToReplicate(null); refetchExpenses(); };
  const handleToggleViewMode = () => setViewMode(prev => prev === 'list' ? 'compact' : 'list');

  const handleCreateExpense = () => {
    setSelectedExpenseForecast(null);
    setIsExpenseFormOpen(true);
  };

  const handleCreateRevenue = () => {
    setSelectedRevenueForecast(null);
    setIsRevenueFormOpen(true);
  };

  const renderExpenseForecastCard = (forecast: ExpenseForecastType) => (
    <Card key={forecast.id} className="text-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{forecast.description}</CardTitle>
        <Badge variant={forecast.type === 'fixa' ? 'default' : 'secondary'}>{forecast.type}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{formatCurrency(forecast.amount)}</div>
        <p className="text-xs text-muted-foreground">Vencimento dia {forecast.due_day}</p>
        {forecast.category && <p className="text-xs text-muted-foreground">Categoria: {forecast.category.name}</p>}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => handleReplicate(forecast)}><Copy className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleEditExpense(forecast)}><Edit2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(forecast.id)}><Trash2 className="w-4 h-4" /></Button>
      </CardFooter>
    </Card>
  );

  const renderRevenueForecastCard = (forecast: RevenueForecastType) => (
    <Card key={forecast.id} className="text-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{forecast.description}</CardTitle>
        <Badge variant={forecast.type === 'fixa' ? 'default' : 'secondary'}>{forecast.type}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{formatCurrency(forecast.amount)}</div>
        <p className="text-xs text-muted-foreground">Recebimento dia {forecast.recurrence_day}</p>
        {forecast.category && <p className="text-xs text-muted-foreground">Categoria: {forecast.category.name}</p>}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => handleEditRevenue(forecast)}><Edit2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => handleDeleteRevenue(forecast.id)}><Trash2 className="w-4 h-4" /></Button>
      </CardFooter>
    </Card>
  );

  const renderView = (items: (ExpenseForecastType | RevenueForecastType)[], renderCard: (item: ExpenseForecastType | RevenueForecastType) => React.ReactNode) => {
    if (items.length === 0) {
      return <Card><CardContent className="p-6 text-center text-muted-foreground">Nenhuma previsão encontrada para os filtros selecionados.</CardContent></Card>;
    }
    if (viewMode === 'compact') {
      return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{items.map(item => renderCard(item))}</div>;
    }
    return <div className="space-y-3">{items.map(item => renderCard(item))}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Receitas Previstas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenues)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Despesas Previstas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netCashFlow)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Itens Totais</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{expenseForecasts.length + revenueForecasts.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><Filter className="h-5 w-5" /> Filtros</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('all'); }}><X className="h-4 w-4 mr-2" />Limpar</Button>
              <Button variant="outline" size="icon" onClick={handleToggleViewMode}><Grid className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Buscar por descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {Array.isArray(categories) && categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | 'fixa' | 'variavel')}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="fixa">Fixa</SelectItem>
                <SelectItem value="variavel">Variável</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses"><TrendingDown className="w-4 h-4 mr-2" />Despesas ({filteredExpenseForecasts.length})</TabsTrigger>
          <TabsTrigger value="revenues"><TrendingUp className="w-4 h-4 mr-2" />Receitas ({filteredRevenueForecasts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreateExpense}>
              <Plus className="mr-2 h-4 w-4" /> Nova Previsão de Despesa
            </Button>
          </div>
          {renderView(filteredExpenseForecasts, renderExpenseForecastCard)}
        </TabsContent>
        <TabsContent value="revenues" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreateRevenue}>
              <Plus className="mr-2 h-4 w-4" /> Nova Previsão de Receita
            </Button>
          </div>
          {renderView(filteredRevenueForecasts, renderRevenueForecastCard)}
        </TabsContent>
      </Tabs>
      
      {isExpenseFormOpen && <Dialog open onOpenChange={setIsExpenseFormOpen}><DialogContent><DialogHeader><DialogTitle>{selectedExpenseForecast ? 'Editar Previsão de Despesa' : 'Criar Previsão de Despesa'}</DialogTitle></DialogHeader><ExpenseForecastForm forecast={selectedExpenseForecast} onSuccess={handleExpenseFormSuccess} onCancel={() => setIsExpenseFormOpen(false)} /></DialogContent></Dialog>}
      {isRevenueFormOpen && <Dialog open onOpenChange={setIsRevenueFormOpen}><DialogContent><DialogHeader><DialogTitle>{selectedRevenueForecast ? 'Editar Previsão de Receita' : 'Criar Previsão de Receita'}</DialogTitle></DialogHeader><RevenueForecastForm forecast={selectedRevenueForecast} onSuccess={handleRevenueFormSuccess} onCancel={() => setIsRevenueFormOpen(false)} /></DialogContent></Dialog>}
      {isReplicateOpen && <Dialog open={isReplicateOpen} onOpenChange={setIsReplicateOpen}><DialogContent><ReplicateToExpensesModal forecast={forecastToReplicate} open={isReplicateOpen} onOpenChange={setIsReplicateOpen} onSuccess={handleReplicateSuccess} /></DialogContent></Dialog>}
    </div>
  );
};

export default ExpenseForecast;