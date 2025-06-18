
import { useState, useEffect } from 'react';
import { VehicleFormData } from '../types/vehicleFormTypes';
import { useVehicleFormCalculations } from './utils/vehicleFormCalculations';
import { toast } from '@/hooks/use-toast';

const initialFormData: VehicleFormData = {
  name: '',
  vin: '',
  year: '',
  model: '',
  miles: '',
  internalCode: '',
  color: '',
  plate: '',
  sunpass: '',
  category: 'forSale',
  vehicleUsage: 'sale',
  consignmentStore: '',
  purchasePrice: '',
  salePrice: '',
  minNegotiable: '',
  carfaxPrice: '',
  mmrValue: '',
  seller: '',
  finalSalePrice: '',
  saleDate: '',
  saleNotes: '',
  customerName: '',
  customerPhone: '',
  paymentMethod: '',
  financingCompany: '',
  checkDetails: '',
  otherPaymentDetails: '',
  sellerCommission: '',
  financingBank: '',
  financingType: '',
  originalFinancedName: '',
  purchaseDate: '',
  dueDate: '',
  installmentValue: '',
  downPayment: '',
  financedAmount: '',
  totalInstallments: '',
  paidInstallments: '',
  remainingInstallments: '',
  totalToPay: '',
  payoffValue: '',
  payoffDate: '',
  interestRate: '',
  customFinancingBank: '',
  description: '',
  video: ''
};

export const useVehicleForm = (editingVehicle?: any) => {
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
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

  // Load editing vehicle data
  useEffect(() => {
    if (editingVehicle) {
      console.log('useVehicleForm - Loading editing vehicle:', editingVehicle);
      
      setFormData({
        name: editingVehicle.name || '',
        vin: editingVehicle.vin || '',
        year: editingVehicle.year?.toString() || '',
        model: editingVehicle.model || '',
        miles: editingVehicle.miles?.toString() || '',
        internalCode: editingVehicle.internal_code || editingVehicle.internalCode || '',
        color: editingVehicle.color || '',
        plate: editingVehicle.plate || '',
        sunpass: editingVehicle.sunpass || '',
        category: editingVehicle.category || 'forSale',
        vehicleUsage: editingVehicle.vehicleUsage || 'sale',
        consignmentStore: editingVehicle.consignmentStore || '',
        purchasePrice: editingVehicle.purchase_price?.toString() || editingVehicle.purchasePrice?.toString() || '',
        salePrice: editingVehicle.sale_price?.toString() || editingVehicle.salePrice?.toString() || '',
        minNegotiable: editingVehicle.min_negotiable?.toString() || editingVehicle.minNegotiable?.toString() || '',
        carfaxPrice: editingVehicle.carfax_price?.toString() || editingVehicle.carfaxPrice?.toString() || '',
        mmrValue: editingVehicle.mmr_value?.toString() || editingVehicle.mmrValue?.toString() || '',
        seller: editingVehicle.seller || '',
        finalSalePrice: editingVehicle.finalSalePrice?.toString() || '',
        saleDate: editingVehicle.saleDate || '',
        saleNotes: editingVehicle.saleNotes || '',
        customerName: editingVehicle.customerName || '',
        customerPhone: editingVehicle.customerPhone || '',
        paymentMethod: editingVehicle.paymentMethod || '',
        financingCompany: editingVehicle.financingCompany || '',
        checkDetails: editingVehicle.checkDetails || '',
        otherPaymentDetails: editingVehicle.otherPaymentDetails || '',
        sellerCommission: editingVehicle.sellerCommission?.toString() || '',
        financingBank: editingVehicle.financing_bank || editingVehicle.financingBank || '',
        financingType: editingVehicle.financing_type || editingVehicle.financingType || '',
        originalFinancedName: editingVehicle.original_financed_name || editingVehicle.originalFinancedName || '',
        purchaseDate: editingVehicle.purchase_date || editingVehicle.purchaseDate || '',
        dueDate: editingVehicle.due_date || editingVehicle.dueDate || '',
        installmentValue: editingVehicle.installment_value?.toString() || editingVehicle.installmentValue?.toString() || '',
        downPayment: editingVehicle.down_payment?.toString() || editingVehicle.downPayment?.toString() || '',
        financedAmount: editingVehicle.financed_amount?.toString() || editingVehicle.financedAmount?.toString() || '',
        totalInstallments: editingVehicle.total_installments?.toString() || editingVehicle.totalInstallments?.toString() || '',
        paidInstallments: editingVehicle.paid_installments?.toString() || editingVehicle.paidInstallments?.toString() || '',
        remainingInstallments: editingVehicle.remaining_installments?.toString() || editingVehicle.remainingInstallments?.toString() || '',
        totalToPay: editingVehicle.total_to_pay?.toString() || editingVehicle.totalToPay?.toString() || '',
        payoffValue: editingVehicle.payoff_value?.toString() || editingVehicle.payoffValue?.toString() || '',
        payoffDate: editingVehicle.payoff_date || editingVehicle.payoffDate || '',
        interestRate: editingVehicle.interest_rate?.toString() || editingVehicle.interestRate?.toString() || '',
        customFinancingBank: editingVehicle.custom_financing_bank || editingVehicle.customFinancingBank || '',
        description: editingVehicle.description || '',
        video: editingVehicle.video || ''
      });
      
      setPhotos(editingVehicle.photos || []);
      setVideos(editingVehicle.videos || (editingVehicle.video ? [editingVehicle.video] : []));
    }
  }, [editingVehicle]);

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
