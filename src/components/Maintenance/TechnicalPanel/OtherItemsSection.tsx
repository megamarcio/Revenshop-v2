
import React from 'react';
import { Filter, Disc3, Car, Droplet, Wrench } from 'lucide-react';
import CategorySection from './CategorySection';
import { TechnicalItem } from './types';

interface OtherItemsSectionProps {
  items: TechnicalItem[];
}

const OtherItemsSection = ({ items }: OtherItemsSectionProps) => {
  // Filtrar itens principais
  const oilItem = items.find(item => item.type === 'oil' && item.name.includes('Óleo'));
  const tireItem = items.find(item => item.type === 'tires');
  const batteryItem = items.find(item => item.type === 'electrical' && item.name.includes('Bateria'));

  const otherItems = items.filter(item => 
    item.id !== oilItem?.id && 
    item.id !== tireItem?.id && 
    item.id !== batteryItem?.id
  );

  const categories = {
    filter: { name: 'Filtros', icon: Filter, items: [] as TechnicalItem[] },
    brakes: { name: 'Freios', icon: Disc3, items: [] as TechnicalItem[] },
    suspension: { name: 'Suspensão', icon: Car, items: [] as TechnicalItem[] },
    fluids: { name: 'Fluidos', icon: Droplet, items: [] as TechnicalItem[] },
    other: { name: 'Outros', icon: Wrench, items: [] as TechnicalItem[] }
  };

  otherItems.forEach(item => {
    const category = categories[item.type as keyof typeof categories] || categories.other;
    category.items.push(item);
  });

  const categoriesWithItems = Object.entries(categories).filter(([, category]) => category.items.length > 0);

  if (categoriesWithItems.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Outros Itens</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {categoriesWithItems.map(([key, category]) => (
          <CategorySection
            key={key}
            categoryName={category.name}
            CategoryIcon={category.icon}
            items={category.items}
          />
        ))}
      </div>
    </div>
  );
};

export default OtherItemsSection;
