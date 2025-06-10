
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, Settings } from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import TechnicalPanelRedesigned from './TechnicalPanel/TechnicalPanelRedesigned';
import { useMaintenance } from '../../hooks/useMaintenance/index';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
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

  const handleOpenTechnicalPanel = () => {
    setShowTechnicalPanel(true);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Manutenção</h1>
          <p className="text-gray-600">Gerenciar manutenções e reparos dos veículos</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{maintenances.length} manutenções cadastradas</span>
            <span>{openMaintenances} em aberto/pendentes</span>
            <span>$ {totalCost.toFixed(2)} em custos</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleOpenTechnicalPanel} 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Painel Técnico
          </Button>
          <Button onClick={handleNewMaintenance} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Manutenção
          </Button>
        </div>
      </div>

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

      {showTechnicalPanel && (
        <TechnicalPanelRedesigned
          isOpen={showTechnicalPanel}
          onClose={() => setShowTechnicalPanel(false)}
          vehicleId={undefined} // Let user select vehicle inside modal
          vehicleName={undefined}
        />
      )}
    </div>
  );
};

export default MaintenanceManagement;
