
import React from 'react';
import NewPhotosSection from './NewPhotosSection';

interface MediaUploadFormProps {
  vehicleId?: string;
  photos: string[];
  videos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
}

const MediaUploadForm = ({ 
  vehicleId, 
  photos, 
  videos, 
  setPhotos, 
  setVideos,
  readOnly = false 
}: MediaUploadFormProps) => {
  return (
    <>
      <NewPhotosSection
        vehicleId={vehicleId}
        readOnly={readOnly}
      />
    </>
  );
};

export default MediaUploadForm;
