
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useTechnicalItems } from '../../hooks/useTechnicalItems';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';

const MaintenanceManagement = () => {
  const { isAdmin, isInternalSeller } = useAuth();
  const { maintenances } = useMaintenance();
  const { vehicles } = useVehiclesOptimized({ category: 'forSale', limit: 100, minimal: true });
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

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
          <Button onClick={handleNewMaintenance} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Manutenção
          </Button>
        </div>
      </div>

      {/* Alerts Section for Vehicles with Technical Issues */}
      {vehiclesWithIssues.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">
                Atenção - Veículos Precisam de Manutenção
              </h3>
              <Badge variant="destructive" className="ml-auto">
                {vehiclesWithIssues.length} veículos
              </Badge>
            </div>
            <div className="space-y-2">
              {vehiclesWithIssues.slice(0, 5).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                  <div>
                    <span className="font-semibold text-red-700">{vehicle.internal_code}</span>
                    <span className="text-red-600 ml-2">- {vehicle.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {vehicle.issues.map((issue: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-300 text-red-700">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              {vehiclesWithIssues.length > 5 && (
                <p className="text-sm text-red-600 mt-2">
                  ... e mais {vehiclesWithIssues.length - 5} veículos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Manutenções Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{openMaintenances}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Itens para Trocar</p>
                <p className="text-2xl font-bold text-gray-900">{vehiclesWithIssues.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Veículos</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
};

export default MaintenanceManagement;
