
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';
import TechnicalPanelHeader from './TechnicalPanelHeader';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';
import LoadingTechnicalState from './LoadingTechnicalState';
import EmptyTechnicalState from './EmptyTechnicalState';
import NoVehicleSelected from './NoVehicleSelected';

interface TechnicalPanelRedesignedProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelRedesigned = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleName
}: TechnicalPanelRedesignedProps) => {
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
  } = useTechnicalItems(vehicleId || undefined);

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: any) => {
    updateItem({ itemId, updates });
  };

  const handleAddItem = (name: string, type: string) => {
    if (vehicleId) {
      createItem({ vehicleId, name, type });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
  };

  const handleCreateDefaults = () => {
    if (vehicleId) {
      createDefaultItems(vehicleId);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!vehicleId) {
    return (
      <NoVehicleSelected 
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <TechnicalPanelHeader
          vehicleName={vehicleName}
          loading={isLoading}
          itemsCount={items.length}
          onRefresh={handleRefresh}
          onCreateDefaults={handleCreateDefaults}
        />

        <div className="space-y-6 p-1">
          {isLoading ? (
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
