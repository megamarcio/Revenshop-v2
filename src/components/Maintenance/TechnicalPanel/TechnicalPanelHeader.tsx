
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, Plus } from 'lucide-react';

interface TechnicalPanelHeaderProps {
  vehicleName?: string;
  loading: boolean;
  itemsCount: number;
  onRefresh: () => void;
  onCreateDefaults: () => void;
}

const TechnicalPanelHeader = ({ 
  vehicleName, 
  loading, 
  itemsCount, 
  onRefresh, 
  onCreateDefaults 
}: TechnicalPanelHeaderProps) => {
  return (
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
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {itemsCount === 0 && !loading && (
            <Button
              onClick={onCreateDefaults}
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
  );
};

export default TechnicalPanelHeader;
