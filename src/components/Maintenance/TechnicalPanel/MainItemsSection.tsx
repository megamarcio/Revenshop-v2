
import React from 'react';
import { Wrench, Droplets, Zap } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import MainItemCard from './MainItemCard';

interface MainItemsSectionProps {
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const MainItemsSection = ({
  items,
  editingItem,
  onEdit,
  onSave,
  onCancel,
  onUpdate
}: MainItemsSectionProps) => {
  const mainItems = [
    { key: 'oil', title: 'Óleo do Motor', icon: Droplets },
    { key: 'battery', title: 'Bateria', icon: Zap },
    { key: 'brakes', title: 'Freios', icon: Wrench }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Itens Principais</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mainItems.map(({ key, title, icon }) => {
          const item = items.find(i => i.type === key && i.name.toLowerCase().includes(key));
          if (!item) return null;
          
          return (
            <MainItemCard
              key={item.id}
              title={title}
              icon={icon}
              item={item}
              isEditing={editingItem === item.id}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onUpdate={onUpdate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MainItemsSection;
