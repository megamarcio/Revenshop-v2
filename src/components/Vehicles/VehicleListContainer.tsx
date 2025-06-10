
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVehiclesOptimized } from '../../hooks/useVehiclesOptimized';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehicleActions } from './VehicleActions';
import { useVehicleFilters } from './VehicleFilters';

interface VehicleListContainerProps {
  children: (props: {
    // Auth
    canEditVehicles: boolean;
    
    // State
    searchTerm: string;
    showAddForm: boolean;
    editingVehicle: any;
    viewMode: 'grid' | 'list';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    filterBy: string;
    
    // Data
    vehicles: any[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    
    // Actions
    setSearchTerm: (value: string) => void;
    setShowAddForm: (show: boolean) => void;
    setEditingVehicle: (vehicle: any) => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    setSortBy: (sortBy: string) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    setFilterBy: (filter: string) => void;
    goToPage: (page: number) => void;
    refetch: () => void;
    handleSaveVehicle: (vehicleData: any, editingVehicle: any) => Promise<void>;
    handleEditVehicle: (vehicle: any) => void;
    handleDuplicateVehicle: (vehicle: any) => void;
    handleDeleteVehicle: (vehicle: any) => Promise<void>;
    handleSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
    handleExportData: (format: 'csv' | 'xls') => void;
    handleSearchChange: (value: string) => void;
    handleFilterChange: (value: string) => void;
  }) => React.ReactNode;
}

export const VehicleListContainer = ({ children }: VehicleListContainerProps) => {
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
    searchTerm: '',
    filterBy: 'all',
    sortBy: 'internal_code',
    sortOrder: 'asc'
  });

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportData = (format: 'csv' | 'xls') => {
    const { handleExport } = require('./VehicleDataProcessor');
    handleExport(vehicles, format);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    goToPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    goToPage(1);
  };

  return (
    <>
      {children({
        canEditVehicles,
        searchTerm,
        showAddForm,
        editingVehicle,
        viewMode,
        sortBy,
        sortOrder,
        filterBy,
        vehicles,
        loading,
        currentPage,
        totalPages,
        totalCount,
        setSearchTerm,
        setShowAddForm,
        setEditingVehicle,
        setViewMode,
        setSortBy,
        setSortOrder,
        setFilterBy,
        goToPage,
        refetch,
        handleSaveVehicle,
        handleEditVehicle,
        handleDuplicateVehicle,
        handleDeleteVehicle,
        handleSortChange,
        handleExportData,
        handleSearchChange,
        handleFilterChange
      })}
    </>
  );
};
