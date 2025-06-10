import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { convertVehicleForCard, handleExport } from './VehicleDataProcessor';
import { useVehicleActions } from './VehicleActions';
import { useVehicleFilters } from './VehicleFilters';
import { useVehicles } from '../../hooks/useVehicles';

const VehicleList = () => {
  const { canEditVehicles } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  const { 
    vehicles, 
    loading, 
    currentPage, 
    totalPages, 
    totalCount,
    goToPage,
    refetch
  } = useVehiclesOptimized({
    category: filterBy === 'all' ? undefined : filterBy as 'forSale' | 'sold',
    limit: 10,
    searchTerm,
    minimal: true
  });

  // Get vehicle operations from useVehicles hook
  const {
    createVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles();

  const {
    handleSaveVehicle,
    handleEditVehicle,
    handleDuplicateVehicle,
    handleDeleteVehicle
  } = useVehicleActions({
    vehicles,
    canEditVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    onEditingChange: setEditingVehicle,
    onFormToggle: setShowAddForm
  });

  const { filteredAndSortedVehicles } = useVehicleFilters({
    vehicles,
    searchTerm: '', // A busca agora é feita no backend
    filterBy: 'all', // O filtro agora é feito no backend
    sortBy: 'internal_code', // A ordenação agora é feita no backend
    sortOrder: 'asc'
  });

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    handleExport(vehicles, format);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    goToPage(1); // Reset para primeira página ao buscar
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    goToPage(1); // Reset para primeira página ao filtrar
  };

  if (loading && currentPage === 1) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando veículos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <VehicleListHeader onAddVehicle={() => setShowAddForm(true)} />
      
      <VehicleSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />

      <VehicleControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
        onExport={handleExportData}
      />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Mostrando {vehicles.length} de {totalCount} veículos
        </span>
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={convertVehicleForCard(vehicle)}
              onEdit={() => handleEditVehicle(vehicle)}
              onDuplicate={() => handleDuplicateVehicle(vehicle)}
              onDelete={() => handleDeleteVehicle(vehicle)}
            />
          ))}
        </div>
      ) : (
        <VehicleListView
          vehicles={vehicles.map(convertVehicleForCard)}
          onEdit={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleEditVehicle(originalVehicle);
          }}
          onDuplicate={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleDuplicateVehicle(originalVehicle);
          }}
          onDelete={(vehicle) => {
            const originalVehicle = vehicles.find(v => v.id === vehicle.id);
            if (originalVehicle) handleDeleteVehicle(originalVehicle);
          }}
        />
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNumber > totalPages) return null;
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      onClick={() => goToPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {vehicles.length === 0 && !loading && <EmptyVehicleState />}

      {showAddForm && canEditVehicles && (
        <VehicleForm
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={(vehicleData) => handleSaveVehicle(vehicleData, editingVehicle)}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
