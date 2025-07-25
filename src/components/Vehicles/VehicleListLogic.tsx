
import { useState, useMemo } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehiclesUltraMinimal } from '../../hooks/useVehiclesUltraMinimal';
import { VehicleDataMapper } from './VehicleDataMapper';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

export const useVehicleListLogic = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('internalCode');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState('all');

  // Use ultra minimal hook for list display with automatic refresh
  const { 
    vehicles: ultraMinimalVehicles, 
    loading: isLoadingList, 
    refetch: refetchList
  } = useVehiclesUltraMinimal();

  // Use full hook for CRUD operations
  const { 
    createVehicle, 
    updateVehicle, 
    deleteVehicle, 
    loading: isSaving 
  } = useVehicles();

  // Convert data using the mapper
  const { convertedVehiclesForCards } = useMemo(() => {
    if (!ultraMinimalVehicles) return { convertedVehiclesForCards: [] };
    return VehicleDataMapper.mapVehicleData(ultraMinimalVehicles);
  }, [ultraMinimalVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!convertedVehiclesForCards) return [];
    
    let filtered = convertedVehiclesForCards.filter(vehicle => {
      const matchesSearch = !searchTerm || 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
      
      // Correção do filtro: mapear filterBy para a categoria correta do veículo
      let matchesFilter = true;
      if (filterBy !== 'all') {
        // Mapear os valores do filtro para as categorias do veículo
        const filterMapping: { [key: string]: string } = {
          'forSale': 'forSale',
          'sold': 'sold', 
          'rental': 'rental',
          'maintenance': 'maintenance',
          'consigned': 'consigned'
        };
        
        const mappedFilter = filterMapping[filterBy];
        if (mappedFilter) {
          matchesFilter = vehicle.category === mappedFilter;
        }
      }
      
      return matchesSearch && matchesCategory && matchesFilter;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof VehicleCardType];
      let bValue = b[sortBy as keyof VehicleCardType];
      
      // Tratamento especial para código interno (remover # se existir e converter para número)
      if (sortBy === 'internalCode') {
        const aCode = typeof aValue === 'string' ? parseInt(aValue.replace('#', '')) || 0 : 0;
        const bCode = typeof bValue === 'string' ? parseInt(bValue.replace('#', '')) || 0 : 0;
        return sortOrder === 'asc' ? aCode - bCode : bCode - aCode;
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [convertedVehiclesForCards, searchTerm, selectedCategory, filterBy, sortBy, sortOrder]);

  return {
    // State
    isFormOpen,
    setIsFormOpen,
    editingVehicle,
    setEditingVehicle,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterBy,
    setFilterBy,
    
    // Data
    filteredVehicles,
    isLoadingList,
    isSaving,
    
    // Operations
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetchList,
  };
};
