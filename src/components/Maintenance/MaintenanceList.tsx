
import React, { useState } from 'react';
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

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const { maintenances, loading, deleteMaintenance } = useMaintenance();
  const { canEditVehicles } = useAuth();
  const { getMaintenanceStatus } = useMaintenanceStatus();
  const { printReport, downloadPDF } = useMaintenancePrint();
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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
      <div className="space-y-6">
        <MaintenanceFilters 
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrint={handlePrint}
          onDownloadPDF={handleDownloadPDF}
        />

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando manutenções...</p>
            </div>
          ) : filteredMaintenances.length === 0 ? (
            <EmptyMaintenanceState statusFilter={statusFilter} />
          ) : viewMode === 'table' ? (
            <MaintenanceCompactTable
              maintenances={filteredMaintenances}
              canEditVehicles={canEditVehicles}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ) : (
            filteredMaintenances.map((maintenance) => (
              <MaintenanceCard
                key={maintenance.id}
                maintenance={maintenance}
                canEditVehicles={canEditVehicles}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MaintenanceList;
