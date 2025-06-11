
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

const VehicleList = () => {
  const { canEditVehicles } = useAuth();
  // TESTE: Usando hook ultra minimal para verificar performance
  const { vehicles: ultraMinimalVehicles, loading: ultraLoading } = useVehiclesUltraMinimal();
  const { vehicles, loading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  // TESTE: Converter dados ultra minimal para formato compatível
  const testVehicles = useMemo(() => {
    return ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: 2020, // Valor padrão para teste
      model: 'Test Model',
      plate: '',
      internalCode: vehicle.id.substring(0, 8), // Usar parte do ID como código
      color: 'Unknown',
      caNote: 0,
      purchasePrice: 0,
      salePrice: vehicle.sale_price,
      profitMargin: 0,
      minNegotiable: 0,
      carfaxPrice: 0,
      mmrValue: 0,
      description: '',
      category: 'forSale' as const,
      photos: [], // TESTE: Sem fotos
      video: '',
      main_photo_url: undefined // TESTE: Sem foto principal
    }));
  }, [ultraMinimalVehicles]);

  // Vehicle Actions Logic (moved from VehicleActions.tsx)
  const handleSaveVehicle = async (vehicleData: any, editingVehicle: Vehicle | null) => {
    try {
      console.log('VehicleList - handleSaveVehicle called with:', vehicleData);
      console.log('VehicleList - editingVehicle:', editingVehicle);
      
      if (editingVehicle && editingVehicle.id) {
        // Se tem ID válido, é uma edição
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        // Se não tem ID ou é duplicação, é criação
        await createVehicle(vehicleData);
      }
      setShowAddForm(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    console.log('VehicleList - handleEditVehicle called with:', vehicle);
    
    // Passar o objeto vehicle diretamente do banco de dados
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleDuplicateVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    console.log('VehicleList - handleDuplicateVehicle called with:', vehicle);
    
    // Criar uma cópia sem ID para forçar criação de novo veículo
    const duplicatedVehicle = {
      name: `${vehicle.name} (Cópia)`,
      vin: '',
      year: vehicle.year,
      model: vehicle.model,
      miles: vehicle.miles,
      internal_code: '',
      color: vehicle.color,
      ca_note: vehicle.ca_note,
      purchase_price: vehicle.purchase_price,
      sale_price: vehicle.sale_price,
      min_negotiable: vehicle.min_negotiable,
      carfax_price: vehicle.carfax_price,
      mmr_value: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      title_type: vehicle.title_type,
      title_status: vehicle.title_status,
      video: vehicle.video
    };
    
    // Não incluir ID nem photos para garantir que será tratado como criação
    setEditingVehicle(duplicatedVehicle as Vehicle);
    setShowAddForm(true);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      await deleteVehicle(vehicle.id);
    }
  };

  // Vehicle Filters Logic (moved from VehicleFilters.tsx)
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = testVehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internalCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filterBy !== 'all') {
        matchesFilter = vehicle.category === filterBy;
      }
      
      return matchesSearch && matchesFilter;
    });

    // Força a ordenação por internal_code sempre
    filtered.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [testVehicles, searchTerm, filterBy]);

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    handleExport(filteredAndSortedVehicles, format);
  };

  // TESTE: Usar loading do hook ultra minimal
  if (ultraLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando veículos (teste ultra minimal)...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* TESTE: Indicador visual do modo de teste */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <strong>MODO TESTE:</strong> Carregando dados ultra minimais sem fotos para testar performance
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
              onEdit={() => handleEditVehicle(vehicle as Vehicle)}
              onDuplicate={() => handleDuplicateVehicle(vehicle as Vehicle)}
              onDelete={() => handleDeleteVehicle(vehicle as Vehicle)}
            />
          ))}
        </div>
      ) : (
        <VehicleListView
          vehicles={filteredAndSortedVehicles.map(convertVehicleForCard)}
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

      {filteredAndSortedVehicles.length === 0 && !ultraLoading && <EmptyVehicleState />}

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
