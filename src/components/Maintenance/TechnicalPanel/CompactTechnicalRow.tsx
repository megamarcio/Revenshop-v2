
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TechnicalSectionProps } from './types';
import EditableItemRow from './EditableItemRow';

const CompactTechnicalRow = ({ 
  title, 
  icon: Icon, 
  items, 
  editingItem, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate,
  isHighlight = false
}: TechnicalSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Contar itens que precisam de atenção
  const alertCount = items.filter(item => item.status === 'trocar' || item.status === 'proximo-troca').length;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full justify-between p-3 h-auto border rounded-lg hover:bg-gray-50 ${
            isHighlight ? 'border-revenshop-primary bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 ${isHighlight ? 'text-revenshop-primary' : 'text-gray-600'}`} />
            <span className={`font-medium ${isHighlight ? 'text-revenshop-primary' : ''}`}>
              {title}
            </span>
            <span className="text-sm text-gray-500">({items.length} itens)</span>
            {alertCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {alertCount} atenção
              </span>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
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
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CompactTechnicalRow;
