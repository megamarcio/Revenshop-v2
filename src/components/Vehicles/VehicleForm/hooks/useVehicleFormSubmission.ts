
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { VehicleFormData } from '../../types/vehicleFormTypes';

interface UseVehicleFormSubmissionProps {
  formData: VehicleFormData;
  photos: string[];
  videos: string[];
  isEditing: boolean;
  editingVehicle?: any;
  validateFormData: () => boolean;
  setIsLoading: (loading: boolean) => void;
  onSave: (vehicleData: any) => Promise<void>;
  onClose: () => void;
  t: (key: string) => string;
}

export const useVehicleFormSubmission = ({
  formData,
  photos,
  videos,
  isEditing,
  editingVehicle,
  validateFormData,
  setIsLoading,
  onSave,
  onClose,
  t
}: UseVehicleFormSubmissionProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      toast({
        title: t('error'),
        description: t('fixRequiredFields') || 'Por favor, corrija os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const vehicleData: any = {
        ...formData,
        year: parseInt(formData.year),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        minNegotiable: formData.minNegotiable ? parseFloat(formData.minNegotiable) : undefined,
        carfaxPrice: formData.carfaxPrice ? parseFloat(formData.carfaxPrice) : undefined,
        mmrValue: formData.mmrValue ? parseFloat(formData.mmrValue) : undefined,
        finalSalePrice: formData.finalSalePrice ? parseFloat(formData.finalSalePrice) : undefined,
        sellerCommission: formData.sellerCommission ? parseFloat(formData.sellerCommission) : undefined,
        
        // Campos de título - GARANTIR que sejam incluídos
        titleTypeId: formData.titleTypeId,
        titleLocationId: formData.titleLocationId,
        titleLocationCustom: formData.titleLocationCustom,
        
        // Campos de financiamento - garantir que todos sejam enviados
        financingBank: formData.financingBank,
        financingType: formData.financingType,
        originalFinancedName: formData.originalFinancedName,
        purchaseDate: formData.purchaseDate,
        dueDate: formData.dueDate,
        installmentValue: formData.installmentValue ? parseFloat(formData.installmentValue) : undefined,
        downPayment: formData.downPayment ? parseFloat(formData.downPayment) : undefined,
        financedAmount: formData.financedAmount ? parseFloat(formData.financedAmount) : undefined,
        totalInstallments: formData.totalInstallments ? parseInt(formData.totalInstallments) : undefined,
        paidInstallments: formData.paidInstallments ? parseInt(formData.paidInstallments) : undefined,
        remainingInstallments: formData.remainingInstallments ? parseInt(formData.remainingInstallments) : undefined,
        totalToPay: formData.totalToPay ? parseFloat(formData.totalToPay) : undefined,
        payoffValue: formData.payoffValue ? parseFloat(formData.payoffValue) : undefined,
        payoffDate: formData.payoffDate,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        customFinancingBank: formData.customFinancingBank,
        
        photos: photos,
        video: videos.length > 0 ? videos[0] : undefined,
        videos: videos
      };

      // CRÍTICO: Garantir que o ID seja incluído para edição
      if (isEditing && editingVehicle?.id) {
        vehicleData.id = editingVehicle.id;
        console.log('VehicleForm - handleSubmit - adding ID for update:', editingVehicle.id);
      }

      console.log('VehicleForm - submitting vehicleData:', vehicleData);
      console.log('VehicleForm - title fields being submitted:', {
        titleTypeId: vehicleData.titleTypeId,
        titleLocationId: vehicleData.titleLocationId,
        titleLocationCustom: vehicleData.titleLocationCustom
      });

      await onSave(vehicleData);
      
      const successMessage = `Veículo ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`;
        
      toast({
        title: t('success'),
        description: successMessage,
      });
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};
