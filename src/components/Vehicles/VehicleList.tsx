
import React from 'react';
import VehicleForm from './VehicleForm';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import { VehicleListContainer } from './VehicleListContainer';
import { VehicleListResults } from './VehicleListResults';
import { VehicleListContent } from './VehicleListContent';
import { VehicleListPagination } from './VehicleListPagination';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const VehicleList = () => {
  return (
    <VehicleListContainer>
      {({
        canEditVehicles,
        searchTerm,
        showAddForm,
        editingVehicle,
        viewMode,
        sortBy,
        sortOrder,
        filterBy,
        vehicles,
        loading,
        currentPage,
        totalPages,
        totalCount,
        setShowAddForm,
        setEditingVehicle,
        setViewMode,
        goToPage,
        handleSaveVehicle,
        handleEditVehicle,
        handleDuplicateVehicle,
        handleDeleteVehicle,
        handleSortChange,
        handleExportData,
        handleSearchChange,
        handleFilterChange
      }) => {
        if (loading && currentPage === 1) {
          return (
            <div className="p-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Carregando veículos...</p>
                </CardContent>
              </Card>
            </div>
          );
        }

        return (
          <div className="p-6 space-y-6">
            <VehicleListHeader onAddVehicle={() => setShowAddForm(true)} />
            
            <VehicleSearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />

            <VehicleControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              filterBy={filterBy}
              onFilterChange={handleFilterChange}
              onExport={handleExportData}
            />

            <VehicleListResults
              vehicleCount={vehicles.length}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
            />

            <VehicleListContent
              viewMode={viewMode}
              vehicles={vehicles}
              loading={loading}
              onEdit={handleEditVehicle}
              onDuplicate={handleDuplicateVehicle}
              onDelete={handleDeleteVehicle}
            />

            <VehicleListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />

            {showAddForm && canEditVehicles && (
              <VehicleForm
                onClose={() => {
                  setShowAddForm(false);
                  setEditingVehicle(null);
                }}
                onSave={(vehicleData) => handleSaveVehicle(vehicleData, editingVehicle)}
                editingVehicle={editingVehicle}
              />
            )}
          </div>
        );
      }}
    </VehicleListContainer>
  );
};

export default VehicleList;
