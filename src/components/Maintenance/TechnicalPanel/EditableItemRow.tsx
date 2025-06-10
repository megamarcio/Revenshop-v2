
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { EditableItemRowProps } from './types';
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

  return (
    <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3 flex-1">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium min-w-[120px]">{item.name}:</span>
        
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="text"
              value={item.month}
              onChange={(e) => onUpdate(item.id, { month: e.target.value })}
              placeholder="MM"
              className="w-12 h-7 text-xs"
              maxLength={2}
            />
            <span className="text-xs">/</span>
            <Input
              type="text"
              value={item.year}
              onChange={(e) => onUpdate(item.id, { year: e.target.value })}
              placeholder="YYYY"
              className="w-16 h-7 text-xs"
              maxLength={4}
            />
            {item.miles !== undefined && (
              <>
                <span className="text-xs">-</span>
                <Input
                  type="text"
                  value={item.miles}
                  onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                  placeholder="Milhas"
                  className="w-20 h-7 text-xs"
                />
                <span className="text-xs">mi</span>
              </>
            )}
            {item.extraInfo !== undefined && (
              <Input
                type="text"
                value={item.extraInfo}
                onChange={(e) => onUpdate(item.id, { extraInfo: e.target.value })}
                placeholder="Info extra"
                className="w-24 h-7 text-xs"
              />
            )}
          </div>
        ) : (
          <div className="flex-1">
            <span className="text-sm text-gray-700">
              {item.extraInfo || formatDate(item.month, item.year, item.miles)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={item.status}
          onValueChange={(value: 'em-dia' | 'precisa-troca' | 'urgente') => 
            onUpdate(item.id, { status: value })
          }
        >
          <SelectTrigger className={`w-32 h-7 text-xs border ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-1">
              <StatusIcon status={item.status} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="em-dia">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Em Dia
              </div>
            </SelectItem>
            <SelectItem value="precisa-troca">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-yellow-600" />
                Precisa Troca
              </div>
            </SelectItem>
            <SelectItem value="urgente">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                Urgente
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

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

export default EditableItemRow;
