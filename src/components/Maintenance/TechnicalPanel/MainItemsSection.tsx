
import React from 'react';
import { Droplet, Gauge, Battery } from 'lucide-react';
import MainItemCard from './MainItemCard';
import { TechnicalItem } from './types';

interface MainItemsSectionProps {
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  onCancel: () => void;
}

const MainItemsSection = ({ 
  items, 
  editingItem, 
  onEdit, 
  onSave, 
  onUpdate, 
  onCancel 
}: MainItemsSectionProps) => {
  // Encontrar itens principais
  const oilItem = items.find(item => item.type === 'oil' && item.name.includes('Óleo'));
  const tireItem = items.find(item => item.type === 'tires');
  const batteryItem = items.find(item => item.type === 'electrical' && item.name.includes('Bateria'));

  const renderMainItem = (item: TechnicalItem | undefined, icon: React.ReactNode, title: string) => {
    if (!item) return null;

    return (
      <MainItemCard
        key={item.id}
        item={item}
        icon={icon}
        title={title}
        isEditing={editingItem === item.id}
        onEdit={onEdit}
        onSave={onSave}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Itens Principais</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderMainItem(oilItem, <Droplet className="h-6 w-6 text-blue-600" />, 'Óleo do Motor')}
        {renderMainItem(tireItem, <Gauge className="h-6 w-6 text-blue-600" />, 'Pneus')}
        {renderMainItem(batteryItem, <Battery className="h-6 w-6 text-blue-600" />, 'Bateria')}
      </div>
    </div>
  );
};

export default MainItemsSection;
