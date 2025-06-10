
import React from 'react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import EditableItemRow from './EditableItemRow';

interface OtherItemsSectionProps {
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const OtherItemsSection = ({
  items,
  editingItem,
  onEdit,
  onSave,
  onCancel,
  onUpdate
}: OtherItemsSectionProps) => {
  // Filter out the main items (oil, battery, tires) to show only "other" items
  const mainItemTypes = ['oil', 'battery', 'tires'];
  const mainItemSearchTerms = ['oil', 'óleo', 'motor', 'troca', 'battery', 'bateria', 'tire', 'pneu', 'tamanho', 'wheel', 'roda'];
  
  const otherItems = items.filter(item => {
    // Exclude if it's a main item type
    if (mainItemTypes.includes(item.type)) return false;
    
    // Exclude if the name contains main item search terms
    const containsMainTerms = mainItemSearchTerms.some(term => 
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    
    return !containsMainTerms;
  });

  if (otherItems.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Outros Itens</h2>
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">Nenhum outro item encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Outros Itens</h2>
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherItemsSection;
