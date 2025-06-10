
import React from 'react';
import { Droplet, Zap, Filter, Car, Disc3, Settings, Gauge, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';
import LoadingTechnicalState from './LoadingTechnicalState';
import EmptyTechnicalState from './EmptyTechnicalState';
import MainItemsSection from './MainItemsSection';
import OtherItemsSection from './OtherItemsSection';
import TechnicalStatistics from './TechnicalStatistics';
import AlertSection from './AlertSection';
import TechnicalSection from './TechnicalSection';
import { getItemsByStatus } from './utils';

interface TechnicalPanelContentProps {
  items: TechnicalItem[];
  loading: boolean;
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  onCreateDefaults: () => void;
  onClose: () => void;
}

const TechnicalPanelContent = ({
  items,
  loading,
  editingItem,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onCreateDefaults,
  onClose
}: TechnicalPanelContentProps) => {
  const groupItemsByType = (items: TechnicalItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, TechnicalItem[]>);
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

  const groupedItems = groupItemsByType(items);
  const trocarItems = items.filter(item => item.status === 'trocar');
  const proximoTrocaItems = items.filter(item => item.status === 'proximo-troca');

  if (loading) {
    return <LoadingTechnicalState />;
  }

  if (items.length === 0) {
    return <EmptyTechnicalState onCreateDefaults={onCreateDefaults} />;
  }

  return (
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
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onUpdate={onUpdate}
              isHighlight={hasAlerts}
              className={hasAlerts ? 'ring-2 ring-orange-200 bg-orange-50/30' : ''}
            />
          );
        })}
      </div>

      {/* Estatísticas */}
      <TechnicalStatistics items={items} />

      {/* Botão de Fechar */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </>
  );
};

export default TechnicalPanelContent;
