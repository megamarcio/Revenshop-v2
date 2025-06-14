
import React from 'react';
import NewPhotosSection from './NewPhotosSection';
import CardPhotoSection from './CardPhotoSection';
import VideoSection from './VideoSection';

interface MediaUploadFormProps {
  vehicleId?: string;
  photos: string[];
  videos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
  vehicleData?: any; // Dados do formulário para os placeholders
}

const MediaUploadForm = ({ 
  vehicleId, 
  photos, 
  videos, 
  setPhotos, 
  setVideos,
  readOnly = false,
  vehicleData
}: MediaUploadFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardPhotoSection
          vehicleId={vehicleId}
          vehicleData={vehicleData}
          readOnly={readOnly}
        />
        
        <VideoSection
          vehicleId={vehicleId}
          vehicleData={vehicleData}
          readOnly={readOnly}
        />
      </div>
      
      <NewPhotosSection
        vehicleId={vehicleId}
        readOnly={readOnly}
      />
    </div>
  );
};

export default MediaUploadForm;
