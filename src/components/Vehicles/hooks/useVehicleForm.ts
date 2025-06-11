import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { getTitleInfo, validateForm, calculateProfitMargin } from '../utils/vehicleFormUtils';
import { useAIGeneration } from '../../../hooks/useAIGeneration';

export const useVehicleForm = (editingVehicle?: any) => {
  const { t } = useLanguage();
  const { generateDescription: generateAIDescription, isLoading: isGeneratingDescription } = useAIGeneration();
  
  console.log('useVehicleForm - editingVehicle received:', editingVehicle);
  
  // Determine if editing (has valid ID) or creating/duplicating (no ID)
  const isEditing = editingVehicle && editingVehicle.id;
  
  // For new vehicles, start with blank internal code
  const getInitialInternalCode = () => {
    if (isEditing && (editingVehicle?.internal_code || editingVehicle?.internalCode)) {
      return editingVehicle.internal_code || editingVehicle.internalCode;
    }
    return ''; // Start with blank for new vehicles
  };
  
  const [formData, setFormData] = useState<VehicleFormData>({
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    miles: editingVehicle?.miles?.toString() || '0',
    internalCode: getInitialInternalCode(),
    color: editingVehicle?.color || '',
    caNote: editingVehicle?.ca_note?.toString() || editingVehicle?.caNote?.toString() || '',
    titleInfo: getTitleInfo(editingVehicle),
    titleType: editingVehicle?.title_type || editingVehicle?.titleType || 'clean-title',
    titleStatus: editingVehicle?.title_status || editingVehicle?.titleStatus || 'em-maos',
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
    
    // Novos campos de financiamento
    financingBank: editingVehicle?.financing_bank || editingVehicle?.financingBank || '',
    financingType: editingVehicle?.financing_type || editingVehicle?.financingType || '',
    originalFinancedName: editingVehicle?.original_financed_name || editingVehicle?.originalFinancedName || '',
    purchaseDate: editingVehicle?.purchase_date || editingVehicle?.purchaseDate || '',
    dueDate: editingVehicle?.due_date || editingVehicle?.dueDate || '',
    installmentValue: editingVehicle?.installment_value?.toString() || editingVehicle?.installmentValue?.toString() || '',
    downPayment: editingVehicle?.down_payment?.toString() || editingVehicle?.downPayment?.toString() || '',
    financedAmount: editingVehicle?.financed_amount?.toString() || editingVehicle?.financedAmount?.toString() || '',
    totalInstallments: editingVehicle?.total_installments?.toString() || editingVehicle?.totalInstallments?.toString() || '',
    paidInstallments: editingVehicle?.paid_installments?.toString() || editingVehicle?.paidInstallments?.toString() || '',
    remainingInstallments: editingVehicle?.remaining_installments?.toString() || editingVehicle?.remainingInstallments?.toString() || '',
    totalToPay: editingVehicle?.total_to_pay?.toString() || editingVehicle?.totalToPay?.toString() || '',
    payoffValue: editingVehicle?.payoff_value?.toString() || editingVehicle?.payoffValue?.toString() || '',
    payoffDate: editingVehicle?.payoff_date || editingVehicle?.payoffDate || '',
    interestRate: editingVehicle?.interest_rate?.toString() || editingVehicle?.interestRate?.toString() || '',
    customFinancingBank: editingVehicle?.custom_financing_bank || editingVehicle?.customFinancingBank || ''
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [videos, setVideos] = useState<string[]>(
    editingVehicle?.video ? [editingVehicle.video] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  console.log('useVehicleForm - isEditing:', isEditing);
  console.log('useVehicleForm - formData initialized:', formData);
  console.log('useVehicleForm - titleStatus final value:', formData.titleStatus);

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

  const getProfitMargin = () => calculateProfitMargin(formData.purchasePrice, formData.salePrice);

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
    calculateProfitMargin: getProfitMargin
  };
};
