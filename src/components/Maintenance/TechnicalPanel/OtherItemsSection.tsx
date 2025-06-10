
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import EditableItemRow from './EditableItemRow';

interface OtherItemsSectionProps {
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  onAddItem?: (name: string, type: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

const OtherItemsSection = ({
  items,
  editingItem,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onAddItem,
  onDeleteItem
}: OtherItemsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('');

  // Filter out the main items (oil, battery, tires) to show only "other" items
  const mainItemTypes = ['oil', 'electrical', 'tires'];
  const mainItemSearchTerms = ['oil', 'óleo', 'motor', 'troca', 'battery', 'bateria', 'electrical', 'tire', 'pneu', 'tamanho', 'wheel', 'roda'];
  
  const otherItems = items.filter(item => {
    // Exclude if it's a main item type
    if (mainItemTypes.includes(item.type)) return false;
    
    // Exclude if the name contains main item search terms
    const containsMainTerms = mainItemSearchTerms.some(term => 
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    
    return !containsMainTerms;
  });

  const handleAddItem = () => {
    if (newItemName.trim() && newItemType.trim()) {
      onAddItem?.(newItemName.trim(), newItemType.trim());
      setNewItemName('');
      setNewItemType('');
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
    setNewItemName('');
    setNewItemType('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Outros Itens</h2>
        <Button 
          onClick={() => setShowAddForm(true)} 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-blue-900">Adicionar Novo Item</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Nome do item (ex: Filtro de Ar)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Tipo (ex: filter)"
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddItem} size="sm">
              Adicionar
            </Button>
            <Button onClick={handleCancelAdd} variant="outline" size="sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {otherItems.length === 0 && !showAddForm ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">Nenhum outro item encontrado</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-3 items-center p-3 bg-gray-50 border-b font-medium text-xs text-gray-700">
            <div>Nome do Item</div>
            <div>Status</div>
            <div>Próxima Troca</div>
            <div>Milhas</div>
            <div className="text-right">Ações</div>
          </div>
          <div className="divide-y">
            {otherItems.map((item) => (
              <div key={item.id} className="px-3">
                <EditableItemRow
                  item={item}
                  isEditing={editingItem === item.id}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                  onUpdate={onUpdate}
                  onDelete={onDeleteItem}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherItemsSection;
