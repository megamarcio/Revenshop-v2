
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings2, 
  Droplets, 
  Battery, 
  Wind, 
  Filter, 
  Wrench, 
  Target, 
  Disc, 
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface TechnicalItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  month: string;
  year: string;
  miles?: string;
  status: 'em-dia' | 'precisa-troca' | 'urgente';
  type: 'oil' | 'electrical' | 'filter' | 'suspension' | 'brakes' | 'fluids' | 'tires' | 'tuneup';
  extraInfo?: string;
}

interface TechnicalPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelModal = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelModalProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [items, setItems] = useState<TechnicalItem[]>([
    // Óleo do Motor
    { id: 'oil-engine', name: 'Óleo Motor', icon: Droplets, month: '10', year: '2024', miles: '45230', status: 'em-dia', type: 'oil' },
    
    // Sistema Elétrico
    { id: 'main-battery', name: 'Bateria Principal', icon: Battery, month: '08', year: '2023', status: 'precisa-troca', type: 'electrical' },
    { id: 'aux-battery', name: 'Bateria Auxiliar', icon: Battery, month: '08', year: '2023', status: 'em-dia', type: 'electrical' },
    { id: 'alternator', name: 'Alternador', icon: Zap, month: '03', year: '2023', miles: '42100', status: 'em-dia', type: 'electrical' },
    
    // Filtros
    { id: 'wiper-blades', name: 'Paleta Limpador', icon: Wind, month: '06', year: '2024', status: 'em-dia', type: 'filter' },
    { id: 'cabin-filter', name: 'Filtro de Cabine', icon: Filter, month: '05', year: '2024', status: 'em-dia', type: 'filter' },
    { id: 'air-filter', name: 'Filtro de Ar', icon: Filter, month: '05', year: '2024', status: 'em-dia', type: 'filter' },
    
    // Suspensão
    { id: 'alignment', name: 'Alinhamento', icon: Target, month: '09', year: '2024', miles: '44800', status: 'em-dia', type: 'suspension' },
    { id: 'balancing', name: 'Balanceamento', icon: Target, month: '09', year: '2024', miles: '44800', status: 'em-dia', type: 'suspension' },
    { id: 'front-suspension', name: 'Suspensão Frontal', icon: Wrench, month: '01', year: '2023', miles: '38500', status: 'urgente', type: 'suspension' },
    { id: 'rear-suspension', name: 'Suspensão Traseira', icon: Wrench, month: '01', year: '2023', miles: '38500', status: 'precisa-troca', type: 'suspension' },
    { id: 'shock-absorbers', name: 'Amortecedores', icon: Wrench, month: '02', year: '2023', miles: '39200', status: 'precisa-troca', type: 'suspension' },
    
    // Freios
    { id: 'brake-pads', name: 'Pastilhas', icon: Disc, month: '04', year: '2024', miles: '43000', status: 'em-dia', type: 'brakes' },
    { id: 'brake-discs', name: 'Disco de Freio', icon: Disc, month: '04', year: '2024', miles: '43000', status: 'em-dia', type: 'brakes' },
    
    // Fluidos
    { id: 'coolant', name: 'Coolant', icon: Droplets, month: '07', year: '2024', miles: '43500', status: 'em-dia', type: 'fluids' },
    { id: 'transmission-oil', name: 'Óleo Transmissão', icon: Droplets, month: '01', year: '2024', miles: '41500', status: 'em-dia', type: 'fluids' },
    
    // Tune Up
    { id: 'spark-plugs-coil', name: 'Vela e Coil (Tune Up)', icon: Zap, month: '03', year: '2023', miles: '40500', status: 'urgente', type: 'tuneup' },
    { id: 'timing-belt', name: 'Correia Dentada', icon: Wrench, month: '06', year: '2022', miles: '35000', status: 'urgente', type: 'tuneup' },
    
    // Pneus
    { id: 'tire-fr', name: 'Pneu FR', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
    { id: 'tire-fl', name: 'Pneu FL', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
    { id: 'tire-rr', name: 'Pneu RR', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
    { id: 'tire-rl', name: 'Pneu RL', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
    { id: 'tire-type', name: 'Tipo de Pneu', icon: Target, month: '', year: '', status: 'em-dia', type: 'tires', extraInfo: '205/55 R16' }
  ]);

  // Prevenir fechamento automático do modal pai
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        event.stopPropagation();
      };

      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-dia': return 'bg-green-100 text-green-800 border-green-200';
      case 'precisa-troca': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em-dia': return <CheckCircle className="h-3 w-3" />;
      case 'precisa-troca': return <Clock className="h-3 w-3" />;
      case 'urgente': return <AlertTriangle className="h-3 w-3" />;
      default: return <XCircle className="h-3 w-3" />;
    }
  };

  const formatDate = (month: string, year: string, miles?: string) => {
    if (!month && !year) return '';
    const dateStr = `${month}/${year}`;
    return miles ? `${dateStr} - ${miles} mi` : dateStr;
  };

  const updateItem = (itemId: string, updates: Partial<TechnicalItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const urgentItems = items.filter(item => item.status === 'urgente');
  const needsAttentionItems = items.filter(item => item.status === 'precisa-troca');

  const groupedItems = {
    oil: items.filter(item => item.type === 'oil'),
    electrical: items.filter(item => item.type === 'electrical'),
    filter: items.filter(item => item.type === 'filter'),
    suspension: items.filter(item => item.type === 'suspension'),
    brakes: items.filter(item => item.type === 'brakes'),
    fluids: items.filter(item => item.type === 'fluids'),
    tuneup: items.filter(item => item.type === 'tuneup'),
    tires: items.filter(item => item.type === 'tires')
  };

  const EditableItemRow = ({ item }: { item: TechnicalItem }) => {
    const Icon = item.icon;
    const isEditing = editingItem === item.id;

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
                onChange={(e) => updateItem(item.id, { month: e.target.value })}
                placeholder="MM"
                className="w-12 h-7 text-xs"
                maxLength={2}
              />
              <span className="text-xs">/</span>
              <Input
                type="text"
                value={item.year}
                onChange={(e) => updateItem(item.id, { year: e.target.value })}
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
                    onChange={(e) => updateItem(item.id, { miles: e.target.value })}
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
                  onChange={(e) => updateItem(item.id, { extraInfo: e.target.value })}
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
              updateItem(item.id, { status: value })
            }
          >
            <SelectTrigger className={`w-32 h-7 text-xs border ${getStatusColor(item.status)}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(item.status)}
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
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-7 w-7 p-0">
                <Save className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 w-7 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleEdit(item.id)}
              className="h-7 w-7 p-0"
            >
              <Edit2 className="h-3 w-3 text-gray-600" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[85vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-revenshop-primary" />
            Painel Técnico - {vehicleName || 'Veículo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alertas */}
          {(urgentItems.length > 0 || needsAttentionItems.length > 0) && (
            <div className="space-y-2">
              {urgentItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Itens Urgentes ({urgentItems.length})</span>
                  </div>
                  <div className="text-sm text-red-700">
                    {urgentItems.map(item => item.name).join(', ')}
                  </div>
                </div>
              )}
              
              {needsAttentionItems.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Precisam de Atenção ({needsAttentionItems.length})</span>
                  </div>
                  <div className="text-sm text-yellow-700">
                    {needsAttentionItems.map(item => item.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lista Compacta de Itens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Óleo do Motor - Destaque */}
            <Card className="border-revenshop-primary border-2 lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-revenshop-primary">Óleo do Motor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.oil.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Sistema Elétrico */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Sistema Elétrico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.electrical.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Filtros e Limpeza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.filter.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Suspensão */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  Suspensão e Direção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.suspension.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Sistema de Freios */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Disc className="h-4 w-4" />
                  Sistema de Freios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.brakes.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Fluidos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="h-4 w-4" />
                  Fluidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.fluids.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Tune Up */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Tune Up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedItems.tuneup.map(item => (
                  <EditableItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Pneus */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  Pneus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {groupedItems.tires.map(item => (
                    <EditableItemRow key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelModal;
