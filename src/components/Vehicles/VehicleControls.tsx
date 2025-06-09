
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Grid, List, Download, SortAsc, SortDesc, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VehicleControlsProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  filterBy: string;
  onFilterChange: (filterBy: string) => void;
  onExport: (format: 'csv' | 'xls') => void;
}

const VehicleControls = ({
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  filterBy,
  onFilterChange,
  onExport
}: VehicleControlsProps) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'year', label: 'Ano' },
    { value: 'purchasePrice', label: 'Valor de Compra' },
    { value: 'salePrice', label: 'Valor de Venda' },
    { value: 'internalCode', label: 'Código Interno' },
    { value: 'color', label: 'Cor' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'forSale', label: 'À Venda' },
    { value: 'sold', label: 'Vendidos' },
    { value: 'rental', label: 'Aluguel' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'consigned', label: 'Consignado' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* View Mode Toggle */}
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Filter */}
        <Select value={filterBy} onValueChange={onFilterChange}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              Classificar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value, sortBy === option.value && sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('xls')}>
              Exportar Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VehicleControls;
