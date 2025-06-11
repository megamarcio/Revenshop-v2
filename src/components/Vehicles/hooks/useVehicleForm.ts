
import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { getTitleInfo, validateForm, generateDescription as generateDescriptionUtil, calculateProfitMargin } from '../utils/vehicleFormUtils';

export const useVehicleForm = (editingVehicle?: any) => {
  const { t } = useLanguage();
  
  console.log('useVehicleForm - editingVehicle received:', editingVehicle);
  
  // Determine if editing (has valid ID) or creating/duplicating (no ID)
  const isEditing = editingVehicle && editingVehicle.id;
  
  const [formData, setFormData] = useState<VehicleFormData>({
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    miles: editingVehicle?.miles?.toString() || '0', // CORRIGIDO: garantir que miles sempre tenha um valor padrão
    internalCode: editingVehicle?.internal_code || editingVehicle?.internalCode || '',
    color: editingVehicle?.color || '',
    caNote: editingVehicle?.ca_note?.toString() || editingVehicle?.caNote?.toString() || '',
    titleInfo: getTitleInfo(editingVehicle),
    purchasePrice: editingVehicle?.purchase_price?.toString() || editingVehicle?.purchasePrice?.toString() || '',
    salePrice: editingVehicle?.sale_price?.toString() || editingVehicle?.salePrice?.toString() || '',
    minNegotiable: editingVehicle?.min_negotiable?.toString() || editingVehicle?.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfax_price?.toString() || editingVehicle?.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle?.mmr_value?.toString() || editingVehicle?.mmrValue?.toString() || '',
    description: editingVehicle?.description || '',
    category: editingVehicle?.category || 'forSale',
    consignmentStore: editingVehicle?.consignment_store || editingVehicle?.consignmentStore || '',
    seller: editingVehicle?.seller || '',
    finalSalePrice: editingVehicle?.finalSalePrice?.toString() || '',
    saleDate: editingVehicle?.saleDate || '',
    saleNotes: editingVehicle?.saleNotes || '',
    customerName: editingVehicle?.customerName || '',
    customerPhone: editingVehicle?.customerPhone || '',
    paymentMethod: editingVehicle?.paymentMethod || '',
    financingCompany: editingVehicle?.financingCompany || '',
    checkDetails: editingVehicle?.checkDetails || '',
    otherPaymentDetails: editingVehicle?.otherPaymentDetails || '',
    sellerCommission: editingVehicle?.sellerCommission?.toString() || '',
    titleStatus: editingVehicle?.title_status || editingVehicle?.titleStatus || ''
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [videos, setVideos] = useState<string[]>(
    editingVehicle?.video ? [editingVehicle.video] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  console.log('useVehicleForm - isEditing:', isEditing);
  console.log('useVehicleForm - formData initialized:', formData);
  console.log('useVehicleForm - titleInfo final value:', formData.titleInfo);

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

  const generateDescription = () => {
    const description = generateDescriptionUtil(formData);
    setFormData(prev => ({ ...prev, description }));
    toast({
      title: t('success'),
      description: t('descriptionGenerated') || 'Descrição gerada automaticamente!',
    });
  };

  const getProfitMargin = () => calculateProfitMargin(formData.purchasePrice, formData.salePrice);

  return {
    formData,
    photos,
    videos,
    isLoading,
    errors,
    isEditing,
    setPhotos,
    setVideos,
    setIsLoading,
    handleInputChange,
    handleCarfaxClick,
    validateFormData,
    generateDescription,
    calculateProfitMargin: getProfitMargin
  };
};
