
import React from 'react';
import VehicleForm from './VehicleForm';
import VehicleListHeader from './VehicleListHeader';
import VehicleListFilters from './VehicleListFilters';
import VehicleListContent from './VehicleListContent';
import { useVehicleListLogic } from './VehicleListLogic';
import { useVehicleListActions } from './VehicleListActions';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface VehicleListContainerProps {
  onNavigateToCustomers?: () => void;
}

const VehicleListContainer = ({ onNavigateToCustomers }: VehicleListContainerProps) => {
  const {
    // State
    isFormOpen,
    setIsFormOpen,
    editingVehicle,
    setEditingVehicle,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterBy,
    setFilterBy,
    
    // Data
    filteredVehicles,
    isLoadingList,
    
    // Operations
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetchList,
  } = useVehicleListLogic();

  const {
    handleAddVehicle,
    handleEditVehicle,
    handleDuplicateVehicle,
    handleDeleteVehicle,
    handleFormClose,
    handleFormSave,
    handleFormDelete,
    handleExport,
    handleImportComplete,
  } = useVehicleListActions({
    editingVehicle,
    setEditingVehicle,
    setIsFormOpen,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetchList,
  });

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Função wrapper para handleExport que não recebe parâmetros
  const handleExportWrapper = () => {
    handleExport('csv'); // Definindo csv como formato padrão
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

      <VehicleListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        onExport={handleExportWrapper}
      />

      <VehicleListContent
        isLoading={isLoadingList}
        vehicles={filteredVehicles}
        viewMode={viewMode}
        onEdit={handleEditVehicle}
        onDuplicate={handleDuplicateVehicle}
        onDelete={handleDeleteVehicle}
      />

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
