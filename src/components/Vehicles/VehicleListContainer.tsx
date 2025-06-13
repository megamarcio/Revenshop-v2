import React, { useState, useMemo } from 'react';
import VehicleGridView from './VehicleGridView';
import VehicleListView from './VehicleListView';
import VehicleForm from './VehicleForm';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import EmptyVehicleState from './EmptyVehicleState';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehiclesUltraMinimal } from '../../hooks/useVehiclesUltraMinimal';
import { VehicleDataMapper } from './VehicleDataMapper';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';
import { Vehicle as HookVehicle } from '../../hooks/useVehicles/types';

interface VehicleListContainerProps {
  onNavigateToCustomers?: () => void;
}

const VehicleListContainer = ({ onNavigateToCustomers }: VehicleListContainerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internalCode');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState('all');

  // Use ultra minimal hook for list display with automatic refresh
  const { 
    vehicles: ultraMinimalVehicles, 
    loading: isLoadingList, 
    refetch: refetchList
  } = useVehiclesUltraMinimal();

  // Use full hook for CRUD operations
  const { 
    createVehicle, 
    updateVehicle, 
    deleteVehicle, 
    loading: isSaving 
  } = useVehicles();

  // Convert data using the mapper
  const { convertedVehiclesForCards, convertCardTypeToHookType } = useMemo(() => {
    if (!ultraMinimalVehicles) return { convertedVehiclesForCards: [], convertCardTypeToHookType: () => [] };
    return VehicleDataMapper.mapVehicleData(ultraMinimalVehicles);
  }, [ultraMinimalVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!convertedVehiclesForCards) return [];
    
    let filtered = convertedVehiclesForCards.filter(vehicle => {
      const matchesSearch = !searchTerm || 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
      const matchesFilter = filterBy === 'all' || vehicle.category === filterBy;
      
      return matchesSearch && matchesCategory && matchesFilter;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof VehicleCardType];
      let bValue = b[sortBy as keyof VehicleCardType];
      
      // Tratamento especial para código interno (remover # se existir e converter para número)
      if (sortBy === 'internalCode') {
        const aCode = typeof aValue === 'string' ? parseInt(aValue.replace('#', '')) || 0 : 0;
        const bCode = typeof bValue === 'string' ? parseInt(bValue.replace('#', '')) || 0 : 0;
        return sortOrder === 'asc' ? aCode - bCode : bCode - aCode;
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [convertedVehiclesForCards, searchTerm, selectedCategory, filterBy, sortBy, sortOrder]);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleCardType) => {
    console.log('VehicleListContainer - Editing vehicle:', vehicle);
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDuplicateVehicle = (vehicle: VehicleCardType) => {
    const duplicatedVehicle = { 
      ...vehicle, 
      id: undefined,
      name: `${vehicle.name} (Cópia)`,
      internalCode: ''
    };
    setEditingVehicle(duplicatedVehicle);
    setIsFormOpen(true);
  };

  const handleDeleteVehicle = async (vehicle: VehicleCardType) => {
    if (vehicle.id) {
      await deleteVehicle(vehicle.id);
      await refetchList();
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleFormSave = async (vehicleData: any) => {
    console.log('VehicleListContainer - Saving vehicle data:', vehicleData);
    
    try {
      if (vehicleData.id) {
        await updateVehicle(vehicleData.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      
      // Refresh the list after successful save
      await refetchList();
      
      handleFormClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  };

  // Function to handle delete from form (receives vehicle ID string)
  const handleFormDelete = async (id: string) => {
    await deleteVehicle(id);
    await refetchList();
    handleFormClose();
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExport = (format: 'csv' | 'xls') => {
    console.log(`Exporting vehicles as ${format}`);
    // Export functionality to be implemented
  };

  // Function to handle import completion
  const handleImportComplete = async () => {
    await refetchList();
  };

  return (
    <div className="space-y-6">
      <VehicleListHeader 
        onAddVehicle={handleAddVehicle}
        onImportComplete={handleImportComplete}
      />

      {onNavigateToCustomers && (
        <Button 
          onClick={onNavigateToCustomers} 
          className="mb-4"
          variant="outline"
        >
          <Users className="mr-2 h-4 w-4" />
          Gerenciar Clientes
        </Button>
      )}

      {/* Search and Controls */}
      <div className="space-y-4">
        <VehicleSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <VehicleControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          onExport={handleExport}
        />
      </div>

      {isLoadingList ? (
        <div className="text-center py-8">
          <p>Carregando veículos...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <EmptyVehicleState />
      ) : viewMode === 'grid' ? (
        <VehicleGridView
          vehicles={filteredVehicles}
          onEdit={handleEditVehicle}
          onDuplicate={handleDuplicateVehicle}
          onDelete={handleDeleteVehicle}
        />
      ) : (
        <VehicleListView
          vehicles={filteredVehicles}
          onEdit={handleEditVehicle}
          onDuplicate={handleDuplicateVehicle}
          onDelete={handleDeleteVehicle}
        />
      )}

      {isFormOpen && (
        <VehicleForm
          onClose={handleFormClose}
          onSave={handleFormSave}
          editingVehicle={editingVehicle}
          onNavigateToCustomers={onNavigateToCustomers}
          onDelete={handleFormDelete}
        />
      )}
    </div>
  );
};

export default VehicleListContainer;
