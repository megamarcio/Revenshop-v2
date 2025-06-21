import { useState, useEffect } from 'react';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { useVehicleFormCalculations } from './utils/vehicleFormCalculations';
import { getInitialFormData } from './utils/vehicleFormInitialData';
import { toast } from '@/hooks/use-toast';

export const useVehicleForm = (editingVehicle?: any) => {
  const [formData, setFormData] = useState<VehicleFormData>(() => getInitialFormData(editingVehicle));
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  const isEditing = !!editingVehicle;
  
  const { calculateProfitMargin } = useVehicleFormCalculations(
    formData.purchasePrice,
    formData.salePrice
  );

  useEffect(() => {
    if (editingVehicle) {
      const initialData = getInitialFormData(editingVehicle);
      setFormData(initialData);
      setPhotos(editingVehicle.photos || []);
      setVideos(editingVehicle.videos || (editingVehicle.video ? [editingVehicle.video] : []));
    } else {
      const cleanData = getInitialFormData();
      setFormData(cleanData);
      setPhotos([]);
      setVideos([]);
    }
  }, [editingVehicle?.id]);

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCarfaxClick = () => {
    if (formData.vin) {
      const carfaxUrl = `https://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVG_0&vin=${formData.vin}`;
      window.open(carfaxUrl, '_blank');
    }
  };

  const validateFormData = (): boolean => {
    const newErrors: Partial<VehicleFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.vin.trim()) newErrors.vin = 'VIN é obrigatório';
    if (!formData.year.trim()) newErrors.year = 'Ano é obrigatório';
    if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
    if (!formData.purchasePrice.trim()) newErrors.purchasePrice = 'Valor de compra é obrigatório';
    if (!formData.salePrice.trim()) newErrors.salePrice = 'Valor de venda é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateDescription = async () => {
    if (!formData.name || !formData.year || !formData.color) {
      toast({
        title: 'Erro',
        description: 'Preencha pelo menos o nome, ano e cor do veículo antes de gerar a descrição.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const generatedDescription = `${formData.name} ${formData.year} na cor ${formData.color}. Veículo em excelente estado de conservação.`;
      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }));
      toast({
        title: 'Sucesso',
        description: 'Descrição gerada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar descrição. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

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
