
import { useMemo } from 'react';
import { Vehicle } from '../../hooks/useVehicles/types';

interface VehicleFiltersProps {
  vehicles: Vehicle[];
  searchTerm: string;
  filterBy: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const useVehicleFilters = ({
  vehicles,
  searchTerm,
  filterBy,
  sortBy,
  sortOrder
}: VehicleFiltersProps) => {
  
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.internal_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filterBy !== 'all') {
        // Check if it's a direct category match or extended category match
        if (vehicle.category === filterBy) {
          matchesFilter = true;
        } else if (vehicle.extended_category === filterBy) {
          matchesFilter = true;
        } else {
          matchesFilter = false;
        }
      }
      
      return matchesSearch && matchesFilter;
    });

    // Força a ordenação por internal_code sempre
    filtered.sort((a, b) => {
      // Ordenação numérica do código interno
      const aCode = parseInt(a.internal_code) || 0;
      const bCode = parseInt(b.internal_code) || 0;
      
      if (aCode !== bCode) {
        return aCode - bCode; // Sempre do menor para o maior
      }
      
      // Se os códigos numéricos forem iguais, ordenar alfabeticamente
      return a.internal_code.localeCompare(b.internal_code, undefined, { numeric: true });
    });

    return filtered;
  }, [vehicles, searchTerm, filterBy]);

  return {
    filteredAndSortedVehicles
  };
};
