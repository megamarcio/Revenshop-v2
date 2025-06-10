
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Droplet, 
  Battery, 
  Gauge,
  Filter,
  Disc3,
  Car,
  Wrench,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Save,
  X
} from 'lucide-react';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';

interface TechnicalPanelRedesignedProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelRedesigned = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelRedesignedProps) => {
  const { items, loading, updateItem, createDefaultItems, refresh } = useTechnicalItems(vehicleId);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Encontrar itens principais
  const oilItem = items.find(item => item.type === 'oil' && item.name.includes('Óleo'));
  const tireItem = items.find(item => item.type === 'tires');
  const batteryItem = items.find(item => item.type === 'electrical' && item.name.includes('Bateria'));

  // Outros itens organizados por categoria
  const otherItems = items.filter(item => 
    item.id !== oilItem?.id && 
    item.id !== tireItem?.id && 
    item.id !== batteryItem?.id
  );

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

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: any) => {
    updateItem(itemId, updates);
  };

  const handleUpdateAndExit = async () => {
    await refresh();
    onClose();
  };

  const renderMainItem = (item: any, icon: React.ReactNode, title: string) => {
    if (!item) return null;

    const isEditing = editingItem === item.id;

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
                  onChange={(e) => handleUpdate(item.id, { extraInfo: e.target.value })}
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
                  onValueChange={(value) => handleUpdate(item.id, { tireBrand: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Yokohama', 'Firestone', 'Dunlop'].map(brand => (
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
                    onChange={(e) => handleUpdate(item.id, { month: e.target.value })}
                    placeholder="MM"
                    className="w-16 text-sm"
                    maxLength={2}
                  />
                  <span>/</span>
                  <Input
                    type="text"
                    value={item.year || ''}
                    onChange={(e) => handleUpdate(item.id, { year: e.target.value })}
                    placeholder="YYYY"
                    className="w-20 text-sm"
                    maxLength={4}
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold tracking-wider">
                  {formatDate(item.month, item.year)}
                </div>
              )}
              
              {item.miles && (
                <>
                  <div className="text-sm font-medium text-gray-600">Milhas:</div>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={item.miles || ''}
                      onChange={(e) => handleUpdate(item.id, { miles: e.target.value })}
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
                handleUpdate(item.id, { status: value })
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
                <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                  <Save className="h-3 w-3 text-green-600" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)} className="h-8 w-8 p-0">
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEdit(item.id)}
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

  const renderOtherItems = () => {
    const categories = {
      filter: { name: 'Filtros', icon: Filter, items: [] as any[] },
      brakes: { name: 'Freios', icon: Disc3, items: [] as any[] },
      suspension: { name: 'Suspensão', icon: Car, items: [] as any[] },
      fluids: { name: 'Fluidos', icon: Droplet, items: [] as any[] },
      other: { name: 'Outros', icon: Wrench, items: [] as any[] }
    };

    otherItems.forEach(item => {
      const category = categories[item.type as keyof typeof categories] || categories.other;
      category.items.push(item);
    });

    return Object.entries(categories).map(([key, category]) => {
      if (category.items.length === 0) return null;

      const CategoryIcon = category.icon;

      return (
        <Card key={key} className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CategoryIcon className="h-4 w-4" />
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {category.items.map(item => (
                <li key={item.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50">
                  <span className="text-xs text-gray-700">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(item.month, item.year)}
                    </span>
                    {getStatusIcon(item.status)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Wrench className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">Painel Técnico</div>
                <div className="text-sm text-gray-600 font-normal">
                  {vehicleName || 'Veículo'}
                </div>
              </div>
            </DialogTitle>
            <Button
              onClick={handleUpdateAndExit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Atualizar e Sair
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Button onClick={createDefaultItems} className="bg-blue-600 hover:bg-blue-700">
                Criar Itens Padrão
              </Button>
            </div>
          ) : (
            <>
              {/* Itens Principais */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Itens Principais</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {renderMainItem(oilItem, <Droplet className="h-6 w-6 text-blue-600" />, 'Óleo do Motor')}
                  {renderMainItem(tireItem, <Gauge className="h-6 w-6 text-blue-600" />, 'Pneus')}
                  {renderMainItem(batteryItem, <Battery className="h-6 w-6 text-blue-600" />, 'Bateria')}
                </div>
              </div>

              {/* Outros Itens */}
              {otherItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Outros Itens</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {renderOtherItems()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelRedesigned;
