import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRevenues, Revenue } from '@/hooks/useRevenues';
import RevenueForm from '../RevenueForm';
import ReplicateRevenueModal from '../ReplicateRevenueModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RevenueManagementHeader from './RevenueManagementHeader';
import RevenueListView from './RevenueListView';
import RevenueCompactView from './RevenueCompactView';
import RevenueUltraCompactView from './RevenueUltraCompactView';
import { useRevenueManagementUtils } from './useRevenueManagementUtils';
import { DateFilterType, getDateRangeForFilter, filterRevenuesByDateRange, getFilterLabel } from './dateFilterUtils';

type ViewMode = 'list' | 'compact' | 'ultra-compact';

const RevenueManagement = () => {
  const { revenues, deleteRevenue, refetch } = useRevenues();
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReplicateOpen, setIsReplicateOpen] = useState(false);
  const [revenueToReplicate, setRevenueToReplicate] = useState<Revenue | null>(null);
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');

  const { formatCurrency, getTypeColor, canReplicate } = useRevenueManagementUtils();

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

  const handleEdit = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    setIsFormOpen(true);
  };

  const handleReplicate = (revenue: Revenue) => {
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
        onToggleShowConfirmed={handleToggleShowConfirmed}
        onToggleViewMode={handleToggleViewMode}
        onDateFilterChange={handleDateFilterChange}
        onNewRevenue={handleNewRevenue}
      />

      {dateFilter !== 'all' && (
        <div className="text-center text-sm text-muted-foreground">
          {getFilterLabel(dateFilter)} • {filteredRevenues.length} {filteredRevenues.length === 1 ? 'receita' : 'receitas'}
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
