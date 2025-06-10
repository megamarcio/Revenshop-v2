
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import MaintenanceViewModal from '../Maintenance/MaintenanceViewModal';
import VehicleFormHeader from './forms/VehicleFormHeader';
import VehicleFormContent from './forms/VehicleFormContent';
import VehicleFormActions from './forms/VehicleFormActions';
import { VehicleFormProps } from './types/vehicleFormTypes';
import { useVehicleForm } from './hooks/useVehicleForm';
import { useLanguage } from '../../contexts/LanguageContext';

const VehicleForm = ({ onClose, onSave, editingVehicle, onNavigateToCustomers }: VehicleFormProps) => {
  const { t } = useLanguage();
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  
  const {
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
    calculateProfitMargin
  } = useVehicleForm(editingVehicle);

  const handleViewMaintenance = () => {
    setShowMaintenanceModal(true);
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

    // Validate number of photos to avoid timeouts
    if (photos.length > 8) {
      const confirmed = window.confirm(
        t('photoWarning') || `Você está tentando salvar ${photos.length} fotos. Isso pode tornar o processo mais lento. Deseja continuar?`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        caNote: parseInt(formData.caNote),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        minNegotiable: parseFloat(formData.minNegotiable || '0'),
        carfaxPrice: parseFloat(formData.carfaxPrice || '0'),
        mmrValue: parseFloat(formData.mmrValue || '0'),
        finalSalePrice: formData.finalSalePrice ? parseFloat(formData.finalSalePrice) : undefined,
        sellerCommission: formData.sellerCommission ? parseFloat(formData.sellerCommission) : undefined,
        photos: photos,
        video: videos.length > 0 ? videos[0] : undefined,
        videos: videos,
        titleInfo: formData.titleInfo,
        ...(isEditing && { id: editingVehicle.id })
      };

      console.log('VehicleForm - submitting vehicleData:', vehicleData);
      console.log('VehicleForm - operation type:', isEditing ? 'update' : 'create');

      // Show loading with estimated timeout based on number of photos
      const estimatedTime = Math.max(5, photos.length * 2);
      if (photos.length > 5) {
        toast({
          title: t('processing') || 'Processando...',
          description: t('savingPhotos') || `Salvando ${photos.length} fotos. Isso pode levar até ${estimatedTime} segundos.`,
        });
      }

      await onSave(vehicleData);
      
      const successMessage = `Veículo ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`;
        
      toast({
        title: t('success'),
        description: successMessage,
      });
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      // Error already handled in useVehicles hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <VehicleFormHeader
            isEditing={isEditing}
            isLoading={isLoading}
            formData={formData}
            onClose={onClose}
            onCarfaxClick={handleCarfaxClick}
            onViewMaintenance={handleViewMaintenance}
          />
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <VehicleFormContent
                formData={formData}
                errors={errors}
                photos={photos}
                videos={videos}
                isEditing={isEditing}
                editingVehicle={editingVehicle}
                onInputChange={handleInputChange}
                onDescriptionChange={(value) => handleInputChange('description', value)}
                setPhotos={setPhotos}
                setVideos={setVideos}
                calculateProfitMargin={calculateProfitMargin}
                generateDescription={generateDescription}
                onViewMaintenance={handleViewMaintenance}
                onNavigateToCustomers={onNavigateToCustomers}
              />

              <VehicleFormActions
                isLoading={isLoading}
                isEditing={isEditing}
                photosCount={photos.length}
                onCancel={onClose}
              />
            </form>
          </CardContent>
        </Card>
      </div>

      {showMaintenanceModal && (
        <MaintenanceViewModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          vehicleId={editingVehicle?.id}
          vehicleName={formData.name}
        />
      )}
    </>
  );
};

export default VehicleForm;
