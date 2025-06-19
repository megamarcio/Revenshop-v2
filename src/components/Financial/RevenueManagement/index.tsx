
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRevenues } from '@/hooks/useRevenues';
import RevenueForm from '../RevenueForm';
import ReplicateRevenueModal from '../ReplicateRevenueModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RevenueManagementHeader from './RevenueManagementHeader';
import RevenueListView from './RevenueListView';
import RevenueCompactView from './RevenueCompactView';
import RevenueUltraCompactView from './RevenueUltraCompactView';
import { DateFilterType, getDateRangeForFilter, filterRevenuesByDateRange, getFilterLabel } from './dateFilterUtils';
import { RevenueSortField, SortOrder, sortRevenues } from './RevenueSortingUtils';
import { useRevenueManagementUtils } from './useRevenueManagementUtils';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

const RevenueManagement = () => {
  const { revenues, deleteRevenue, refetch } = useRevenues();
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [revenueToReplicate, setRevenueToReplicate] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [sortField, setSortField] = useState<RevenueSortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { formatCurrency, getTypeColor, canReplicate } = useRevenueManagementUtils();

  const filteredRevenues = useMemo(() => {
    // Primeiro aplica o filtro de confirmação
    let filtered = revenues.filter(revenue => 
      showConfirmed ? true : !revenue.is_confirmed
    );

    // Depois aplica o filtro de data
    const dateRange = getDateRangeForFilter(dateFilter);
    filtered = filterRevenuesByDateRange(filtered, dateRange, dateFilter);

    // Por último aplica a ordenação
    filtered = sortRevenues(filtered, sortField, sortOrder);

    console.log('Filtros e ordenação aplicados (receitas):', {
      totalRevenues: revenues.length,
      afterConfirmationFilter: revenues.filter(revenue => showConfirmed ? true : !revenue.is_confirmed).length,
      afterDateFilter: filtered.length,
      dateFilter,
      dateRange,
      sortField,
      sortOrder
    });

    return filtered;
  }, [revenues, showConfirmed, dateFilter, sortField, sortOrder]);

  const handleEdit = (revenue: any) => {
    setSelectedRevenue(revenue);
    setIsFormOpen(true);
  };

  const handleReplicate = (revenue: any) => {
    setRevenueToReplicate(revenue);
    setIsReplicateOpen(true);
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

  const handleReplicateSuccess = () => {
    setIsReplicateOpen(false);
    setRevenueToReplicate(null);
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

  const handleSortChange = (field: RevenueSortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const renderRevenueView = () => {
    const commonProps = {
      revenues: filteredRevenues,
      onEdit: handleEdit,
      onReplicate: handleReplicate,
      onDelete: handleDelete,
      formatCurrency,
      getTypeColor,
      canReplicate,
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
        sortField={sortField}
        sortOrder={sortOrder}
        onToggleShowConfirmed={handleToggleShowConfirmed}
        onToggleViewMode={handleToggleViewMode}
        onDateFilterChange={handleDateFilterChange}
        onSortChange={handleSortChange}
        onNewRevenue={handleNewRevenue}
      />

      <div className="text-center text-sm text-muted-foreground">
        {dateFilter !== 'all' && (
          <div>{getFilterLabel(dateFilter)}</div>
        )}
        {filteredRevenues.length} {filteredRevenues.length === 1 ? 'receita' : 'receitas'} {showConfirmed ? 'encontradas' : 'não confirmadas'}
      </div>

      {renderRevenueView()}

      {filteredRevenues.length === 0 && (
        <Card className="text-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {dateFilter === 'all' 
                ? (showConfirmed ? 'Nenhuma receita encontrada' : 'Nenhuma receita pendente encontrada')
                : 'Nenhuma receita encontrada para o período selecionado'
              }
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

      <ReplicateRevenueModal
        revenue={revenueToReplicate}
        open={isReplicateOpen}
        onOpenChange={setIsReplicateOpen}
        onSuccess={handleReplicateSuccess}
      />
    </div>
  );
};

export default RevenueManagement;
