import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import VehicleFormContent from './VehicleFormContent';
import VehicleFormHeader from './VehicleFormHeader';
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
  showSaleInfo: boolean;
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
  onNewMaintenance?: () => void;
  onCarfaxClick: () => void;
  onToggleFinancing: () => void;
  onToggleSaleInfo: () => void;
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
  showSaleInfo,
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
  onNewMaintenance,
  onCarfaxClick,
  onToggleFinancing,
  onToggleSaleInfo,
  onNavigateToCustomers,
  calculateProfitMargin,
  generateDescription,
  onWhatsAppSend
}: VehicleFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <VehicleFormHeader
          isEditing={isEditing}
          isAdmin={isAdmin}
          isInternalSeller={isInternalSeller}
          isLoading={isLoading}
          vehicleVin={editingVehicle?.vin}
          onClose={onClose}
          onViewMaintenance={onViewMaintenance}
          onNewMaintenance={onNewMaintenance}
          onCarfaxClick={onCarfaxClick}
          onWhatsAppSend={onWhatsAppSend}
        />

        <form onSubmit={onSubmit} className="space-y-6">
          <VehicleFormContent
            formData={formData}
            errors={errors}
            photos={photos}
            videos={videos}
            isEditing={isEditing}
            isGeneratingDescription={isGeneratingDescription}
            showFinancingInfo={showFinancingInfo}
            showSaleInfo={showSaleInfo}
            editingVehicle={editingVehicle}
            onInputChange={onInputChange}
            setPhotos={setPhotos}
            setVideos={setVideos}
            onViewMaintenance={onViewMaintenance}
            onNewMaintenance={onNewMaintenance}
            onToggleFinancing={onToggleFinancing}
            onToggleSaleInfo={onToggleSaleInfo}
            onNavigateToCustomers={onNavigateToCustomers}
            calculateProfitMargin={calculateProfitMargin}
            generateDescription={generateDescription}
          />

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleFormModal;
