
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRevenues } from '@/hooks/useRevenues';
import RevenueForm from '../RevenueForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RevenueManagementHeader from './RevenueManagementHeader';
import RevenueListView from './RevenueListView';
import RevenueCompactView from './RevenueCompactView';
import RevenueUltraCompactView from './RevenueUltraCompactView';
import { DateFilterType, getDateRangeForFilter, filterRevenuesByDateRange, getFilterLabel } from '../ExpenseManagement/dateFilterUtils';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

const RevenueManagement = () => {
  const { revenues, deleteRevenue, refetch } = useRevenues();
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'venda': return 'bg-green-100 text-green-800';
      case 'comissao': return 'bg-blue-100 text-blue-800';
      case 'servico': return 'bg-purple-100 text-purple-800';
      case 'financiamento': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRevenues = useMemo(() => {
    // Primeiro aplica o filtro de confirmação
    let filtered = revenues.filter(revenue => 
      showConfirmed ? true : !revenue.is_confirmed
    );

    // Depois aplica o filtro de data
    const dateRange = getDateRangeForFilter(dateFilter);
    filtered = filterRevenuesByDateRange(filtered, dateRange);

    return filtered;
  }, [revenues, showConfirmed, dateFilter]);

  const handleEdit = (revenue: any) => {
    setSelectedRevenue(revenue);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      await deleteRevenue(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedRevenue(null);
    refetch();
  };

  const handleNewRevenue = () => setIsFormOpen(true);
  const handleToggleShowConfirmed = () => setShowConfirmed(!showConfirmed);
  
  const handleToggleViewMode = () => {
    setViewMode(current => {
      switch (current) {
        case 'list':
          return 'compact';
        case 'compact':
          return 'ultra-compact';
        case 'ultra-compact':
          return 'list';
        default:
          return 'list';
      }
    });
  };

  const handleDateFilterChange = (filter: DateFilterType) => {
    setDateFilter(filter);
  };

  const getFilterLabelForRevenues = (filter: DateFilterType): string => {
    const label = getFilterLabel(filter);
    return label.replace('despesas', 'receitas');
  };

  const renderRevenueView = () => {
    const commonProps = {
      revenues: filteredRevenues,
      onEdit: handleEdit,
      onDelete: handleDelete,
      formatCurrency,
      getTypeColor,
    };

    switch (viewMode) {
      case 'list':
        return <RevenueListView {...commonProps} />;
      case 'compact':
        return <RevenueCompactView {...commonProps} />;
      case 'ultra-compact':
        return <RevenueUltraCompactView {...commonProps} />;
      default:
        return <RevenueListView {...commonProps} />;
    }
  };

  return (
    <div className="space-y-4">
      <RevenueManagementHeader
        showConfirmed={showConfirmed}
        viewMode={viewMode}
        dateFilter={dateFilter}
        onToggleShowConfirmed={handleToggleShowConfirmed}
        onToggleViewMode={handleToggleViewMode}
        onDateFilterChange={handleDateFilterChange}
        onNewRevenue={handleNewRevenue}
      />

      {dateFilter !== 'all' && (
        <div className="text-center text-sm text-muted-foreground">
          {getFilterLabelForRevenues(dateFilter)} • {filteredRevenues.length} {filteredRevenues.length === 1 ? 'receita' : 'receitas'}
        </div>
      )}

      {renderRevenueView()}

      {filteredRevenues.length === 0 && (
        <Card className="text-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {dateFilter === 'all' ? 'Nenhuma receita encontrada' : 'Nenhuma receita encontrada para o período selecionado'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedRevenue ? 'Editar Receita' : 'Nova Receita'}
            </DialogTitle>
          </DialogHeader>
          <RevenueForm
            revenue={selectedRevenue}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedRevenue(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueManagement;
