
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Grid2x2, List, Printer, Download } from 'lucide-react';
import MaintenanceStatusLegend from './MaintenanceStatusLegend';

interface MaintenanceFiltersProps {
  statusFilter: 'open' | 'pending' | 'completed' | 'all';
  onStatusFilterChange: (value: 'open' | 'pending' | 'completed' | 'all') => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
}

const MaintenanceFilters = ({ 
  statusFilter, 
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onPrint,
  onDownloadPDF
}: MaintenanceFiltersProps) => {
  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'open': return 'Em Aberto e Pendentes';
      case 'completed': return 'Concluídas';
      case 'all': return 'Todas';
      default: return 'Todas';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Em Aberto e Pendentes</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
          <MaintenanceStatusLegend />
        </div>
        
        <div className="text-sm text-gray-600">
          Ordenadas por código do veículo e data de detecção
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle de visualização */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
            className="h-8 px-3 rounded-r-none"
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="h-8 px-3 rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Botões de impressão */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-8 px-3"
          title="Imprimir relatório"
        >
          <Printer className="h-4 w-4 mr-1" />
          Imprimir
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadPDF}
          className="h-8 px-3"
          title="Baixar PDF"
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceFilters;
