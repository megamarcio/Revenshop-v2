import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VehicleFormHeader from './VehicleFormHeader';
import VehicleFormContent from './VehicleFormContent';
import VehicleFormActions from './VehicleFormActions';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface VehicleFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isInternalSeller: boolean;
  canEditVehicles: boolean;
  isGeneratingDescription: boolean;
  showFinancingInfo: boolean;
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  photos: string[];
  videos: string[];
  editingVehicle?: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  onViewMaintenance: () => void;
  onCarfaxClick: () => void;
  onToggleFinancing: () => void;
  onNavigateToCustomers?: () => void;
  calculateProfitMargin: () => string;
  generateDescription: () => Promise<void>;
  onWhatsAppSend?: () => void;
}

const VehicleFormModal = ({
  isOpen,
  isEditing,
  isLoading,
  isAdmin,
  isInternalSeller,
  canEditVehicles,
  isGeneratingDescription,
  showFinancingInfo,
  formData,
  errors,
  photos,
  videos,
  editingVehicle,
  onClose,
  onSubmit,
  onDelete,
  onInputChange,
  setPhotos,
  setVideos,
  onViewMaintenance,
  onCarfaxClick,
  onToggleFinancing,
  onNavigateToCustomers,
  calculateProfitMargin,
  generateDescription,
  onWhatsAppSend
}: VehicleFormModalProps) => {
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const modal = document.querySelector('[data-vehicle-form-modal]');
      
      if (modal && !modal.contains(target) && !isLoading) {
        onClose();
      }
    };

    document.removeEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" data-vehicle-form-modal>
        <VehicleFormHeader
          isEditing={isEditing}
          isAdmin={isAdmin}
          isInternalSeller={isInternalSeller}
          isLoading={isLoading}
          vehicleVin={formData.vin}
          onClose={onClose}
          onViewMaintenance={onViewMaintenance}
          onCarfaxClick={onCarfaxClick}
          onWhatsAppSend={onWhatsAppSend}
        />
        
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <VehicleFormContent
              formData={formData}
              errors={errors}
              photos={photos}
              videos={videos}
              isEditing={isEditing}
              isGeneratingDescription={isGeneratingDescription}
              showFinancingInfo={showFinancingInfo}
              editingVehicle={editingVehicle}
              onInputChange={onInputChange}
              setPhotos={setPhotos}
              setVideos={setVideos}
              onViewMaintenance={onViewMaintenance}
              onToggleFinancing={onToggleFinancing}
              onNavigateToCustomers={onNavigateToCustomers}
              calculateProfitMargin={calculateProfitMargin}
              generateDescription={generateDescription}
            />

            <VehicleFormActions
              isEditing={isEditing}
              isLoading={isLoading}
              canEditVehicles={canEditVehicles}
              onClose={onClose}
              onDelete={onDelete}
              showDeleteButton={!!(onDelete && editingVehicle?.id)}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleFormModal;
