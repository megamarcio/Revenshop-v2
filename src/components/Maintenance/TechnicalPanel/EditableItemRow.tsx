
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';

interface EditableItemRowProps {
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const statusOptions = [
  { value: 'em-dia', label: 'Em Dia' },
  { value: 'proximo-troca', label: 'Próximo da Troca' },
  { value: 'trocar', label: 'Trocar' },
];

const EditableItemRow = ({ item, isEditing, onEdit, onSave, onCancel, onUpdate }: EditableItemRowProps) => {
  const [name, setName] = useState(item.name);
  const [status, setStatus] = useState(item.status);
  const [nextChange, setNextChange] = useState(item.next_change || '');
  const [miles, setMiles] = useState(item.miles || '');

  // Reset local state when item changes or editing stops
  useEffect(() => {
    if (!isEditing) {
      setName(item.name);
      setStatus(item.status);
      setNextChange(item.next_change || '');
      setMiles(item.miles || '');
    }
  }, [item, isEditing]);

  const handleSave = () => {
    onUpdate(item.id, { name, status, next_change: nextChange, miles });
    onSave();
  };

  const handleCancel = () => {
    setName(item.name);
    setStatus(item.status);
    setNextChange(item.next_change || '');
    setMiles(item.miles || '');
    onCancel();
  };

  const handleStatusChange = (value: string) => {
    const validStatus = value as 'em-dia' | 'proximo-troca' | 'trocar';
    setStatus(validStatus);
    onUpdate(item.id, { status: validStatus });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    onUpdate(item.id, { name: value });
  };

  const handleNextChangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNextChange(value);
    onUpdate(item.id, { next_change: value });
  };

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMiles(value);
    onUpdate(item.id, { miles: value });
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'em-dia': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Em Dia</span>;
      case 'proximo-troca': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Próximo da Troca</span>;
      case 'trocar': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Trocar</span>;
      default: 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 items-center py-2">
      <div>
        {isEditing ? (
          <Input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="Nome do item"
            className="text-sm"
          />
        ) : (
          <span className="text-sm">{item.name}</span>
        )}
      </div>
      <div>
        {isEditing ? (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          getStatusDisplay(item.status)
        )}
      </div>
      <div>
        {isEditing ? (
          <Input
            type="date"
            placeholder="Próxima troca"
            value={nextChange}
            onChange={handleNextChangeChange}
            className="text-sm"
          />
        ) : (
          <span className="text-sm">{item.next_change || 'N/A'}</span>
        )}
      </div>
      <div>
        {isEditing ? (
          <Input
            type="text"
            placeholder="Milhas"
            value={miles}
            onChange={handleMilesChange}
            className="text-sm"
          />
        ) : (
          <span className="text-sm">{item.miles ? `${item.miles} miles` : 'N/A'}</span>
        )}
      </div>
      <div className="flex justify-end gap-1">
        {isEditing ? (
          <>
            <Button size="sm" variant="outline" onClick={handleSave} className="h-6 px-2 text-xs">
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 px-2 text-xs">
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => onEdit(item.id)} className="h-6 px-2 text-xs">
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableItemRow;
