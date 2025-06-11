
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTechnicalItems, TechnicalItem } from '../../hooks/useTechnicalItems';
import TechnicalPanelHeader from './TechnicalPanel/TechnicalPanelHeader';
import TechnicalPanelContent from './TechnicalPanel/TechnicalPanelContent';

interface TechnicalPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelModal = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelModalProps) => {
  const { items, isLoading, refetch, updateItem, createDefaultItems } = useTechnicalItems(vehicleId);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleEdit = useCallback((itemId: string) => {
    setEditingItem(itemId);
  }, []);

  const handleSave = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleUpdate = useCallback((itemId: string, updates: Partial<TechnicalItem>) => {
    updateItem({ itemId, updates });
  }, [updateItem]);

  const handleCreateDefaults = useCallback(() => {
    if (vehicleId) {
      createDefaultItems(vehicleId);
    }
  }, [vehicleId, createDefaultItems]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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
          <TechnicalPanelContent
            items={items}
            loading={isLoading}
            editingItem={editingItem}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
            onCreateDefaults={handleCreateDefaults}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelModal;
