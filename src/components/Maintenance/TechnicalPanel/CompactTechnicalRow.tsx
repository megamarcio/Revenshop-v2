
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
  const [isOpen, setIsOpen] = useState(isHighlight);
  
  // Contar itens que precisam de atenção
  const alertCount = items.filter(item => item.status === 'trocar' || item.status === 'proximo-troca').length;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full justify-between p-4 h-auto border rounded-lg hover:bg-gray-50 transition-colors ${
            isHighlight ? 'border-revenshop-primary bg-blue-50 border-2' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${isHighlight ? 'text-revenshop-primary' : 'text-gray-600'}`} />
            <span className={`font-semibold text-base ${isHighlight ? 'text-revenshop-primary' : 'text-gray-800'}`}>
              {title}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {items.length}
            </span>
            {alertCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {alertCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div className="bg-white border rounded-lg p-2 ml-2 border-l-4 border-l-gray-200">
          {/* Header das colunas */}
          <div className="grid grid-cols-12 gap-2 p-2 text-xs font-medium text-gray-500 border-b mb-2">
            <div className="col-span-3">Item</div>
            <div className="col-span-5">Dados / Próxima Troca</div>
            <div className="col-span-4">Status / Ações</div>
          </div>
          
          <div className="space-y-1">
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
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CompactTechnicalRow;
