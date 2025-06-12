import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import MaintenanceViewModal from '../Maintenance/MaintenanceViewModal';
import VehicleFormModal from './forms/VehicleFormModal';
import { VehicleFormProps } from './types/vehicleFormTypes';
import { useVehicleForm } from './hooks/useVehicleForm';
import WhatsAppSendModal from './WhatsAppSendModal';

interface ExtendedVehicleFormProps extends VehicleFormProps {
  onDelete?: (id: string) => Promise<void>;
}

const VehicleForm = ({ onClose, onSave, editingVehicle, onNavigateToCustomers, onDelete }: ExtendedVehicleFormProps) => {
  const { t } = useLanguage();
  const { isAdmin, isInternalSeller, canEditVehicles } = useAuth();
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showFinancingInfo, setShowFinancingInfo] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  const {
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
  } = useVehicleForm(editingVehicle);

  console.log('VehicleForm - editingVehicle:', editingVehicle);
  console.log('VehicleForm - isEditing:', isEditing);
  console.log('VehicleForm - formData title fields:', {
    titleTypeId: formData.titleTypeId,
    titleLocationId: formData.titleLocationId,
    titleLocationCustom: formData.titleLocationCustom
  });

  const handleViewMaintenance = () => {
    setShowMaintenanceModal(true);
  };

  const handleWhatsAppSend = () => {
    setShowWhatsAppModal(true);
  };

  const handleDelete = async () => {
    if (onDelete && editingVehicle?.id) {
      try {
        await onDelete(editingVehicle.id);
        toast({
          title: t('success'),
          description: 'Veículo excluído com sucesso!',
        });
        onClose();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast({
          title: t('error'),
          description: 'Erro ao excluir veículo.',
          variant: 'destructive',
        });
      }
    }
  };

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

  return (
    <>
      <VehicleFormModal
        isOpen={true}
        isEditing={isEditing}
        isLoading={isLoading}
        isAdmin={isAdmin}
        isInternalSeller={isInternalSeller}
        canEditVehicles={canEditVehicles}
        isGeneratingDescription={isGeneratingDescription}
        showFinancingInfo={showFinancingInfo}
        formData={formData}
        errors={errors}
        photos={photos}
        videos={videos}
        editingVehicle={editingVehicle}
        onClose={onClose}
        onSubmit={handleSubmit}
        onDelete={onDelete ? handleDelete : undefined}
        onInputChange={handleInputChange}
        setPhotos={setPhotos}
        setVideos={setVideos}
        onViewMaintenance={handleViewMaintenance}
        onCarfaxClick={handleCarfaxClick}
        onToggleFinancing={() => setShowFinancingInfo(!showFinancingInfo)}
        onNavigateToCustomers={onNavigateToCustomers}
        calculateProfitMargin={calculateProfitMargin}
        generateDescription={generateDescription}
        onWhatsAppSend={isEditing ? handleWhatsAppSend : undefined}
      />

      {showMaintenanceModal && (
        <MaintenanceViewModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          vehicleId={editingVehicle?.id}
          vehicleName={formData.name}
        />
      )}

      {showWhatsAppModal && editingVehicle && (
        <WhatsAppSendModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          vehicleData={{
            ...editingVehicle,
            photos: photos
          }}
        />
      )}
    </>
  );
};

export default VehicleForm;
