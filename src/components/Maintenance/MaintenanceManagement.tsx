
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import MaintenanceViewModal from './MaintenanceViewModal';
import TechnicalPanelRedesigned from './TechnicalPanel/TechnicalPanelRedesigned';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import UrgentMaintenanceAlert from './components/UrgentMaintenanceAlert';
import MaintenanceStats from './components/MaintenanceStats';
import MaintenanceHeader from './components/MaintenanceHeader';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<{vehicleId: string, vehicleName: string} | null>(null);
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(false);

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

  const handleOpenTechnicalPanel = () => {
    setShowTechnicalPanel(true);
  };

  const handleCloseTechnicalPanel = () => {
    setShowTechnicalPanel(false);
  };

  // Calculate statistics from real data
  const openMaintenances = maintenances.filter(m => {
    const today = new Date();
    const repairDate = m.repair_date ? new Date(m.repair_date) : null;
    const promisedDate = m.promised_date ? new Date(m.promised_date) : null;
    
    // Open: no repair date and (no promised date or promised date >= today)
    return !repairDate && (!promisedDate || promisedDate >= today);
  }).length;

  // Filter urgent maintenances that are pending/open
  const urgentMaintenances = maintenances.filter(m => {
    if (!m.is_urgent) return false;
    
    const repairDate = m.repair_date ? new Date(m.repair_date) : null;
    const promisedDate = m.promised_date ? new Date(m.promised_date) : null;
    const today = new Date();
    
    // Only show urgent maintenances that are not completed
    return !repairDate && (!promisedDate || promisedDate >= today);
  });

  const totalCost = maintenances.reduce((sum, m) => sum + m.total_amount, 0);

  return (
    <div className="p-6 space-y-6">
      <MaintenanceHeader
        totalMaintenances={maintenances.length}
        openMaintenances={openMaintenances}
        totalCost={totalCost}
        onNewMaintenance={handleNewMaintenance}
        onOpenTechnicalPanel={handleOpenTechnicalPanel}
      />

      {/* Alert for urgent maintenances */}
      {urgentMaintenances.length > 0 && (
        <UrgentMaintenanceAlert
          urgentMaintenances={urgentMaintenances}
          onViewDetails={handleViewVehicleMaintenance}
        />
      )}

      <MaintenanceStats
        openMaintenances={openMaintenances}
        vehiclesWithIssues={0}
        totalVehicles={vehicles.length}
        technicalItemsCount={0}
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

      {selectedVehicleModal && (
        <MaintenanceViewModal
          isOpen={true}
          onClose={() => setSelectedVehicleModal(null)}
          vehicleId={selectedVehicleModal.vehicleId}
          vehicleName={selectedVehicleModal.vehicleName}
        />
      )}

      {/* Painel técnico com dropdown de veículos */}
      <TechnicalPanelRedesigned
        isOpen={showTechnicalPanel}
        onClose={handleCloseTechnicalPanel}
      />
    </div>
  );
};

export default MaintenanceManagement;
