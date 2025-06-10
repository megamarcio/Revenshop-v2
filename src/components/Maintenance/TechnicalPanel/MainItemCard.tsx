
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, LucideIcon } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import StatusIcon from './StatusIcon';

interface MainItemCardProps {
  title: string;
  icon: LucideIcon;
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const MainItemCard = ({
  title,
  icon: Icon,
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate
}: MainItemCardProps) => {
  const [status, setStatus] = useState(item.status);
  const [miles, setMiles] = useState(item.miles || '');
  const [nextChange, setNextChange] = useState(item.next_change || '');

  // Reset local state when item changes or editing stops
  useEffect(() => {
    if (!isEditing) {
      setStatus(item.status);
      setMiles(item.miles || '');
      setNextChange(item.next_change || '');
    }
  }, [item, isEditing]);

  const handleStatusChange = (value: string) => {
    const validStatus = value as 'em-dia' | 'proximo-troca' | 'trocar';
    setStatus(validStatus);
    onUpdate(item.id, { status: validStatus });
  };

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMiles(value);
    onUpdate(item.id, { miles: value });
  };

  const handleNextChangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNextChange(value);
    onUpdate(item.id, { next_change: value });
  };

  const handleSave = () => {
    onSave();
  };

  const handleCancel = () => {
    // Reset to original values
    setStatus(item.status);
    setMiles(item.miles || '');
    setNextChange(item.next_change || '');
    onCancel();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em-dia': return 'Em Dia';
      case 'proximo-troca': return 'Próximo da Troca';
      case 'trocar': return 'Trocar';
      default: return status;
    }
  };

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
          <StatusIcon status={item.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-gray-700 block mb-1">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em-dia">Em Dia</SelectItem>
                  <SelectItem value="proximo-troca">Próximo da Troca</SelectItem>
                  <SelectItem value="trocar">Trocar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Quilometragem (KM)
              </label>
              <Input
                type="text"
                value={miles}
                onChange={handleMilesChange}
                placeholder="Ex: 50000"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Próxima troca (Data)
              </label>
              <Input
                type="date"
                value={nextChange}
                onChange={handleNextChangeChange}
                placeholder="Data da próxima troca"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-sm text-gray-600">
              Status: <span className="font-medium">{getStatusLabel(item.status)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Quilometragem: <span className="font-medium">{item.miles || 'N/A'}</span>
            </div>
            <div className="text-sm text-gray-600">
              Próxima troca: <span className="font-medium">{item.next_change || 'N/A'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} className="mt-2">
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MainItemCard;
