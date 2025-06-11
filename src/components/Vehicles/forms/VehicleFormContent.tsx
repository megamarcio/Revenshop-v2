
import React from 'react';
import BasicInfoForm from './BasicInfoForm';
import FinancialInfoForm from './FinancialInfoForm';
import SaleInfoForm from './SaleInfoForm';
import MediaUploadForm from './MediaUpload';
import DescriptionForm from './DescriptionForm';
import FinancingInfoForm from './FinancingInfoForm';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface VehicleFormContentProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  photos: string[];
  videos: string[];
  isEditing: boolean;
  isGeneratingDescription: boolean;
  showFinancingInfo: boolean;
  editingVehicle?: any;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  onViewMaintenance: () => void;
  onToggleFinancing: () => void;
  onNavigateToCustomers?: () => void;
  calculateProfitMargin: () => string;
  generateDescription: () => Promise<void>;
}

const VehicleFormContent = ({
  formData,
  errors,
  photos,
  videos,
  isEditing,
  isGeneratingDescription,
  showFinancingInfo,
  editingVehicle,
  onInputChange,
  setPhotos,
  setVideos,
  onViewMaintenance,
  onToggleFinancing,
  onNavigateToCustomers,
  calculateProfitMargin,
  generateDescription
}: VehicleFormContentProps) => {
  return (
    <div className="space-y-6">
      <BasicInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
      />

      <FinancialInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        calculateProfitMargin={calculateProfitMargin}
        vehicleId={isEditing ? editingVehicle?.id : undefined}
        onViewMaintenance={onViewMaintenance}
      />

      <FinancingInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        isOpen={showFinancingInfo}
        onToggle={onToggleFinancing}
      />

      <SaleInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        onNavigateToCustomers={onNavigateToCustomers}
      />

      <MediaUploadForm
        vehicleId={isEditing ? editingVehicle?.id : undefined}
        photos={photos}
        videos={videos}
        setPhotos={setPhotos}
        setVideos={setVideos}
      />

      <DescriptionForm
        description={formData.description}
        onDescriptionChange={(value) => onInputChange('description', value)}
        generateDescription={generateDescription}
        isGenerating={isGeneratingDescription}
      />
    </div>
  );
};

export default VehicleFormContent;
