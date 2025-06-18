
import { useState, useEffect } from 'react';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { useVehicleFormCalculations } from './utils/vehicleFormCalculations';
import { getInitialFormData } from './utils/vehicleFormInitialData';
import { toast } from '@/hooks/use-toast';

export const useVehicleForm = (editingVehicle?: any) => {
  console.log('useVehicleForm - hook called with editingVehicle:', editingVehicle);
  console.log('useVehicleForm - editingVehicle?.id:', editingVehicle?.id);
  console.log('useVehicleForm - editingVehicle?.vehicleUsage:', editingVehicle?.vehicleUsage);
  console.log('useVehicleForm - editingVehicle?.usage:', editingVehicle?.usage);
  
  const [formData, setFormData] = useState<VehicleFormData>(() => {
    // Initialize with proper data from the start
    console.log('useVehicleForm - Initial state setup with editingVehicle:', editingVehicle);
    const initialData = getInitialFormData(editingVehicle);
    console.log('useVehicleForm - Initial state vehicleUsage:', initialData.vehicleUsage);
    return initialData;
  });
  
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

  // Load editing vehicle data using the centralized function
  useEffect(() => {
    console.log('useVehicleForm useEffect - editingVehicle changed:', editingVehicle);
    console.log('useVehicleForm useEffect - editingVehicle?.vehicleUsage:', editingVehicle?.vehicleUsage);
    console.log('useVehicleForm useEffect - editingVehicle?.usage:', editingVehicle?.usage);
    
    if (editingVehicle) {
      console.log('useVehicleForm useEffect - processing editing vehicle with ID:', editingVehicle.id);
      
      // CRÍTICO: Usar APENAS a função getInitialFormData para garantir consistência
      const initialData = getInitialFormData(editingVehicle);
      console.log('useVehicleForm useEffect - initialData from getInitialFormData:', initialData);
      console.log('useVehicleForm useEffect - vehicleUsage from initialData:', initialData.vehicleUsage);
      
      setFormData(initialData);
      setPhotos(editingVehicle.photos || []);
      setVideos(editingVehicle.videos || (editingVehicle.video ? [editingVehicle.video] : []));
      
      console.log('useVehicleForm useEffect - formData updated with vehicleUsage:', initialData.vehicleUsage);
    } else {
      // For new vehicles, reset to clean initial data
      console.log('useVehicleForm useEffect - resetting to clean data for new vehicle');
      const cleanData = getInitialFormData();
      console.log('useVehicleForm useEffect - clean data vehicleUsage:', cleanData.vehicleUsage);
      setFormData(cleanData);
      setPhotos([]);
      setVideos([]);
    }
  }, [editingVehicle]);

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    console.log(`useVehicleForm - handleInputChange: ${field} = ${value}`);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Log specifically for vehicleUsage changes
      if (field === 'vehicleUsage') {
        console.log('useVehicleForm - vehicleUsage changed to:', value);
        console.log('useVehicleForm - formData after vehicleUsage change:', newData);
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
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
      // Simulate API call for description generation
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
