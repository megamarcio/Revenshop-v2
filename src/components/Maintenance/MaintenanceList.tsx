import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenanceStatus } from './hooks/useMaintenanceStatus';
import { useMaintenancePrint } from '../../hooks/useMaintenancePrint';
import { sortMaintenances } from './utils/maintenanceFormatters';
import MaintenanceFilters from './components/MaintenanceFilters';
import MaintenanceCard from './components/MaintenanceCard';
import MaintenanceCompactTable from './components/MaintenanceCompactTable';
import EmptyMaintenanceState from './components/EmptyMaintenanceState';
import { RefreshCw } from 'lucide-react';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
  onReopen?: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit, onReopen }: MaintenanceListProps) => {
  const { maintenances, loading, deleteMaintenance } = useMaintenance();
  const { canEditVehicles } = useAuth();
  const { getMaintenanceStatus } = useMaintenanceStatus();
  const { printReport, downloadPDF } = useMaintenancePrint();
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Indicador de atualização automática
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortedMaintenances = sortMaintenances(maintenances);

  const filteredMaintenances = sortedMaintenances.filter(maintenance => {
    const status = getMaintenanceStatus(maintenance);
    if (statusFilter === 'all') return true;
    if (statusFilter === 'open') {
      return status === 'open' || status === 'pending';
    }
    return status === statusFilter;
  });

  const handleDelete = async (maintenance: MaintenanceRecord) => {
    if (window.confirm(`Tem certeza que deseja excluir a manutenção do veículo ${maintenance.vehicle_internal_code} - ${maintenance.vehicle_name}?`)) {
      await deleteMaintenance(maintenance.id!);
    }
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'open': return 'Em Aberto e Pendentes';
      case 'completed': return 'Concluídas';
      case 'all': return 'Todas';
      default: return 'Todas';
    }
  };

  const handlePrint = () => {
    const totalValue = filteredMaintenances.reduce((sum, m) => sum + m.total_amount, 0);
    
    printReport({
      maintenances: filteredMaintenances,
      filter: getFilterLabel(statusFilter),
      totalCount: filteredMaintenances.length,
      totalValue,
      date: new Date().toLocaleDateString('pt-BR')
    });
  };

  const handleDownloadPDF = () => {
    const totalValue = filteredMaintenances.reduce((sum, m) => sum + m.total_amount, 0);
    
    downloadPDF({
      maintenances: filteredMaintenances,
      filter: getFilterLabel(statusFilter),
      totalCount: filteredMaintenances.length,
      totalValue,
      date: new Date().toLocaleDateString('pt-BR')
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        {/* Indicador de atualização automática */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Atualizando dados...
          </div>
        )}

        <MaintenanceFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrint={handlePrint}
          onDownloadPDF={handleDownloadPDF}
        />

        {filteredMaintenances.length === 0 ? (
          <EmptyMaintenanceState statusFilter={statusFilter} />
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredMaintenances.map((maintenance) => (
                  <MaintenanceCard
                    key={maintenance.id}
                    maintenance={maintenance}
                    canEditVehicles={canEditVehicles}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    onReopen={onReopen}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <MaintenanceCompactTable
                  maintenances={filteredMaintenances}
                  canEditVehicles={canEditVehicles}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onReopen={onReopen}
                />
              </div>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MaintenanceList;
