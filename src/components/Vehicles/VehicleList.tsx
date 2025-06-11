
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles, Vehicle } from '../../hooks/useVehicles/index';
import { useVehiclesUltraMinimal } from '../../hooks/useVehiclesUltraMinimal';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { convertVehicleForCard, handleExport } from './VehicleDataProcessor';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

const VehicleList = () => {
  const { canEditVehicles } = useAuth();
  const { createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  
  // Usar dados ultra-mínimos para performance
  const [searchTerm, setSearchTerm] = useState('');
  const { vehicles: ultraMinimalVehicles, loading } = useVehiclesUltraMinimal({
    category: 'forSale',
    searchTerm
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  // Converter dados ultra-mínimos para o formato esperado pelos componentes de card
  const convertedVehiclesForCards = useMemo(() => {
    return ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: 2020,
      model: '',
      plate: '',
      internalCode: vehicle.vin,
      color: '',
      caNote: 0,
      purchasePrice: 0,
      salePrice: vehicle.sale_price,
      profitMargin: 0,
      minNegotiable: 0,
      carfaxPrice: 0,
      mmrValue: 0,
      description: '',
      category: 'forSale' as const,
      consignmentStore: '',
      seller: '',
      finalSalePrice: 0,
      photos: [],
      video: ''
    } as VehicleCardType));
  }, [ultraMinimalVehicles]);

  // Converter dados ultra-mínimos para o formato do hook useVehicles (para edição)
  const convertedVehiclesForEditing = useMemo(() => {
    return ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: 2020,
      model: '',
      miles: 0,
      internal_code: vehicle.vin,
      color: '',
      ca_note: 0,
      purchase_price: 0,
      sale_price: vehicle.sale_price,
      profit_margin: 0,
      min_negotiable: 0,
      carfax_price: 0,
      mmr_value: 0,
      description: '',
      category: 'forSale' as const,
      title_type: undefined,
      title_status: undefined,
      photos: [],
      video: '',
      created_by: undefined,
      created_at: undefined,
      updated_at: undefined
    } as Vehicle));
  }, [ultraMinimalVehicles]);

  // Vehicle Actions Logic
  const handleSaveVehicle = async (vehicleData: any, editingVehicle: Vehicle | null) => {
    try {
      console.log('VehicleList - handleSaveVehicle called with:', vehicleData);
      console.log('VehicleList - editingVehicle:', editingVehicle);
      
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
    console.log('VehicleList - handleEditVehicle called with:', vehicle);
    
    // Converter do formato de card para o formato de edição
    const vehicleForEditing = convertedVehiclesForEditing.find(v => v.id === vehicle.id);
    if (vehicleForEditing) {
      setEditingVehicle(vehicleForEditing);
      setShowAddForm(true);
    }
  };

  const handleDuplicateVehicle = (vehicle: VehicleCardType) => {
    if (!canEditVehicles) return;
    console.log('VehicleList - handleDuplicateVehicle called with:', vehicle);
    
    // Converter para formato de edição e duplicar
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
      } as Vehicle;
      
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

  // Vehicle Filters Logic
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

    filtered.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [convertedVehiclesForCards, searchTerm, filterBy]);

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    handleExport(filteredAndSortedVehicles, format);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando veículos com lazy loading real...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Indicador de lazy loading real */}
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <strong>LAZY LOADING REAL ATIVO:</strong> Carregando apenas dados essenciais. Fotos são buscadas individualmente sob demanda.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredAndSortedVehicles.map((vehicle) => (
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
          onDelete={editingVehicle ? () => handleDeleteVehicle(editingVehicle) : undefined}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
