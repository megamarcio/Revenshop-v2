
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

  // Reset local state when item changes or editing stops
  useEffect(() => {
    if (!isEditing) {
      setName(item.name);
      setStatus(item.status);
      setNextChange(item.next_change || '');
    }
  }, [item, isEditing]);

  const handleSave = () => {
    onUpdate(item.id, { name, status, next_change: nextChange });
    onSave();
  };

  const handleCancel = () => {
    setName(item.name);
    setStatus(item.status);
    setNextChange(item.next_change || '');
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

  return (
    <div className="grid grid-cols-5 gap-4 items-center">
      <div>
        {isEditing ? (
          <Input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="Nome do item"
          />
        ) : (
          <span>{item.name}</span>
        )}
      </div>
      <div>
        {isEditing ? (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
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
          <span>{statusOptions.find(option => option.value === item.status)?.label}</span>
        )}
      </div>
      <div>
        {isEditing ? (
          <Input
            type="date"
            placeholder="Próxima troca"
            value={nextChange}
            onChange={handleNextChangeChange}
          />
        ) : (
          <span>{item.next_change || 'N/A'}</span>
        )}
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => onEdit(item.id)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableItemRow;
