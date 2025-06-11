
import { useState } from 'react';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { createInitialFormData } from './utils/vehicleFormInitialData';
import { useVehicleFormHandlers } from './utils/vehicleFormHandlers';
import { useVehicleFormDescription } from './utils/vehicleFormDescription';
import { useVehicleFormCalculations } from './utils/vehicleFormCalculations';

export const useVehicleForm = (editingVehicle?: any) => {
  console.log('useVehicleForm - editingVehicle received:', editingVehicle);
  
  // Determine if editing (has valid ID) or creating/duplicating (no ID)
  const isEditing = editingVehicle && editingVehicle.id;
  
  const [formData, setFormData] = useState<VehicleFormData>(
    createInitialFormData(editingVehicle, isEditing)
  );

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [videos, setVideos] = useState<string[]>(
    editingVehicle?.video ? [editingVehicle.video] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  console.log('useVehicleForm - isEditing:', isEditing);
  console.log('useVehicleForm - formData initialized:', formData);
  console.log('useVehicleForm - miles value from editingVehicle:', editingVehicle?.miles);
  console.log('useVehicleForm - final miles in formData:', formData.miles);
  console.log('useVehicleForm - title fields:', {
    titleType: formData.titleType,
    titleStatus: formData.titleStatus,
    originalTitleType: editingVehicle?.title_type || editingVehicle?.titleType,
    originalTitleStatus: editingVehicle?.title_status || editingVehicle?.titleStatus
  });

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
