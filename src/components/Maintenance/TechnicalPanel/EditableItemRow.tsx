
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { EditableItemRowProps, TIRE_BRANDS } from './types';
import { getStatusColor, formatDate } from './utils';
import StatusIcon from './StatusIcon';

const EditableItemRow = ({ 
  item, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdate 
}: EditableItemRowProps) => {
  const Icon = item.icon;
  const isTire = item.type === 'tires';
  const isTireSize = item.id === 'tire-type';

  return (
    <div className={`flex items-center justify-between p-2 border rounded hover:bg-gray-50 ${isTireSize ? 'bg-blue-50 border-blue-200' : ''}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-3 w-3 text-gray-600 flex-shrink-0" />
        <span className={`text-xs font-medium min-w-[80px] ${isTireSize ? 'text-blue-800' : ''}`}>
          {item.name}:
        </span>
        
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {isTireSize ? (
              <>
                <Input
                  type="text"
                  value={item.extraInfo || ''}
                  onChange={(e) => onUpdate(item.id, { extraInfo: e.target.value })}
                  placeholder="Ex: 205/55 R16"
                  className="w-24 h-6 text-xs"
                />
                <Select
                  value={item.tireBrand || ''}
                  onValueChange={(value) => onUpdate(item.id, { tireBrand: value })}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
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
                  value={item.month}
                  onChange={(e) => onUpdate(item.id, { month: e.target.value })}
                  placeholder="MM"
                  className="w-8 h-6 text-xs"
                  maxLength={2}
                />
                <span className="text-xs">/</span>
                <Input
                  type="text"
                  value={item.year}
                  onChange={(e) => onUpdate(item.id, { year: e.target.value })}
                  placeholder="YYYY"
                  className="w-12 h-6 text-xs"
                  maxLength={4}
                />
                {item.miles !== undefined && (
                  <>
                    <Input
                      type="text"
                      value={item.miles}
                      onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                      placeholder="mi"
                      className="w-12 h-6 text-xs"
                    />
                  </>
                )}
                <Input
                  type="date"
                  value={item.nextChange || ''}
                  onChange={(e) => onUpdate(item.id, { nextChange: e.target.value })}
                  className="w-24 h-6 text-xs"
                  placeholder="Próxima"
                />
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            {isTireSize ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-blue-700 truncate">
                  {item.extraInfo || 'Não informado'}
                </span>
                {item.tireBrand && (
                  <span className="text-xs bg-blue-100 px-1 rounded">
                    {item.tireBrand}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700 truncate">
                  {formatDate(item.month, item.year, item.miles)}
                </span>
                {item.nextChange && (
                  <span className="text-xs bg-gray-100 px-1 rounded whitespace-nowrap">
                    {new Date(item.nextChange).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Select
          value={item.status}
          onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
            onUpdate(item.id, { status: value })
          }
        >
          <SelectTrigger className={`w-20 h-6 text-xs border ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-1">
              <StatusIcon status={item.status} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="em-dia">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Em Dia
              </div>
            </SelectItem>
            <SelectItem value="proximo-troca">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                Próximo
              </div>
            </SelectItem>
            <SelectItem value="trocar">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                Trocar
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {isEditing ? (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onSave} className="h-6 w-6 p-0">
              <Save className="h-3 w-3 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel} className="h-6 w-6 p-0">
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(item.id)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3 text-gray-600" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableItemRow;
