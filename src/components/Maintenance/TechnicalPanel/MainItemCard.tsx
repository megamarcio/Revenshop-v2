
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Save, X } from 'lucide-react';
import { TechnicalItem, TIRE_BRANDS } from './types';

interface MainItemCardProps {
  item: TechnicalItem;
  icon: React.ReactNode;
  title: string;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  onCancel: () => void;
}

const MainItemCard = ({ 
  item, 
  icon, 
  title, 
  isEditing, 
  onEdit, 
  onSave, 
  onUpdate, 
  onCancel 
}: MainItemCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em-dia': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'proximo-troca': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'trocar': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-dia': return 'text-green-700 bg-green-50 border-green-200';
      case 'proximo-troca': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'trocar': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return '--/--';
    const m = month.padStart(2, '0');
    const y = year.slice(-2);
    return `${m}/${y}`;
  };

  return (
    <Card className={`${getStatusColor(item.status)} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            {icon}
            <span>{title}</span>
          </div>
          {getStatusIcon(item.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.type === 'tires' ? (
          // Layout especial para pneus
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Tamanho:</div>
            {isEditing ? (
              <Input
                value={item.extraInfo || ''}
                onChange={(e) => onUpdate(item.id, { extraInfo: e.target.value })}
                placeholder="Ex: 205/55 R16"
                className="text-sm"
              />
            ) : (
              <div className="text-lg font-bold text-blue-800">
                {item.extraInfo || 'Não informado'}
              </div>
            )}
            
            <div className="text-sm font-medium text-gray-600">Marca:</div>
            {isEditing ? (
              <Select
                value={item.tireBrand || ''}
                onValueChange={(value) => onUpdate(item.id, { tireBrand: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_BRANDS.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-gray-700">
                {item.tireBrand || 'Não informado'}
              </div>
            )}
          </div>
        ) : (
          // Layout para óleo e bateria
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Data:</div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={item.month || ''}
                  onChange={(e) => onUpdate(item.id, { month: e.target.value })}
                  placeholder="MM"
                  className="w-16 text-sm"
                  maxLength={2}
                />
                <span>/</span>
                <Input
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => onUpdate(item.id, { year: e.target.value })}
                  placeholder="YYYY"
                  className="w-20 text-sm"
                  maxLength={4}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold tracking-wider">
                {formatDate(item.month || '', item.year || '')}
              </div>
            )}
            
            {item.miles && (
              <>
                <div className="text-sm font-medium text-gray-600">Milhas:</div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={item.miles || ''}
                    onChange={(e) => onUpdate(item.id, { miles: e.target.value })}
                    placeholder="Milhas"
                    className="text-sm"
                  />
                ) : (
                  <div className="text-sm text-gray-700">{item.miles} mi</div>
                )}
              </>
            )}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <Select
            value={item.status}
            onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
              onUpdate(item.id, { status: value })
            }
          >
            <SelectTrigger className="w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em-dia">Em Dia</SelectItem>
              <SelectItem value="proximo-troca">Próximo</SelectItem>
              <SelectItem value="trocar">Trocar</SelectItem>
            </SelectContent>
          </Select>

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
              className="h-8 px-3 text-xs"
            >
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainItemCard;
