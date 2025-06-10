
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { TechnicalItem } from '../../hooks/useTechnicalItems';
import CompactTechnicalRow from './CompactTechnicalRow';

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const CategorySection = ({ 
  title, 
  icon: Icon, 
  items, 
  editingItem, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate 
}: CategorySectionProps) => {
  const alertCount = items.filter(item => 
    item.status === 'trocar' || item.status === 'proximo-troca'
  ).length;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-gray-100">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <span>{title}</span>
          </div>
          {alertCount > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5">
              {alertCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map(item => (
          <CompactTechnicalRow
            key={item.id}
            item={item}
            isEditing={editingItem === item.id}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onUpdate={onUpdate}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Nenhum item cadastrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySection;
