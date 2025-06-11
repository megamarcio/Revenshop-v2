
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles, Vehicle as HookVehicle } from '../../hooks/useVehicles/index';
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
  
  // Usar dados ultra-mínimos com dados completos para performance
  const [searchTerm, setSearchTerm] = useState('');
  const { vehicles: ultraMinimalVehicles, loading } = useVehiclesUltraMinimal({
    category: 'forSale',
    searchTerm
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<HookVehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  // Converter dados para o formato esperado pelos componentes de card
  const convertedVehiclesForCards = useMemo(() => {
    return ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      plate: vehicle.miles.toString(), // Usando miles como plate temporariamente
      internalCode: vehicle.internal_code,
      color: vehicle.color,
      caNote: vehicle.ca_note,
      purchasePrice: vehicle.purchase_price,
      salePrice: vehicle.sale_price,
      profitMargin: vehicle.profit_margin,
      minNegotiable: vehicle.min_negotiable,
      carfaxPrice: vehicle.carfax_price,
      mmrValue: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      consignmentStore: vehicle.consignment_store || '',
      seller: '',
      finalSalePrice: 0,
      photos: [], // Fotos serão carregadas sob demanda
      video: ''
    } as VehicleCardType));
  }, [ultraMinimalVehicles]);

  // Converter dados para o formato do hook useVehicles (para edição)
  const convertedVehiclesForEditing = useMemo(() => {
    return ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      miles: vehicle.miles,
      internal_code: vehicle.internal_code,
      color: vehicle.color,
      ca_note: vehicle.ca_note,
      purchase_price: vehicle.purchase_price,
      sale_price: vehicle.sale_price,
      profit_margin: vehicle.profit_margin,
      min_negotiable: vehicle.min_negotiable,
      carfax_price: vehicle.carfax_price,
      mmr_value: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      consignment_store: vehicle.consignment_store,
      title_type: vehicle.title_type,
      title_status: vehicle.title_status,
      photos: [],
      video: '',
      created_by: vehicle.created_by,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at
    } as HookVehicle));
  }, [ultraMinimalVehicles]);

  // Função para converter de CardType para HookType para exportação
  const convertCardTypeToHookType = (vehicles: VehicleCardType[]): HookVehicle[] => {
    return vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      miles: parseInt(vehicle.plate) || 0, // Convertendo plate de volta para miles
      internal_code: vehicle.internalCode,
      color: vehicle.color,
      ca_note: vehicle.caNote,
      purchase_price: vehicle.purchasePrice,
      sale_price: vehicle.salePrice,
      profit_margin: vehicle.profitMargin,
      min_negotiable: vehicle.minNegotiable,
      carfax_price: vehicle.carfaxPrice,
      mmr_value: vehicle.mmrValue,
      description: vehicle.description,
      category: vehicle.category,
      consignment_store: vehicle.consignmentStore,
      title_type: undefined,
      title_status: undefined,
      photos: vehicle.photos,
      video: vehicle.video,
      created_by: undefined,
      created_at: undefined,
      updated_at: undefined
    } as HookVehicle));
  };

  // Vehicle Actions Logic
  const handleSaveVehicle = async (vehicleData: any, editingVehicle: HookVehicle | null) => {
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
    // Converter para o formato esperado pela função de exportação
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
          onDelete={editingVehicle ? () => {
            const vehicleForCard = convertedVehiclesForCards.find(v => v.id === editingVehicle.id);
            if (vehicleForCard) {
              handleDeleteVehicle(vehicleForCard);
            }
          } : undefined}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
