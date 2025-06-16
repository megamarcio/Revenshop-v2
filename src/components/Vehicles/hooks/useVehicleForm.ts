
import { useState } from 'react';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { getInitialFormData } from './utils/vehicleFormInitialData';
import { useVehicleFormHandlers } from './utils/vehicleFormHandlers';
import { useVehicleFormDescription } from './utils/vehicleFormDescription';
import { useVehicleFormCalculations } from './utils/vehicleFormCalculations';

export const useVehicleForm = (editingVehicle?: any) => {
  console.log('useVehicleForm - editingVehicle received:', editingVehicle);
  console.log('useVehicleForm - editingVehicle.id:', editingVehicle?.id);
  
  // Determine if editing (has valid ID) or creating new vehicle (no ID or ID is null/undefined)
  const isEditing = !!(editingVehicle && editingVehicle.id);
  console.log('useVehicleForm - isEditing determined as:', isEditing);
  
  const [formData, setFormData] = useState<VehicleFormData>(() => {
    const initialData = getInitialFormData(editingVehicle);
    console.log('useVehicleForm - formData state initialized with:', initialData);
    return initialData;
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [videos, setVideos] = useState<string[]>(
    editingVehicle?.video ? [editingVehicle.video] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  console.log('useVehicleForm - final state:');
  console.log('  - isEditing:', isEditing);
  console.log('  - formData.name:', formData.name);
  console.log('  - formData.miles:', formData.miles);
  console.log('  - formData.vin:', formData.vin);

  const {
    handleInputChange,
    handleCarfaxClick,
    validateFormData
  } = useVehicleFormHandlers(formData, setFormData, errors, setErrors);

  const {
    generateDescription,
    isGeneratingDescription
  } = useVehicleFormDescription(formData, setFormData);

  const {
    calculateProfitMargin
  } = useVehicleFormCalculations(formData.purchasePrice, formData.salePrice);

  return {
    formData,
    photos,
    videos,
    isLoading,
    errors,
    isEditing,
    isGeneratingDescription,
    setPhotos,
    setVideos,
    setIsLoading,
    handleInputChange,
    handleCarfaxClick,
    validateFormData,
    generateDescription,
    calculateProfitMargin
  };
};
