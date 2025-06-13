
import React from 'react';
import NewPhotosSection from './NewPhotosSection';
import CardPhotoSection from './CardPhotoSection';

interface MediaUploadFormProps {
  vehicleId?: string;
  vehicleData?: any;
  photos: string[];
  videos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
}

const MediaUploadForm = ({ 
  vehicleId, 
  vehicleData,
  photos, 
  videos, 
  setPhotos, 
  setVideos,
  readOnly = false 
}: MediaUploadFormProps) => {
  return (
    <div className="space-y-8">
      <CardPhotoSection
        vehicleId={vehicleId}
        vehicleData={vehicleData}
        readOnly={readOnly}
      />
      
      <NewPhotosSection
        vehicleId={vehicleId}
        readOnly={readOnly}
      />
    </div>
  );
};

export default MediaUploadForm;
