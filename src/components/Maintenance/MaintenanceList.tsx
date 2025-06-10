
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenanceStatus } from './hooks/useMaintenanceStatus';
import { sortMaintenances } from './utils/maintenanceFormatters';
import MaintenanceStatusLegend from './components/MaintenanceStatusLegend';
import MaintenanceFilters from './components/MaintenanceFilters';
import MaintenanceCard from './components/MaintenanceCard';
import EmptyMaintenanceState from './components/EmptyMaintenanceState';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const { maintenances, loading, deleteMaintenance } = useMaintenance();
  const { canEditVehicles } = useAuth();
  const { getMaintenanceStatus } = useMaintenanceStatus();
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');

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

  return (
    <TooltipProvider>
      <div className="space-y-6 relative">
        <MaintenanceStatusLegend />

        <MaintenanceFilters 
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando manutenções...</p>
            </div>
          ) : filteredMaintenances.length === 0 ? (
            <EmptyMaintenanceState statusFilter={statusFilter} />
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
