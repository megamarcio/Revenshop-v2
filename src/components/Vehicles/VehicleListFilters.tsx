
import React from 'react';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';

interface VehicleListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  onExport: (format: 'csv' | 'xls') => void;
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
  onExport,
}: VehicleListFiltersProps) => {
  return (
    <div className="space-y-4">
      <VehicleSearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      
      <VehicleControls
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        filterBy={filterBy}
        onFilterChange={onFilterChange}
        onExport={onExport}
      />
    </div>
  );
};

export default VehicleListFilters;
