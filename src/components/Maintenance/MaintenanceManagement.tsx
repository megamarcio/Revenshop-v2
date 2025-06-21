import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import MaintenanceViewModal from './MaintenanceViewModal';
import VehicleSelectionModal from './VehicleSelectionModal';
import TechnicalPanelRedesigned from './TechnicalPanel/TechnicalPanelRedesigned';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import { useVehicleSelectionModal } from '../../hooks/useVehicleSelectionModal';
import UrgentMaintenanceAlert from './components/UrgentMaintenanceAlert';
import MaintenanceStats from './components/MaintenanceStats';
import MaintenanceHeader from './components/MaintenanceHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<{vehicleId: string, vehicleName: string} | null>(null);
  const [reopenDialog, setReopenDialog] = useState<{open: boolean, maintenance: any}>({open: false, maintenance: null});

  const {
    isVehicleSelectionOpen,
    selectedVehicleForTechnical,
    openVehicleSelection,
    closeVehicleSelection,
    handleVehicleSelect,
    closeTechnicalPanel,
  } = useVehicleSelectionModal();

  const maintenanceHook = useMaintenance();

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
    if (maintenanceHook.refresh) {
      maintenanceHook.refresh();
    }
  };

  const handleViewVehicleMaintenance = (vehicleId: string, vehicleName: string) => {
    if (vehicleId && vehicleName) {
      setSelectedVehicleModal({ vehicleId, vehicleName });
    } else {
      // Se não há vehicleId específico, mostrar todas as manutenções urgentes
      // Pode implementar uma visualização especial aqui
    }
  };

  const handleNewMaintenanceWithVehicle = (vehicleId?: string) => {
    setEditingMaintenance(null);
    setShowForm(true);
    if (vehicleId) {
      // O formulário irá receber o preSelectedVehicleId
    }
  };

  const handleCreateNewMaintenance = (vehicleId: string, vehicleName: string) => {
    if (vehicleId && vehicleName) {
      setEditingMaintenance(null);
      setShowForm(true);
      // O formulário irá receber o preSelectedVehicleId
    } else {
      // Se não há vehicleId específico, abrir formulário normal
      setEditingMaintenance(null);
      setShowForm(true);
    }
  };

  const handleReopenMaintenance = (maintenance: any) => {
    setReopenDialog({open: true, maintenance});
  };

  const confirmReopenMaintenance = () => {
    if (reopenDialog.maintenance) {
      // Criar uma cópia da manutenção sem a data de reparo para reabrir
      const reopenedMaintenance = {
        ...reopenDialog.maintenance,
        repair_date: '',
        promised_date: reopenDialog.maintenance.promised_date || null
      };
      setEditingMaintenance(reopenedMaintenance);
      setShowForm(true);
    }
    setReopenDialog({open: false, maintenance: null});
  };

  const cancelReopenMaintenance = () => {
    setReopenDialog({open: false, maintenance: null});
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

  // Forçar atualização quando o componente montar ou quando houver mudanças
  useEffect(() => {
    if (maintenanceHook.refresh) {
      maintenanceHook.refresh();
    }
  }, [maintenanceHook.refresh]);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <MaintenanceHeader
        totalMaintenances={maintenances.length}
        openMaintenances={openMaintenances}
        totalCost={totalCost}
        onNewMaintenance={handleNewMaintenance}
        onOpenTechnicalPanel={openVehicleSelection}
      />

      {/* Alert for urgent maintenances */}
      {urgentMaintenances.length > 0 && (
        <UrgentMaintenanceAlert
          urgentMaintenances={urgentMaintenances}
          onViewDetails={handleViewVehicleMaintenance}
          onCreateNewMaintenance={handleCreateNewMaintenance}
        />
      )}

      <MaintenanceStats
        openMaintenances={openMaintenances}
        vehiclesWithIssues={0} // Removido o sistema anterior
        totalVehicles={vehicles.length}
        technicalItemsCount={0} // Removido o sistema anterior
      />

      <MaintenanceList 
        onEdit={handleEditMaintenance}
        onReopen={handleReopenMaintenance}
      />

      {showForm && (
        <MaintenanceForm
          open={showForm}
          onClose={handleCloseForm}
          editingMaintenance={editingMaintenance}
          preSelectedVehicleId={editingMaintenance?.vehicle_id}
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

      {/* Modal de seleção de veículo para painel técnico */}
      <VehicleSelectionModal
        isOpen={isVehicleSelectionOpen}
        onClose={closeVehicleSelection}
        onSelectVehicle={handleVehicleSelect}
      />

      {/* Painel técnico do veículo selecionado */}
      {selectedVehicleForTechnical && (
        <TechnicalPanelRedesigned
          isOpen={true}
          onClose={closeTechnicalPanel}
          vehicleId={selectedVehicleForTechnical.vehicleId}
          vehicleName={selectedVehicleForTechnical.vehicleName}
        />
      )}

      {/* Modal de confirmação para reabrir manutenção */}
      <AlertDialog open={reopenDialog.open} onOpenChange={() => setReopenDialog({open: false, maintenance: null})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reabrir Manutenção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reabrir a manutenção do veículo{' '}
              <strong>{reopenDialog.maintenance?.vehicle_internal_code} - {reopenDialog.maintenance?.vehicle_name}</strong>?
              <br /><br />
              Esta ação irá:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remover a data de conclusão</li>
                <li>Permitir edição dos valores e serviços</li>
                <li>Marcar a manutenção como "Em Aberto"</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelReopenMaintenance}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReopenMaintenance} className="bg-green-600 hover:bg-green-700">
              Reabrir Manutenção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaintenanceManagement;
