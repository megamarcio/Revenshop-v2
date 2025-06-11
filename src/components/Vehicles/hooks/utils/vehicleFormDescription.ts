
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useAIGeneration } from '../../../../hooks/useAIGeneration';
import { VehicleFormData } from '../../types/vehicleFormTypes';

export const useVehicleFormDescription = (
  formData: VehicleFormData,
  setFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>
) => {
  const { t } = useLanguage();
  const { generateDescription: generateAIDescription, isLoading: isGeneratingDescription } = useAIGeneration();

  const generateDescription = async () => {
    try {
      // Extrair marca do nome do veículo
      const nameParts = formData.name.split(' ');
      const marca = nameParts[0] || '';
      const modelo = nameParts.slice(1).join(' ') || formData.model;

      const vehicleData = {
        marca,
        modelo,
        ano: formData.year,
        cor: formData.color,
        quilometragem: formData.miles,
        vin: formData.vin,
        precoVenda: formData.salePrice
      };

      const description = await generateAIDescription(vehicleData);
      setFormData(prev => ({ ...prev, description }));
      
      toast({
        title: t('success'),
        description: 'Descrição gerada automaticamente!',
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar descrição. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return {
    generateDescription,
    isGeneratingDescription
  };
};
