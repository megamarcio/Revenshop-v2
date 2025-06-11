
import React, { useState, useMemo } from 'react';
import VehicleList from './VehicleList';
import VehicleForm from './VehicleForm';
import VehicleListHeader from './VehicleListHeader';
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

  // Use ultra minimal hook for list display with automatic refresh
  const { 
    data: ultraMinimalVehicles, 
    isLoading: isLoadingList, 
    error: listError,
    refetch: refetchList
  } = useVehiclesUltraMinimal();

  // Use full hook for CRUD operations
  const { 
    addVehicle, 
    updateVehicle, 
    deleteVehicle, 
    isLoading: isSaving 
  } = useVehicles();

  // Convert data using the mapper
  const { convertedVehiclesForCards, convertCardTypeToHookType } = useMemo(() => {
    if (!ultraMinimalVehicles) return { convertedVehiclesForCards: [], convertCardTypeToHookType: () => [] };
    return VehicleDataMapper.mapVehicleData(ultraMinimalVehicles);
  }, [ultraMinimalVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!convertedVehiclesForCards) return [];
    
    return convertedVehiclesForCards.filter(vehicle => {
      const matchesSearch = !searchTerm || 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [convertedVehiclesForCards, searchTerm, selectedCategory]);

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
        await addVehicle(vehicleData);
      }
      
      // Refresh the list after successful save
      await refetchList();
      
      handleFormClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  };

  if (listError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar veículos: {listError.message}</p>
        <Button onClick={() => refetchList()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleListHeader
        onAddVehicle={handleAddVehicle}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        vehicles={convertCardTypeToHookType(filteredVehicles)}
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

      {isLoadingList ? (
        <div className="text-center py-8">
          <p>Carregando veículos...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <EmptyVehicleState 
          hasVehicles={convertedVehiclesForCards.length > 0}
          onAddVehicle={handleAddVehicle}
        />
      ) : (
        <VehicleList
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
          onDelete={handleDeleteVehicle}
        />
      )}
    </div>
  );
};

export default VehicleListContainer;
