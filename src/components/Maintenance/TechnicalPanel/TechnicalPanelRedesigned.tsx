
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';
import TechnicalPanelHeader from './TechnicalPanelHeader';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';
import LoadingTechnicalState from './LoadingTechnicalState';
import EmptyTechnicalState from './EmptyTechnicalState';
import VehicleSelector from './VehicleSelector';

interface TechnicalPanelRedesignedProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelRedesigned = ({
  isOpen,
  onClose,
  vehicleId: initialVehicleId,
  vehicleName: initialVehicleName
}: TechnicalPanelRedesignedProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(initialVehicleId);
  const [selectedVehicleName, setSelectedVehicleName] = useState<string | undefined>(initialVehicleName);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  
  const {
    items,
    isLoading,
    refetch,
    createDefaultItems,
    updateItem,
    createItem,
    deleteItem,
    isCreatingDefaultItems
  } = useTechnicalItems(selectedVehicleId);

  const handleEdit = useCallback((itemId: string) => {
    setEditingItem(itemId);
  }, []);

  const handleSave = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleUpdate = useCallback((itemId: string, updates: any) => {
    updateItem({ itemId, updates });
  }, [updateItem]);

  const handleAddItem = useCallback((name: string, type: string) => {
    if (selectedVehicleId) {
      createItem({ vehicleId: selectedVehicleId, name, type });
    }
  }, [selectedVehicleId, createItem]);

  const handleDeleteItem = useCallback((itemId: string) => {
    deleteItem(itemId);
  }, [deleteItem]);

  const handleCreateDefaults = useCallback(() => {
    if (selectedVehicleId) {
      createDefaultItems(selectedVehicleId);
    }
  }, [selectedVehicleId, createDefaultItems]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleVehicleSelect = (vehicleId: string, vehicleName: string) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicleName(vehicleName);
    setEditingItem(null); // Reset editing state when changing vehicle
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <TechnicalPanelHeader
          vehicleName={selectedVehicleName}
          loading={isLoading}
          itemsCount={items.length}
          onRefresh={handleRefresh}
          onCreateDefaults={handleCreateDefaults}
        />

        <div className="space-y-6 p-1">
          <VehicleSelector
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleVehicleSelect}
          />

          {!selectedVehicleId ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Selecione um veículo para visualizar os itens técnicos.
              </p>
            </div>
          ) : isLoading ? (
            <LoadingTechnicalState />
          ) : items.length === 0 ? (
            <EmptyTechnicalState 
              onCreateDefaults={handleCreateDefaults}
            />
          ) : (
            <>
              <MainItemsSection
                items={items}
                editingItem={editingItem}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
              />

              <OtherItemsSection
                items={items}
                editingItem={editingItem}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelRedesigned;
