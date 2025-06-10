
import React from 'react';
import { Droplet, Battery, Gauge } from 'lucide-react';
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
  // Define main items mapping - specifically for Oil Change, Battery, and Tire Size
  const mainItemsConfig = [
    { 
      type: 'oil', 
      title: 'Troca de Óleo', 
      icon: Droplet,
      searchTerms: ['oil', 'óleo', 'motor', 'troca', 'oleo']
    },
    { 
      type: 'electrical', 
      title: 'Bateria', 
      icon: Battery,
      searchTerms: ['battery', 'bateria', 'bat', 'electrical']
    },
    { 
      type: 'tires', 
      title: 'Tamanho do Pneu', 
      icon: Gauge,
      searchTerms: ['tire', 'pneu', 'tamanho', 'wheel', 'roda', 'pneus']
    }
  ];

  // Find main items by type or by searching in name
  const findMainItems = () => {
    return mainItemsConfig.map(config => {
      // First try to find by exact type match
      let item = items.find(i => i.type === config.type);
      
      // If not found by type, search by name containing search terms
      if (!item) {
        item = items.find(i => 
          config.searchTerms.some(term => 
            i.name.toLowerCase().includes(term.toLowerCase()) ||
            i.type.toLowerCase().includes(term.toLowerCase())
          )
        );
      }

      return item ? { ...config, item } : null;
    }).filter(Boolean);
  };

  const mainItems = findMainItems();

  console.log('MainItemsSection - Total items:', items.length);
  console.log('MainItemsSection - Found main items:', mainItems.length);
  console.log('MainItemsSection - Main items data:', mainItems);

  if (mainItems.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Itens Principais</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum item principal encontrado</p>
          <p className="text-sm text-gray-400 mt-2">
            Itens procurados: Troca de Óleo, Bateria, Tamanho do Pneu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Itens Principais</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mainItems.map(({ item, title, icon }) => (
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
        ))}
      </div>
    </div>
  );
};

export default MainItemsSection;
