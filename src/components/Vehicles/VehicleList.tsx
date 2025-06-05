
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleControls from './VehicleControls';
import VehicleSearchBar from './VehicleSearchBar';
import EmptyVehicleState from './EmptyVehicleState';
import VehicleViewModal from './VehicleViewModal';
import VehicleListView from './VehicleListView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Grid, List, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VehicleList = () => {
  const { t } = useLanguage();
  const { canEditVehicles, user } = useAuth();
  const { vehicles, loading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [viewingVehicle, setViewingVehicle] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.internal_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || vehicle.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateVehicle = async (vehicleData: any) => {
    const success = await createVehicle(vehicleData);
    if (success) {
      setIsFormOpen(false);
    }
  };

  const handleUpdateVehicle = async (vehicleData: any) => {
    if (!editingVehicle) return;
    
    const success = await updateVehicle(editingVehicle.id, vehicleData);
    if (success) {
      setEditingVehicle(null);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteVehicle(vehicleId);
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
  };

  const handleViewVehicle = (vehicle: any) => {
    setViewingVehicle(vehicle);
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['Nome', 'Modelo', 'Ano', 'VIN', 'Código Interno', 'Milhas', 'Preço Venda', 'Status'].join(','),
        ...filteredVehicles.map(vehicle => [
          vehicle.name,
          vehicle.model,
          vehicle.year,
          vehicle.vin,
          vehicle.internal_code,
          vehicle.miles,
          vehicle.sale_price,
          vehicle.category === 'forSale' ? 'À Venda' : 'Vendido'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'veiculos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: 'Sucesso',
        description: 'Lista de veículos exportada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao exportar lista de veículos.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <VehicleListHeader 
        onAddVehicle={() => setIsFormOpen(true)}
        totalVehicles={vehicles.length}
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <VehicleSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="flex items-center space-x-2">
          <VehicleControls 
            onCategoryChange={setCategoryFilter} 
          />
          <Button
            variant="outline"
            onClick={handleExport}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <EmptyVehicleState 
          hasVehicles={vehicles.length > 0}
          searchTerm={searchTerm}
          onAddVehicle={() => setIsFormOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={canEditVehicles ? handleEditVehicle : undefined}
              onDelete={canEditVehicles ? handleDeleteVehicle : undefined}
              onView={!canEditVehicles ? handleViewVehicle : undefined}
              showCostInfo={canEditVehicles}
            />
          ))}
        </div>
      ) : (
        <VehicleListView
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          onEdit={canEditVehicles ? handleEditVehicle : undefined}
          onDelete={canEditVehicles ? handleDeleteVehicle : undefined}
          onView={!canEditVehicles ? handleViewVehicle : undefined}
          showCostInfo={canEditVehicles}
        />
      )}

      {/* Dialog para adicionar veículo */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('addVehicle')}</DialogTitle>
          </DialogHeader>
          <VehicleForm onSubmit={handleCreateVehicle} />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar veículo */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editVehicle')}</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <VehicleForm 
              initialData={editingVehicle} 
              onSubmit={handleUpdateVehicle} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar veículo (vendedores) */}
      <VehicleViewModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={() => setViewingVehicle(null)}
      />
    </div>
  );
};

export default VehicleList;
