
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, List, SortAsc, SortDesc, Download, Upload } from 'lucide-react';
import VehicleImportModal from './VehicleImport/VehicleImportModal';
import { useState } from 'react';

interface VehicleListFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  onExport: () => void;
}

const VehicleListFilters = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  filterBy,
  onFilterChange,
  onExport
}: VehicleListFiltersProps) => {
  const [showImport, setShowImport] = useState(false);

  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar por nome, VIN, código ou cor..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={onFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="forSale">À Venda</SelectItem>
                <SelectItem value="sold">Vendidos</SelectItem>
                <SelectItem value="rental">Aluguel</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="consigned">Consignados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internalCode">Código</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
                <SelectItem value="miles">Milhas</SelectItem>
                <SelectItem value="salePrice">Preço</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSortOrderToggle}
              className="px-2"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="px-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {showImport && (
        <VehicleImportModal
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            setShowImport(false);
            // Trigger refresh será tratado pelo componente pai
          }}
        />
      )}
    </>
  );
};

export default VehicleListFilters;
