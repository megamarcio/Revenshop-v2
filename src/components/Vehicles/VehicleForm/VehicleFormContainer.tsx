
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import MaintenanceViewModal from '../../Maintenance/MaintenanceViewModal';
import VehicleFormModal from '../forms/VehicleFormModal';
import WhatsAppSendModal from '../WhatsAppSendModal';
import { VehicleFormProps } from '../types/vehicleFormTypes';
import { useVehicleForm } from '../hooks/useVehicleForm';
import { useVehicleFormSubmission } from './hooks/useVehicleFormSubmission';

interface ExtendedVehicleFormProps extends VehicleFormProps {
  onDelete?: (id: string) => Promise<void>;
}

const VehicleFormContainer = ({ 
  onClose, 
  onSave, 
  editingVehicle, 
  onNavigateToCustomers, 
  onDelete 
}: ExtendedVehicleFormProps) => {
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

  const { handleSubmit } = useVehicleFormSubmission({
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

export default VehicleFormContainer;
