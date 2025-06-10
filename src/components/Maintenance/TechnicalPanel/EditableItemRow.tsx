
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, Trash2 } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';

interface EditableItemRowProps {
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  onDelete?: (itemId: string) => void;
}

const EditableItemRow = ({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onDelete
}: EditableItemRowProps) => {
  const [status, setStatus] = useState(item.status);
  const [nextChange, setNextChange] = useState(item.next_change || '');
  const [miles, setMiles] = useState(item.miles || '');

  useEffect(() => {
    if (!isEditing) {
      setStatus(item.status);
      setNextChange(item.next_change || '');
      setMiles(item.miles || '');
    }
  }, [item, isEditing]);

  const handleStatusChange = (value: string) => {
    const validStatus = value as 'em-dia' | 'proximo-troca' | 'trocar';
    setStatus(validStatus);
    onUpdate(item.id, { status: validStatus });
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

  const handleSave = () => {
    onUpdate(item.id, {
      status,
      next_change: nextChange,
      miles
    });
    onSave();
  };

  const handleCancel = () => {
    setStatus(item.status);
    setNextChange(item.next_change || '');
    setMiles(item.miles || '');
    onCancel();
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
      onDelete?.(item.id);
    }
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
    <div className="grid grid-cols-5 gap-3 items-center py-3">
      <div className="text-sm font-medium text-gray-900">
        {item.name}
      </div>
      
      <div>
        {isEditing ? (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em-dia">Em Dia</SelectItem>
              <SelectItem value="proximo-troca">Próximo da Troca</SelectItem>
              <SelectItem value="trocar">Trocar</SelectItem>
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
            value={nextChange}
            onChange={handleNextChangeChange}
            className="text-xs"
          />
        ) : (
          <span className="text-sm text-gray-600">{nextChange || 'N/A'}</span>
        )}
      </div>
      
      <div>
        {isEditing ? (
          <Input
            type="text"
            value={miles}
            onChange={handleMilesChange}
            placeholder="Ex: 50000"
            className="text-xs"
          />
        ) : (
          <span className="text-sm text-gray-600">{miles || 'N/A'}</span>
        )}
      </div>
      
      <div className="flex justify-end gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 px-2 text-xs">
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              <Save className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} className="h-6 px-2 text-xs">
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete} 
              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableItemRow;
