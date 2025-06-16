
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import MaintenanceViewModal from './MaintenanceViewModal';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import VehicleIssuesAlert from './components/VehicleIssuesAlert';
import MaintenanceStats from './components/MaintenanceStats';
import MaintenanceHeader from './components/MaintenanceHeader';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<{vehicleId: string, vehicleName: string} | null>(null);

  if (!isAdmin && !isInternalSeller) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Acesso Negado</h2>
            <p className="text-gray-500">
              Você não tem permissão para acessar o sistema de manutenção.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Somente administradores e vendedores internos podem gerenciar manutenções.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNewMaintenance = () => {
    setEditingMaintenance(null);
    setShowForm(true);
  };

  const handleEditMaintenance = (maintenance: any) => {
    setEditingMaintenance(maintenance);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaintenance(null);
  };

  const handleViewVehicleMaintenance = (vehicleId: string, vehicleName: string) => {
    setSelectedVehicleModal({ vehicleId, vehicleName });
  };

  // Calculate statistics from real data
  const openMaintenances = maintenances.filter(m => {
    const today = new Date();
    const repairDate = m.repair_date ? new Date(m.repair_date) : null;
    const promisedDate = m.promised_date ? new Date(m.promised_date) : null;
    
    // Open: no repair date and (no promised date or promised date >= today)
    // Pending: has promised date but no repair date
    return !repairDate && (!promisedDate || promisedDate >= today);
  }).length;

  const totalCost = maintenances.reduce((sum, m) => sum + m.total_amount, 0);

  // Get vehicles with technical items that need attention
  const getVehiclesWithIssues = () => {
    const vehiclesWithIssues: any[] = [];
    
    vehicles.forEach(vehicle => {
      // This is a simplified check - in a real implementation you'd load technical items for each vehicle
      // For now, we'll simulate some vehicles having issues
      const hasIssues = Math.random() > 0.7; // Simulate 30% of vehicles having issues
      
      if (hasIssues) {
        vehiclesWithIssues.push({
          id: vehicle.id,
          name: vehicle.name,
          internal_code: vehicle.internal_code,
          issues: ['Troca de Óleo', 'Bateria'] // Simulated issues
        });
      }
    });
    
    return vehiclesWithIssues;
  };

  const vehiclesWithIssues = getVehiclesWithIssues();

  return (
    <div className="p-6 space-y-6">
      <MaintenanceHeader
        totalMaintenances={maintenances.length}
        openMaintenances={openMaintenances}
        totalCost={totalCost}
        onNewMaintenance={handleNewMaintenance}
      />

      <VehicleIssuesAlert
        vehiclesWithIssues={vehiclesWithIssues}
        onViewDetails={() => setShowOverdueModal(true)}
        onViewVehicleMaintenance={handleViewVehicleMaintenance}
      />

      <MaintenanceStats
        openMaintenances={openMaintenances}
        vehiclesWithIssues={vehiclesWithIssues.length}
        totalVehicles={vehicles.length}
      />

      <MaintenanceList 
        onEdit={handleEditMaintenance}
      />

      {showForm && (
        <MaintenanceForm
          open={showForm}
          onClose={handleCloseForm}
          editingMaintenance={editingMaintenance}
        />
      )}

      {showOverdueModal && (
        <MaintenanceViewModal
          isOpen={showOverdueModal}
          onClose={() => setShowOverdueModal(false)}
          vehicleId={undefined}
          vehicleName="Todos os Veículos com Itens Pendentes"
        />
      )}

      {selectedVehicleModal && (
        <MaintenanceViewModal
          isOpen={true}
          onClose={() => setSelectedVehicleModal(null)}
          vehicleId={selectedVehicleModal.vehicleId}
          vehicleName={selectedVehicleModal.vehicleName}
        />
      )}
    </div>
  );
};

export default MaintenanceManagement;
