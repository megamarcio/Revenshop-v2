
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { TechnicalItem } from '../../hooks/useTechnicalItems';

const TIRE_BRANDS = [
  'Michelin',
  'Goodyear', 
  'Bridgestone',
  'Continental',
  'Pirelli',
  'Dunlop',
  'Yokohama',
  'Hankook',
  'Cooper',
  'Toyo'
];

interface EditableItemRowProps {
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

const formatDate = (month?: string, year?: string, miles?: string) => {
  const parts = [];
  if (month && year) {
    parts.push(`${month}/${year}`);
  }
  if (miles) {
    parts.push(`${miles} mi`);
  }
  return parts.length > 0 ? parts.join(' - ') : 'Não informado';
};

const EditableItemRow = ({ 
  item, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate 
}: EditableItemRowProps) => {
  const isTire = item.type === 'tires';
  const isTireSize = item.id === 'tire-type';

  return (
    <div className={`grid grid-cols-12 gap-2 p-3 border rounded-lg hover:bg-gray-50 items-center ${
      isTireSize ? 'bg-blue-50 border-blue-300 border-2' : ''
    }`}>
      {/* Ícone e Nome */}
      <div className="col-span-3 flex items-center gap-2 min-w-0">
        <Wrench className="h-4 w-4 text-gray-600 flex-shrink-0" />
        <span className={`text-sm font-medium truncate ${isTireSize ? 'text-blue-800' : ''}`}>
          {item.name}
        </span>
      </div>
      
      {/* Dados */}
      <div className="col-span-5">
        {isEditing ? (
          <div className="flex items-center gap-1">
            {isTireSize ? (
              <>
                <Input
                  type="text"
                  value={item.extraInfo || ''}
                  onChange={(e) => onUpdate(item.id, { extraInfo: e.target.value })}
                  placeholder="Ex: 205/55 R16"
                  className="h-8 text-xs flex-1"
                />
                <Select
                  value={item.tireBrand || ''}
                  onValueChange={(value) => onUpdate(item.id, { tireBrand: value })}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIRE_BRANDS.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  value={item.month || ''}
                  onChange={(e) => onUpdate(item.id, { month: e.target.value })}
                  placeholder="MM"
                  className="w-12 h-8 text-xs"
                  maxLength={2}
                />
                <span className="text-xs">/</span>
                <Input
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => onUpdate(item.id, { year: e.target.value })}
                  placeholder="YYYY"
                  className="w-16 h-8 text-xs"
                  maxLength={4}
                />
                {item.miles !== undefined && (
                  <>
                    <Input
                      type="text"
                      value={item.miles || ''}
                      onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                      placeholder="mi"
                      className="w-16 h-8 text-xs"
                    />
                  </>
                )}
                <Input
                  type="date"
                  value={item.next_change || ''}
                  onChange={(e) => onUpdate(item.id, { next_change: e.target.value })}
                  className="w-32 h-8 text-xs"
                  placeholder="Próxima"
                />
              </>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-700">
            {isTireSize ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-800 text-sm">
                  {item.extraInfo || 'Não informado'}
                </span>
                {item.tireBrand && (
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {item.tireBrand}
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div>{formatDate(item.month, item.year, item.miles)}</div>
                {item.next_change && (
                  <div className="text-gray-500">
                    Próxima: {new Date(item.next_change).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="col-span-3 flex items-center gap-2">
        <Select
          value={item.status}
          onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
            onUpdate(item.id, { status: value })
          }
        >
          <SelectTrigger className={`h-8 text-xs flex-1 ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-1">
              {item.status === 'em-dia' && <CheckCircle className="h-3 w-3" />}
              {item.status === 'proximo-troca' && <Clock className="h-3 w-3" />}
              {item.status === 'trocar' && <AlertTriangle className="h-3 w-3" />}
              <span className="truncate">
                {item.status === 'em-dia' && 'Em Dia'}
                {item.status === 'proximo-troca' && 'Próximo'}
                {item.status === 'trocar' && 'Trocar'}
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

        {/* Botão de Edição */}
        {isEditing ? (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onSave} className="h-8 w-8 p-0">
              <Save className="h-3 w-3 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(item.id)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-3 w-3 text-gray-600" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableItemRow;
