import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles, Vehicle } from '../../hooks/useVehicles';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import VehicleControls from './VehicleControls';
import VehicleListView from './VehicleListView';
import EmptyVehicleState from './EmptyVehicleState';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const VehicleList = () => {
  const { canEditVehicles } = useAuth();
  const { vehicles, loading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('internal_code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  const handleSaveVehicle = async (vehicleData: any) => {
    try {
      console.log('VehicleList - handleSaveVehicle called with:', vehicleData);
      console.log('VehicleList - editingVehicle:', editingVehicle);
      
      if (editingVehicle) {
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

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    console.log('VehicleList - handleEditVehicle called with:', vehicle);
    
    // Passar o objeto vehicle diretamente do banco de dados
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleDuplicateVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    const duplicatedVehicle = {
      ...vehicle,
      name: `${vehicle.name} (Cópia)`,
      vin: '',
      internal_code: '',
    };
    // Remove id and other auto-generated fields
    delete (duplicatedVehicle as any).id;
    delete (duplicatedVehicle as any).created_at;
    delete (duplicatedVehicle as any).updated_at;
    delete (duplicatedVehicle as any).profit_margin;
    
    setEditingVehicle(duplicatedVehicle as Vehicle);
    setShowAddForm(true);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      await deleteVehicle(vehicle.id);
    }
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExport = (format: 'csv' | 'xls') => {
    const headers = ['Nome', 'Ano', 'Cor', 'Código Interno', 'VIN', 'Preço de Compra', 'Preço de Venda', 'Status'];
    const data = filteredAndSortedVehicles.map(vehicle => [
      vehicle.name,
      vehicle.year,
      vehicle.color,
      vehicle.internal_code,
      vehicle.vin,
      vehicle.purchase_price,
      vehicle.sale_price,
      vehicle.category === 'forSale' ? 'À Venda' : 'Vendido'
    ]);

    if (format === 'csv') {
      const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'veiculos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const csvContent = [headers, ...data].map(row => row.join('\t')).join('\n');
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'veiculos.xls';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Função para converter dados do banco para o formato do formulário
  const convertVehicleForCard = (vehicle: Vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    vin: vehicle.vin,
    year: vehicle.year,
    model: vehicle.model,
    plate: vehicle.miles?.toString() || '', // Usar miles do banco
    internalCode: vehicle.internal_code,
    color: vehicle.color,
    caNote: vehicle.ca_note,
    purchasePrice: vehicle.purchase_price,
    salePrice: vehicle.sale_price,
    profitMargin: vehicle.profit_margin || 0,
    minNegotiable: vehicle.min_negotiable || 0,
    carfaxPrice: vehicle.carfax_price || 0,
    mmrValue: vehicle.mmr_value || 0,
    description: vehicle.description || '',
    category: vehicle.category,
    photos: vehicle.photos,
    video: vehicle.video
  });

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internal_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || vehicle.category === filterBy;
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'purchase_price':
          aValue = a.purchase_price;
          bValue = b.purchase_price;
          break;
        case 'sale_price':
          aValue = a.sale_price;
          bValue = b.sale_price;
          break;
        case 'internal_code':
          aValue = a.internal_code.toLowerCase();
          bValue = b.internal_code.toLowerCase();
          break;
        case 'color':
          aValue = a.color.toLowerCase();
          bValue = b.color.toLowerCase();
          break;
        default:
          aValue = a.internal_code.toLowerCase();
          bValue = b.internal_code.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vehicles, searchTerm, filterBy, sortBy, sortOrder]);

  if (loading) {
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
        onExport={handleExport}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={convertVehicleForCard(vehicle)}
              onEdit={() => handleEditVehicle(vehicle)}
              onDuplicate={() => handleDuplicateVehicle(vehicle)}
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

      {filteredAndSortedVehicles.length === 0 && !loading && <EmptyVehicleState />}

      {showAddForm && canEditVehicles && (
        <VehicleForm
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
