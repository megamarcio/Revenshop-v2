
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, LucideIcon } from 'lucide-react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';

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
  const [extraInfo, setExtraInfo] = useState(item.extraInfo || '');
  const [tireBrand, setTireBrand] = useState(item.tireBrand || '');

  // Reset local state when item changes or editing stops
  useEffect(() => {
    if (!isEditing) {
      setStatus(item.status);
      setMiles(item.miles || '');
      setNextChange(item.next_change || '');
      setExtraInfo(item.extraInfo || '');
      setTireBrand(item.tireBrand || '');
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
    
    // Auto-calculate next change for oil
    if (item.type === 'oil' && value) {
      const currentMiles = parseInt(value);
      if (!isNaN(currentMiles)) {
        const nextMiles = currentMiles + 5000;
        setNextChange(nextMiles.toString() + ' miles');
        onUpdate(item.id, { next_change: nextMiles.toString() + ' miles' });
      }
    }
  };

  const handleExtraInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExtraInfo(value);
    onUpdate(item.id, { extraInfo: value });
  };

  const handleTireBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTireBrand(value);
    onUpdate(item.id, { tireBrand: value });
  };

  const handleBatteryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExtraInfo(value);
    onUpdate(item.id, { extraInfo: value });
    
    // Auto-calculate next change for battery (2 years later)
    if (value) {
      const currentDate = new Date(value);
      const nextDate = new Date(currentDate);
      nextDate.setFullYear(currentDate.getFullYear() + 2);
      const formattedNextDate = nextDate.toISOString().split('T')[0];
      setNextChange(formattedNextDate);
      onUpdate(item.id, { next_change: formattedNextDate });
    }
  };

  const handleSave = () => {
    onSave();
  };

  const handleCancel = () => {
    // Reset to original values
    setStatus(item.status);
    setMiles(item.miles || '');
    setNextChange(item.next_change || '');
    setExtraInfo(item.extraInfo || '');
    setTireBrand(item.tireBrand || '');
    onCancel();
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

  const renderSpecificFields = () => {
    if (item.type === 'oil') {
      return (
        <>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Milhas Atual
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={miles}
                onChange={handleMilesChange}
                placeholder="Ex: 50000"
                className="text-sm"
              />
            ) : (
              <span className="text-sm">{miles || 'N/A'} miles</span>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Próxima Troca
            </label>
            <span className="text-sm">{nextChange || 'N/A'}</span>
          </div>
        </>
      );
    }

    if (item.type === 'battery') {
      return (
        <>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Data Atual da Bateria
            </label>
            {isEditing ? (
              <Input
                type="date"
                value={extraInfo}
                onChange={handleBatteryDateChange}
                className="text-sm"
              />
            ) : (
              <span className="text-sm">{extraInfo || 'N/A'}</span>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Próxima Troca
            </label>
            <span className="text-sm">{nextChange || 'N/A'}</span>
          </div>
        </>
      );
    }

    if (item.type === 'tires') {
      return (
        <>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Tamanho do Pneu
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={tireBrand}
                onChange={handleTireBrandChange}
                placeholder="Ex: 235/75 R17"
                className="text-sm"
              />
            ) : (
              <span className="text-sm">{tireBrand || 'N/A'}</span>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-700 block mb-1">
              Milhas
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={miles}
                onChange={handleMilesChange}
                placeholder="Ex: 50000"
                className="text-sm"
              />
            ) : (
              <span className="text-sm">{miles || 'N/A'} miles</span>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-gray-100">
              <Icon className="h-3 w-3 text-gray-600" />
            </div>
            <span className="text-sm">{title}</span>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => onEdit(item.id)} className="h-6 px-2 text-xs">
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div>
          <label className="text-xs text-gray-700 block mb-1">Status</label>
          {isEditing ? (
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Selecione o status" />
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

        {renderSpecificFields()}

        {isEditing && (
          <div className="flex justify-end gap-1 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 px-2 text-xs">
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
              <Save className="h-3 w-3 mr-1" />
              Salvar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MainItemCard;
