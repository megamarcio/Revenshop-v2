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
    <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-card border rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Em Aberto e Pendentes</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:block">
            <MaintenanceStatusLegend />
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto">
          Ordenadas por código do veículo e data de detecção
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
        {/* Toggle de visualização */}
        <div className="flex border rounded-md w-full sm:w-auto">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
            className="h-8 px-3 rounded-r-none flex-1 sm:flex-none"
          >
            <Grid2x2 className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Cards</span>
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="h-8 px-3 rounded-l-none flex-1 sm:flex-none"
          >
            <List className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Tabela</span>
          </Button>
        </div>

        {/* Botões de impressão */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="h-8 px-3 flex-1 sm:flex-none"
            title="Imprimir relatório"
          >
            <Printer className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Imprimir</span>
            <span className="sm:hidden">Print</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadPDF}
            className="h-8 px-3 flex-1 sm:flex-none"
            title="Baixar PDF"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceFilters;
