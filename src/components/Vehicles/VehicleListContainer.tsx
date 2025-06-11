
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles, Vehicle as HookVehicle } from '../../hooks/useVehicles/index';
import { useVehiclesUltraMinimal } from '../../hooks/useVehiclesUltraMinimal';
import VehicleForm from './VehicleForm';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import VehicleGridView from './VehicleGridView';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { handleExport } from './VehicleDataProcessor';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';
import { VehicleDataMapper } from './VehicleDataMapper';

const VehicleListContainer = () => {
  const { canEditVehicles } = useAuth();
  const { createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  
  // Estados do componente
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<HookVehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  // Buscar dados dos veículos
  const { vehicles: ultraMinimalVehicles, loading } = useVehiclesUltraMinimal({
    category: 'forSale',
    searchTerm
  });

  // Mapear dados para formatos necessários
  const { 
    convertedVehiclesForCards, 
    convertedVehiclesForEditing,
    convertCardTypeToHookType 
  } = useMemo(() => VehicleDataMapper.mapVehicleData(ultraMinimalVehicles), [ultraMinimalVehicles]);

  // Filtros e ordenação
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = convertedVehiclesForCards.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internalCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filterBy !== 'all') {
        matchesFilter = vehicle.category === filterBy;
      }
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [convertedVehiclesForCards, searchTerm, filterBy]);

  // Handlers de ações dos veículos
  const handleSaveVehicle = async (vehicleData: any, editingVehicle: HookVehicle | null) => {
    try {
      if (editingVehicle && editingVehicle.id) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      setShowAddForm(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEditVehicle = (vehicle: VehicleCardType) => {
    if (!canEditVehicles) return;
    
    const vehicleForEditing = convertedVehiclesForEditing.find(v => v.id === vehicle.id);
    if (vehicleForEditing) {
      setEditingVehicle(vehicleForEditing);
      setShowAddForm(true);
    }
  };

  const handleDuplicateVehicle = (vehicle: VehicleCardType) => {
    if (!canEditVehicles) return;
    
    const vehicleForEditing = convertedVehiclesForEditing.find(v => v.id === vehicle.id);
    if (vehicleForEditing) {
      const duplicatedVehicle = {
        ...vehicleForEditing,
        id: undefined,
        name: `${vehicleForEditing.name} (Cópia)`,
        vin: '',
        internal_code: '',
        created_at: undefined,
        updated_at: undefined
      } as HookVehicle;
      
      setEditingVehicle(duplicatedVehicle);
      setShowAddForm(true);
    }
  };

  const handleDeleteVehicle = async (vehicle: VehicleCardType) => {
    if (!canEditVehicles) return;
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      await deleteVehicle(vehicle.id);
    }
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    const vehiclesForExport = convertCardTypeToHookType(filteredAndSortedVehicles);
    handleExport(vehiclesForExport, format);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando veículos com dados completos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Indicador de otimização */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <strong>OTIMIZAÇÃO ATIVA:</strong> Dados completos carregados de forma otimizada. Fotos com thumbnails sob demanda.
      </div>
      
      <VehicleListHeader onAddVehicle={() => setShowAddForm(true)} />
      
      <VehicleSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <VehicleControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        onExport={handleExportData}
      />

      {viewMode === 'grid' ? (
        <VehicleGridView
          vehicles={filteredAndSortedVehicles}
          onEdit={handleEditVehicle}
          onDuplicate={handleDuplicateVehicle}
          onDelete={handleDeleteVehicle}
        />
      ) : (
        <VehicleListView
          vehicles={filteredAndSortedVehicles}
          onEdit={handleEditVehicle}
          onDuplicate={handleDuplicateVehicle}
          onDelete={handleDeleteVehicle}
        />
      )}

      {filteredAndSortedVehicles.length === 0 && !loading && <EmptyVehicleState />}

      {showAddForm && canEditVehicles && (
        <VehicleForm
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={(vehicleData) => handleSaveVehicle(vehicleData, editingVehicle)}
          onDelete={editingVehicle ? async () => {
            const vehicleForCard = convertedVehiclesForCards.find(v => v.id === editingVehicle.id);
            if (vehicleForCard) {
              await handleDeleteVehicle(vehicleForCard);
            }
          } : undefined}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleListContainer;
