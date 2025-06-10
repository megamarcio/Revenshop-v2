
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { TechnicalItem } from '../../hooks/useTechnicalItems';
import EditableItemRow from './EditableItemRow';

interface TechnicalSectionProps {
  title: string;
  icon: LucideIcon;
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  isHighlight?: boolean;
  className?: string;
}

const TechnicalSection = ({ 
  title, 
  icon: Icon, 
  items, 
  editingItem, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate,
  isHighlight = false,
  className = ""
}: TechnicalSectionProps) => {
  const alertCount = items.filter(item => 
    item.status === 'trocar' || item.status === 'proximo-troca'
  ).length;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center justify-between ${isHighlight ? 'text-lg text-orange-700' : 'text-base'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isHighlight ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <Icon className={`h-4 w-4 ${isHighlight ? 'text-orange-600' : 'text-gray-600'}`} />
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
      <CardContent className="space-y-3">
        {items.map(item => (
          <EditableItemRow
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

export default TechnicalSection;
