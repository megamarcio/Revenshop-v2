
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings2, Droplets, Zap, Filter, Target, Disc, Wrench } from 'lucide-react';
import { TechnicalItem, TechnicalPanelModalProps } from './TechnicalPanel/types';
import { groupItemsByType } from './TechnicalPanel/utils';
import { defaultTechnicalItems } from './TechnicalPanel/data';
import AlertSection from './TechnicalPanel/AlertSection';
import CompactTechnicalRow from './TechnicalPanel/CompactTechnicalRow';

const TechnicalPanelModal = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelModalProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [items, setItems] = useState<TechnicalItem[]>(defaultTechnicalItems);

  // Prevenir fechamento automático do modal pai
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        event.stopPropagation();
      };

      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const updateItem = (itemId: string, updates: Partial<TechnicalItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const trocarItems = items.filter(item => item.status === 'trocar');
  const proximoTrocaItems = items.filter(item => item.status === 'proximo-troca');
  const groupedItems = groupItemsByType(items);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-revenshop-primary" />
            Painel Técnico - {vehicleName || 'Veículo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <AlertSection 
            trocarItems={trocarItems}
            proximoTrocaItems={proximoTrocaItems}
          />

          <div className="space-y-2">
            <CompactTechnicalRow
              title="Óleo do Motor"
              icon={Droplets}
              items={groupedItems.oil}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
              isHighlight={true}
            />

            <CompactTechnicalRow
              title="Sistema Elétrico"
              icon={Zap}
              items={groupedItems.electrical}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Filtros e Limpeza"
              icon={Filter}
              items={groupedItems.filter}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Suspensão e Direção"
              icon={Target}
              items={groupedItems.suspension}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Sistema de Freios"
              icon={Disc}
              items={groupedItems.brakes}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Fluidos"
              icon={Droplets}
              items={groupedItems.fluids}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Tune Up"
              icon={Zap}
              items={groupedItems.tuneup}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
            />

            <CompactTechnicalRow
              title="Pneus"
              icon={Target}
              items={groupedItems.tires}
              editingItem={editingItem}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onUpdate={updateItem}
              isHighlight={true}
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelModal;
