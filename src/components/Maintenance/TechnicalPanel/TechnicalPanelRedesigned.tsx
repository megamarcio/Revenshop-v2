
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';
import NoVehicleSelected from './NoVehicleSelected';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';

interface TechnicalPanelRedesignedProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelRedesigned = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelRedesignedProps) => {
  const { items, loading, updateItem, createDefaultItems, refresh } = useTechnicalItems(vehicleId);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Se não há veículo selecionado, mostrar componente específico
  if (!vehicleId) {
    return <NoVehicleSelected isOpen={isOpen} onClose={onClose} />;
  }

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: any) => {
    updateItem(itemId, updates);
  };

  const handleUpdateAndExit = async () => {
    await refresh();
    onClose();
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Wrench className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">Painel Técnico</div>
                <div className="text-sm text-gray-600 font-normal">
                  {vehicleName || 'Veículo'}
                </div>
              </div>
            </DialogTitle>
            <Button
              onClick={handleUpdateAndExit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Atualizar e Sair
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Button onClick={createDefaultItems} className="bg-blue-600 hover:bg-blue-700">
                Criar Itens Padrão
              </Button>
            </div>
          ) : (
            <>
              <MainItemsSection
                items={items}
                editingItem={editingItem}
                onEdit={handleEdit}
                onSave={handleSave}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
              />
              <OtherItemsSection items={items} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelRedesigned;
