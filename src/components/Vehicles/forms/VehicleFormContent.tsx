
import React from 'react';
import BasicInfoForm from './BasicInfoForm';
import FinancialInfoForm from './FinancialInfoForm';
import SaleInfoForm from './SaleInfoForm';
import MediaUploadForm from './MediaUploadForm';
import DescriptionForm from './DescriptionForm';

interface VehicleFormContentProps {
  formData: any;
  errors: any;
  photos: string[];
  videos: string[];
  isEditing: boolean;
  editingVehicle?: any;
  onInputChange: (field: string, value: string) => void;
  onDescriptionChange: (value: string) => void;
  setPhotos: (photos: string[]) => void;
  setVideos: (videos: string[]) => void;
  calculateProfitMargin: () => string;
  generateDescription: () => void;
  onViewMaintenance: () => void;
  onNavigateToCustomers?: () => void;
}

const VehicleFormContent = ({
  formData,
  errors,
  photos,
  videos,
  isEditing,
  editingVehicle,
  onInputChange,
  onDescriptionChange,
  setPhotos,
  setVideos,
  calculateProfitMargin,
  generateDescription,
  onViewMaintenance,
  onNavigateToCustomers
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

      <SaleInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        onNavigateToCustomers={onNavigateToCustomers}
      />

      <MediaUploadForm
        photos={photos}
        videos={videos}
        setPhotos={setPhotos}
        setVideos={setVideos}
      />

      <DescriptionForm
        description={formData.description}
        onDescriptionChange={onDescriptionChange}
        generateDescription={generateDescription}
      />
    </div>
  );
};

export default VehicleFormContent;
