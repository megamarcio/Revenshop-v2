
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Droplet, 
  Zap, 
  Filter, 
  Car, 
  Disc3,
  Gauge,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { TechnicalPanelModalProps, TechnicalItem } from './TechnicalPanel/types';
import { groupItemsByType } from './TechnicalPanel/utils';
import TechnicalSection from './TechnicalPanel/TechnicalSection';
import AlertSection from './TechnicalPanel/AlertSection';
import { useTechnicalItems } from '../../hooks/useTechnicalItems';

const TechnicalPanelModal = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelModalProps) => {
  const { items, loading, updateItem, createDefaultItems, refresh } = useTechnicalItems(vehicleId);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const groupedItems = groupItemsByType(items);
  
  const trocarItems = items.filter(item => item.status === 'trocar');
  const proximoTrocaItems = items.filter(item => item.status === 'proximo-troca');

  const handleEdit = (itemId: string) => {
    setEditingItem(itemId);
  };

  const handleSave = () => {
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleUpdate = (itemId: string, updates: Partial<TechnicalItem>) => {
    updateItem(itemId, updates);
  };

  const handleCreateDefaults = () => {
    createDefaultItems();
  };

  const handleRefresh = () => {
    refresh();
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'oil': return Droplet;
      case 'electrical': return Zap;
      case 'filter': return Filter;
      case 'suspension': return Car;
      case 'brakes': return Disc3;
      case 'fluids': return Droplet;
      case 'tuneup': return Settings;
      case 'tires': return Gauge;
      default: return Wrench;
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'oil': return 'Sistema de Lubrificação';
      case 'electrical': return 'Sistema Elétrico';
      case 'filter': return 'Filtros';
      case 'suspension': return 'Suspensão';
      case 'brakes': return 'Sistema de Freios';
      case 'fluids': return 'Fluidos';
      case 'tuneup': return 'Tune-up';
      case 'tires': return 'Pneus';
      default: return 'Outros';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
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
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              {items.length === 0 && !loading && (
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

        <div className="space-y-6 p-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Carregando itens técnicos...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-12 text-center">
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
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Seção de Alertas */}
              {(trocarItems.length > 0 || proximoTrocaItems.length > 0) && (
                <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs px-2 py-1">
                      {trocarItems.length + proximoTrocaItems.length}
                    </Badge>
                    Itens que Precisam de Atenção
                  </h3>
                  <AlertSection 
                    trocarItems={trocarItems} 
                    proximoTrocaItems={proximoTrocaItems} 
                  />
                </div>
              )}

              {/* Grid de Seções Técnicas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(groupedItems).map(([type, items]) => {
                  if (items.length === 0) return null;
                  
                  const hasAlerts = items.some(item => item.status === 'trocar' || item.status === 'proximo-troca');
                  
                  return (
                    <TechnicalSection
                      key={type}
                      title={getSectionTitle(type)}
                      icon={getSectionIcon(type)}
                      items={items}
                      editingItem={editingItem}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onUpdate={handleUpdate}
                      isHighlight={hasAlerts}
                      className={hasAlerts ? 'ring-2 ring-orange-200 bg-orange-50/30' : ''}
                    />
                  );
                })}
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {items.filter(i => i.status === 'em-dia').length}
                  </div>
                  <div className="text-sm text-green-600">Itens em Dia</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">
                    {proximoTrocaItems.length}
                  </div>
                  <div className="text-sm text-yellow-600">Próximo da Troca</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">
                    {trocarItems.length}
                  </div>
                  <div className="text-sm text-red-600">Precisam Trocar</div>
                </div>
              </div>
            </>
          )}

          {/* Botão de Fechar */}
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
