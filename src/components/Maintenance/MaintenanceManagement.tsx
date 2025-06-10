
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Wrench, Settings, Search } from 'lucide-react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import TechnicalPanelRedesigned from './TechnicalPanel/TechnicalPanelRedesigned';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(false);
  const [selectedVehicleForPanel, setSelectedVehicleForPanel] = useState<string>('all');
  const [vehicleCodeFilter, setVehicleCodeFilter] = useState('');

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

  // Filtrar veículos por código interno
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicleCodeFilter === '' || 
    vehicle.internal_code?.toLowerCase().includes(vehicleCodeFilter.toLowerCase())
  );

  // Calcular estatísticas dos dados reais
  const openMaintenances = maintenances.filter(m => {
    const today = new Date();
    const repairDate = m.repair_date ? new Date(m.repair_date) : null;
    const promisedDate = m.promised_date ? new Date(m.promised_date) : null;
    
    // Em aberto: sem data prometida e sem data de reparo
    // Pendente: com data prometida mas sem data de reparo
    return !repairDate && (!promisedDate || promisedDate >= today);
  }).length;

  const totalCost = maintenances.reduce((sum, m) => sum + m.total_amount, 0);

  const selectedVehicle = vehicles.find(v => v.id === (selectedVehicleForPanel === 'all' ? '' : selectedVehicleForPanel));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Manutenção</h1>
          <p className="text-gray-600">Gerenciar manutenções e reparos dos veículos</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{maintenances.length} manutenções cadastradas</span>
            <span>{openMaintenances} em aberto/pendentes</span>
            <span>R$ {totalCost.toFixed(2).replace('.', ',')} em custos</span>
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

      {/* Filtros para Painel Técnico */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filtros do Painel Técnico:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={selectedVehicleForPanel} onValueChange={setSelectedVehicleForPanel}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os veículos</SelectItem>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.internal_code} - {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Filtrar por código interno"
                value={vehicleCodeFilter}
                onChange={(e) => setVehicleCodeFilter(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <MaintenanceList 
        onEdit={handleEditMaintenance}
      />

      {showForm && (
        <MaintenanceForm
          onClose={handleCloseForm}
          editingMaintenance={editingMaintenance}
        />
      )}

      {showTechnicalPanel && (
        <TechnicalPanelRedesigned
          isOpen={showTechnicalPanel}
          onClose={() => setShowTechnicalPanel(false)}
          vehicleId={selectedVehicleForPanel === 'all' ? undefined : selectedVehicleForPanel}
          vehicleName={selectedVehicle?.name || "Painel Geral"}
        />
      )}
    </div>
  );
};

export default MaintenanceManagement;
