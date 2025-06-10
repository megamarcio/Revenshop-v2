import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon, Edit2, Save, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
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
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <span>{title}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-2">
              {item.status === 'em-dia' && <CheckCircle className="h-4 w-4" />}
              {item.status === 'proximo-troca' && <Clock className="h-4 w-4" />}
              {item.status === 'trocar' && <AlertTriangle className="h-4 w-4" />}
              <span>
                {item.status === 'em-dia' && 'Em Dia'}
                {item.status === 'proximo-troca' && 'Próximo da Troca'}
                {item.status === 'trocar' && 'Precisa Trocar'}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mês</label>
              <Input
                type="text"
                value={item.month || ''}
                onChange={(e) => onUpdate(item.id, { month: e.target.value })}
                placeholder="MM"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ano</label>
              <Input
                type="text"
                value={item.year || ''}
                onChange={(e) => onUpdate(item.id, { year: e.target.value })}
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
            {item.miles !== undefined && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Milhas</label>
                <Input
                  type="text"
                  value={item.miles || ''}
                  onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                  placeholder="Milhas"
                />
              </div>
            )}
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={item.status}
                onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
                  onUpdate(item.id, { status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em-dia">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Em Dia
                    </div>
                  </SelectItem>
                  <SelectItem value="proximo-troca">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Próximo da Troca
                    </div>
                  </SelectItem>
                  <SelectItem value="trocar">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Precisa Trocar
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-lg font-semibold text-gray-900">
              {item.month && item.year ? `${item.month}/${item.year}` : 'Não informado'}
              {item.miles && ` - ${item.miles} milhas`}
            </div>
            {item.next_change && (
              <div className="text-sm text-gray-600">
                Próxima troca: {new Date(item.next_change).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onEdit(item.id)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainItemCard;
