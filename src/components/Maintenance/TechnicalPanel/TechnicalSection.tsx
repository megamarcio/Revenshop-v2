
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechnicalSectionProps } from './types';
import EditableItemRow from './EditableItemRow';

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
  const cardClassName = isHighlight 
    ? "border-revenshop-primary border-2 lg:col-span-2" 
    : "";

  return (
    <Card className={`${cardClassName} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 ${isHighlight ? 'text-lg text-revenshop-primary' : 'text-base'}`}>
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
      </CardContent>
    </Card>
  );
};

export default TechnicalSection;
