
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles, Vehicle } from '../../hooks/useVehicles/index';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { convertVehicleForCard, handleExport } from './VehicleDataProcessor';
import { useVehicleActions } from './VehicleActions';
import { useVehicleFilters } from './VehicleFilters';

const VehicleList = () => {
  const { canEditVehicles } = useAuth();
  const { vehicles, loading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  const {
    handleSaveVehicle,
    handleEditVehicle,
    handleDuplicateVehicle,
    handleDeleteVehicle
  } = useVehicleActions({
    vehicles,
    canEditVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    onEditingChange: setEditingVehicle,
    onFormToggle: setShowAddForm
  });

  const { filteredAndSortedVehicles } = useVehicleFilters({
    vehicles,
    searchTerm,
    filterBy,
    sortBy,
    sortOrder
  });

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    handleExport(filteredAndSortedVehicles, format);
  };

  if (loading) {
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
        onExport={handleExportData}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredAndSortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={convertVehicleForCard(vehicle)}
              onEdit={() => handleEditVehicle(vehicle)}
              onDuplicate={() => handleDuplicateVehicle(vehicle)}
              onDelete={() => handleDeleteVehicle(vehicle)}
            />
          ))}
        </div>
      ) : (
        <VehicleListView
          vehicles={filteredAndSortedVehicles.map(convertVehicleForCard)}
          onEdit={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleEditVehicle(originalVehicle);
          }}
          onDuplicate={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleDuplicateVehicle(originalVehicle);
          }}
          onDelete={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleDeleteVehicle(originalVehicle);
          }}
        />
      )}

      {filteredAndSortedVehicles.length === 0 && !loading && <EmptyVehicleState />}

      {showAddForm && canEditVehicles && (
        <VehicleForm
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={(vehicleData) => handleSaveVehicle(vehicleData, editingVehicle)}
          onDelete={editingVehicle ? () => handleDeleteVehicle(editingVehicle) : undefined}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
