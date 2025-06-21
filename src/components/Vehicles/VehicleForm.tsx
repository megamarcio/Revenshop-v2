import React, { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import MaintenanceViewModal from '../Maintenance/MaintenanceViewModal';
import VehicleFormModal from './forms/VehicleFormModal';
import { VehicleFormProps } from './types/vehicleFormTypes';
import { useVehicleForm } from './hooks/useVehicleForm';
import WhatsAppSendModal from './WhatsAppSendModal';
import { X } from 'lucide-react';
import MaintenanceForm from '../Maintenance/MaintenanceForm';
import { validateForm } from './utils/vehicleFormUtils';

interface ExtendedVehicleFormProps extends VehicleFormProps {
  onDelete?: (id: string) => Promise<void>;
}

const VehicleForm = ({ onClose, onSave, editingVehicle, onNavigateToCustomers, onDelete }: ExtendedVehicleFormProps) => {
  const { t } = useLanguage();
  const { isAdmin, isInternalSeller, canEditVehicles } = useAuth();
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showNewMaintenanceModal, setShowNewMaintenanceModal] = useState(false);
  
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

  const [showFinancingInfo, setShowFinancingInfo] = useState(false);
  const [showSaleInfo, setShowSaleInfo] = useState(false);

  const handleViewMaintenance = () => {
    setShowMaintenanceModal(true);
  };

  const handleNewMaintenance = () => {
    setShowNewMaintenanceModal(true);
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
    
    // Usar a validação detalhada do vehicleFormUtils
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      // Criar mensagem detalhada com os campos que falharam
      const errorFields = Object.keys(validationErrors);
      const errorMessages = errorFields.map(field => `• ${validationErrors[field]}`);
      
      let errorDescription = 'Por favor, corrija os seguintes campos obrigatórios:\n\n';
      errorDescription += errorMessages.join('\n');
      
      toast({
        title: t('error'),
        description: errorDescription,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('VehicleForm - handleSubmit - START');
      console.log('VehicleForm - handleSubmit - formData.plate:', formData.plate);
      console.log('VehicleForm - handleSubmit - formData.sunpass:', formData.sunpass);
      
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
        
        // CRITICAL: Explicitly ensure plate and sunpass are included
        plate: formData.plate,
        sunpass: formData.sunpass,
        
        // CRÍTICO: Garantir que vehicleUsage seja incluído
        vehicleUsage: formData.vehicleUsage,
        consignmentStore: formData.consignmentStore,
        
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
      console.log('VehicleForm - vehicleData.plate being sent:', vehicleData.plate);
      console.log('VehicleForm - vehicleData.sunpass being sent:', vehicleData.sunpass);
      console.log('VehicleForm - vehicleData.vehicleUsage being sent:', vehicleData.vehicleUsage);
      console.log('VehicleForm - vehicleData.consignmentStore being sent:', vehicleData.consignmentStore);
      console.log('VehicleForm - vehicleData.category being sent:', vehicleData.category);
      console.log('VehicleForm - vehicleData.photos being sent:', vehicleData.photos);
      console.log('VehicleForm - vehicleData.videos being sent:', vehicleData.videos);

      await onSave(vehicleData);
      
      const successMessage = `Veículo ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`;
      
      toast({
        title: t('success'),
        description: successMessage,
      });
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      
      // Extrair mensagem de erro específica
      let errorMessage = 'Erro desconhecido ao salvar veículo';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      // Verificar se é um erro do Supabase
      if (error && typeof error === 'object' && 'details' in error) {
        const supabaseError = error as any;
        if (supabaseError.details) {
          errorMessage = `${errorMessage} - Detalhes: ${supabaseError.details}`;
        }
        if (supabaseError.hint) {
          errorMessage = `${errorMessage} - Dica: ${supabaseError.hint}`;
        }
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
        <VehicleFormModal
          isOpen={true}
          isEditing={isEditing}
          isLoading={isLoading}
          isAdmin={isAdmin}
          isInternalSeller={isInternalSeller}
          canEditVehicles={canEditVehicles}
          isGeneratingDescription={isGeneratingDescription}
          showFinancingInfo={showFinancingInfo}
          showSaleInfo={showSaleInfo}
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
          onNewMaintenance={handleNewMaintenance}
          onCarfaxClick={handleCarfaxClick}
          onToggleFinancing={() => setShowFinancingInfo(!showFinancingInfo)}
          onToggleSaleInfo={() => setShowSaleInfo(!showSaleInfo)}
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

        {showNewMaintenanceModal && editingVehicle?.id && (
          <MaintenanceForm
            open={showNewMaintenanceModal}
            onClose={() => setShowNewMaintenanceModal(false)}
            editingMaintenance={null}
            preSelectedVehicleId={editingVehicle.id}
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
      </div>
    </div>
  );
};

export default VehicleForm;
