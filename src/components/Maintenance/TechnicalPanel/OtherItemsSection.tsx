
import React from 'react';
import { Filter, Wrench, Settings, Droplets } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import CategorySection from './CategorySection';

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
  const categories = [
    { key: 'filter', title: 'Filtros', icon: Filter },
    { key: 'suspension', title: 'Suspensão', icon: Wrench },
    { key: 'tuneup', title: 'Tune-up', icon: Settings },
    { key: 'fluids', title: 'Fluidos', icon: Droplets }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Outros Itens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(({ key, title, icon }) => {
          const categoryItems = items.filter(item => item.type === key);
          if (categoryItems.length === 0) return null;

          return (
            <CategorySection
              key={key}
              title={title}
              icon={icon}
              items={categoryItems}
              editingItem={editingItem}
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

export default OtherItemsSection;
