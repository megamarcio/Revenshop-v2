import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import StatusIcon from './StatusIcon';

interface CompactTechnicalRowProps {
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const CompactTechnicalRow = ({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate
}: CompactTechnicalRowProps) => {
  const [status, setStatus] = useState(item.status);
  const [nextChange, setNextChange] = useState(item.next_change || '');

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onUpdate(item.id, { status: value as 'em-dia' | 'proximo-troca' | 'trocar' });
  };

  const handleNextChangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNextChange(value);
    onUpdate(item.id, { next_change: value });
  };

  return (
    <div className="grid grid-cols-4 items-center gap-2">
      <div className="col-span-1 font-medium">{item.name}</div>
      <div className="col-span-1 text-sm text-gray-500 flex items-center gap-1">
        <StatusIcon status={item.status} />
        {item.status}
      </div>
      <div className="col-span-1 text-sm text-gray-500">{item.next_change}</div>
      <div className="col-span-1 flex justify-end gap-2">
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactTechnicalRow;
