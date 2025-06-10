
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import MaintenanceStatusLegend from './MaintenanceStatusLegend';

interface MaintenanceFiltersProps {
  statusFilter: 'open' | 'pending' | 'completed' | 'all';
  onStatusFilterChange: (value: 'open' | 'pending' | 'completed' | 'all') => void;
}

const MaintenanceFilters = ({ statusFilter, onStatusFilterChange }: MaintenanceFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-64">
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
  );
};

export default MaintenanceFilters;
