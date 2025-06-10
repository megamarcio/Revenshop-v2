
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { TechnicalItem } from '../../hooks/useTechnicalItems';

interface CompactTechnicalRowProps {
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'em-dia':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'proximo-troca':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'trocar':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const CompactTechnicalRow = ({ 
  item, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate 
}: CompactTechnicalRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 p-2 border rounded hover:bg-gray-50 items-center text-sm">
      {/* Nome */}
      <div className="col-span-4 flex items-center gap-2 min-w-0">
        <Wrench className="h-3 w-3 text-gray-500 flex-shrink-0" />
        <span className="font-medium truncate">{item.name}</span>
      </div>
      
      {/* Dados */}
      <div className="col-span-5">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={item.month || ''}
              onChange={(e) => onUpdate(item.id, { month: e.target.value })}
              placeholder="MM"
              className="w-10 h-7 text-xs"
              maxLength={2}
            />
            <span className="text-xs">/</span>
            <Input
              type="text"
              value={item.year || ''}
              onChange={(e) => onUpdate(item.id, { year: e.target.value })}
              placeholder="YYYY"
              className="w-14 h-7 text-xs"
              maxLength={4}
            />
            {item.miles !== undefined && (
              <Input
                type="text"
                value={item.miles || ''}
                onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                placeholder="mi"
                className="w-12 h-7 text-xs"
              />
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-600">
            {item.month && item.year ? `${item.month}/${item.year}` : 'Não informado'}
            {item.miles && ` - ${item.miles} mi`}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="col-span-2">
        <Select
          value={item.status}
          onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
            onUpdate(item.id, { status: value })
          }
        >
          <SelectTrigger className={`h-7 text-xs ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-1">
              {item.status === 'em-dia' && <CheckCircle className="h-3 w-3" />}
              {item.status === 'proximo-troca' && <Clock className="h-3 w-3" />}
              {item.status === 'trocar' && <AlertTriangle className="h-3 w-3" />}
              <span className="truncate">
                {item.status === 'em-dia' && 'OK'}
                {item.status === 'proximo-troca' && 'Próx'}
                {item.status === 'trocar' && 'Troca'}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="em-dia">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Em Dia
              </div>
            </SelectItem>
            <SelectItem value="proximo-troca">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-yellow-600" />
                Próximo
              </div>
            </SelectItem>
            <SelectItem value="trocar">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                Trocar
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ações */}
      <div className="col-span-1 flex justify-end">
        {isEditing ? (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onSave} className="h-7 w-7 p-0">
              <Save className="h-3 w-3 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 w-7 p-0">
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(item.id)}
            className="h-7 w-7 p-0"
          >
            <Edit2 className="h-3 w-3 text-gray-600" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompactTechnicalRow;
