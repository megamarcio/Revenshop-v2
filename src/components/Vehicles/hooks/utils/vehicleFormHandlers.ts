
import { useState } from 'react';
import { VehicleFormData } from '../../types/vehicleFormTypes';
import { validateForm } from '../../utils/vehicleFormUtils';
import { toast } from '@/hooks/use-toast';

export const useVehicleFormHandlers = (
  formData: VehicleFormData,
  setFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>,
  errors: Partial<VehicleFormData>,
  setErrors: React.Dispatch<React.SetStateAction<Partial<VehicleFormData>>>
) => {
  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    console.log('useVehicleForm - handleInputChange:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'purchasePrice' || field === 'salePrice') {
      const purchase = field === 'purchasePrice' ? parseFloat(value) : parseFloat(formData.purchasePrice);
      const sale = field === 'salePrice' ? parseFloat(value) : parseFloat(formData.salePrice);
      
      if (purchase > 0 && sale > 0) {
        const margin = (sale / purchase).toFixed(2);
        console.log(`Margem de lucro calculada: ${margin}x`);
      }
    }
  };

  const handleCarfaxClick = () => {
    if (formData.vin) {
      window.open(`https://www.carfaxonline.com/vhr/${formData.vin}`, '_blank');
    } else {
      toast({
        title: 'Aviso',
        description: 'VIN é necessário para consultar o Carfax',
        variant: 'destructive',
      });
    }
  };

  const validateFormData = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    handleInputChange,
    handleCarfaxClick,
    validateFormData
  };
};
