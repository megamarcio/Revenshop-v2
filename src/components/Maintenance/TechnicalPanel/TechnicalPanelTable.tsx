import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings,
  Plus,
  RefreshCw,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useTechnicalItems } from '../../../hooks/useTechnicalItems';

interface TechnicalPanelTableProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelTable = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelTableProps) => {
  const { items, isLoading, updateItem, createDefaultItems } = useTechnicalItems(vehicleId);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const getItemIcon = (item: any) => {
    if (item.type === 'tires') return '🛞';
    if (item.type === 'oil') return '🛢️';
    if (item.type === 'electrical' && item.name.includes('Bateria')) return '🔋';
    if (item.type === 'filter') return '🔧';
    if (item.type === 'brakes') return '🛑';
    if (item.type === 'fluids') return '💧';
    if (item.type === 'suspension') return '🔩';
    return '⚙️';
  };

  const getItemDetails = (item: any) => {
    if (item.type === 'tires') {
      return item.extraInfo || '215/55R17';
    }
    
    if (item.type === 'oil') {
      const lastChange = item.miles ? parseInt(item.miles) : 1000;
      const nextChange = lastChange + 5000;
      return (
        <div>
          <div>Última troca: {item.month && item.year ? `${item.month}/${item.year}` : '01/06/2024'}</div>
          <div>Próxima troca: {nextChange.toLocaleString()} mi</div>
        </div>
      );
    }
    
    if (item.type === 'electrical' && item.name.includes('Bateria')) {
      return item.month && item.year ? `${item.month}/${item.year}` : '03/2025';
    }
    
    // Para outros itens, mostrar data se disponível
    if (item.month && item.year) {
      return `${item.month}/${item.year}`;
    }
    
    return item.extraInfo || '-';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em-dia':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Em Dia</Badge>;
      case 'proximo-troca':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Próximo</Badge>;
      case 'trocar':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Trocar</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: any) => {
    updateItem({ itemId, updates });
  };

  const handleCreateDefaults = () => {
    if (vehicleId) {
      createDefaultItems(vehicleId);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const renderEditableCell = (item: any, field: string, placeholder: string) => {
    if (editingItem !== item.id) {
      return getItemDetails(item);
    }

    if (item.type === 'tires') {
      return (
        <Input
          value={item.extraInfo || ''}
          onChange={(e) => handleUpdate(item.id, { extraInfo: e.target.value })}
          placeholder="Ex: 215/55R17"
          className="h-8 text-xs"
        />
      );
    }

    if (item.type === 'oil') {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={item.month || ''}
              onChange={(e) => handleUpdate(item.id, { month: e.target.value })}
              placeholder="MM"
              className="w-12 h-6 text-xs"
              maxLength={2}
            />
            <span className="text-xs">/</span>
            <Input
              type="text"
              value={item.year || ''}
              onChange={(e) => handleUpdate(item.id, { year: e.target.value })}
              placeholder="YYYY"
              className="w-16 h-6 text-xs"
              maxLength={4}
            />
          </div>
          <Input
            type="text"
            value={item.miles || ''}
            onChange={(e) => handleUpdate(item.id, { miles: e.target.value })}
            placeholder="Milhas atuais"
            className="h-6 text-xs"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <Input
          type="text"
          value={item.month || ''}
          onChange={(e) => handleUpdate(item.id, { month: e.target.value })}
          placeholder="MM"
          className="w-12 h-6 text-xs"
          maxLength={2}
        />
        <span className="text-xs">/</span>
        <Input
          type="text"
          value={item.year || ''}
          onChange={(e) => handleUpdate(item.id, { year: e.target.value })}
          placeholder="YYYY"
          className="w-16 h-6 text-xs"
          maxLength={4}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-revenshop-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-revenshop-primary" />
              </div>
              <div>
                <div className="text-xl font-bold">Painel Técnico</div>
                <div className="text-sm text-gray-600 font-normal">
                  {vehicleName || 'Veículo'} - Controle de Manutenções
                </div>
              </div>
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              {items.length === 0 && !isLoading && (
                <Button
                  onClick={handleCreateDefaults}
                  size="sm"
                  className="flex items-center gap-2 bg-revenshop-primary hover:bg-revenshop-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Criar Itens Padrão
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Carregando itens técnicos...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum item técnico encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Crie os itens técnicos padrão para começar o controle de manutenções
              </p>
              <Button onClick={handleCreateDefaults} className="bg-revenshop-primary hover:bg-revenshop-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Criar Itens Padrão
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-medium">Item</TableHead>
                    <TableHead className="text-left font-medium">Detalhes</TableHead>
                    <TableHead className="text-left font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getItemIcon(item)}</span>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm text-gray-700">
                          {renderEditableCell(item, 'details', 'Detalhes')}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          {editingItem === item.id ? (
                            <Select
                              value={item.status}
                              onValueChange={(value: 'em-dia' | 'proximo-troca' | 'trocar') => 
                                handleUpdate(item.id, { status: value })
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="em-dia">Em Dia</SelectItem>
                                <SelectItem value="proximo-troca">Próximo</SelectItem>
                                <SelectItem value="trocar">Trocar</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            getStatusBadge(item.status)
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {editingItem === item.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleSave}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingItem(null)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

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

export default TechnicalPanelTable;
