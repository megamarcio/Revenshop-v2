
import React, { useState } from 'react';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';
import TechnicalPanelHeader from './TechnicalPanelHeader';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';
import LoadingTechnicalState from './LoadingTechnicalState';
import EmptyTechnicalState from './EmptyTechnicalState';
import NoVehicleSelected from './NoVehicleSelected';

interface TechnicalPanelRedesignedProps {
  selectedVehicleId: string | null;
  onVehicleChange: (vehicleId: string | null) => void;
  onClose: () => void;
}

const TechnicalPanelRedesigned = ({
  selectedVehicleId,
  onVehicleChange,
  onClose
}: TechnicalPanelRedesignedProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  
  const {
    items,
    isLoading,
    createDefaultItems,
    updateItem,
    createItem,
    deleteItem,
    isCreatingDefaultItems
  } = useTechnicalItems(selectedVehicleId || undefined);

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
    if (selectedVehicleId) {
      createItem({ vehicleId: selectedVehicleId, name, type });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
  };

  if (!selectedVehicleId) {
    return <NoVehicleSelected />;
  }

  if (isLoading) {
    return <LoadingTechnicalState />;
  }

  if (items.length === 0) {
    return (
      <EmptyTechnicalState 
        onCreateDefaults={() => createDefaultItems(selectedVehicleId)}
        isCreating={isCreatingDefaultItems}
      />
    );
  }

  return (
    <div className="space-y-6">
      <TechnicalPanelHeader 
        selectedVehicleId={selectedVehicleId}
        onVehicleChange={onVehicleChange}
        onClose={onClose}
      />

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
    </div>
  );
};

export default TechnicalPanelRedesigned;
