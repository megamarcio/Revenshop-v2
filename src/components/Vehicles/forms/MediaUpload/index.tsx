
import React from 'react';
import PhotoUploadSection from './PhotoUploadSection';
import VideoUploadSection from './VideoUploadSection';

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
      <PhotoUploadSection
        vehicleId={vehicleId}
        photos={photos}
        setPhotos={setPhotos}
        readOnly={readOnly}
      />

      <VideoUploadSection
        videos={videos}
        setVideos={setVideos}
        readOnly={readOnly}
      />
    </>
  );
};

export default MediaUploadForm;
