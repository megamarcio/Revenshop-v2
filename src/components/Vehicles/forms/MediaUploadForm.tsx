
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, Image, Video } from 'lucide-react';

interface MediaUploadFormProps {
  photos: string[];
  videos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
}

const MediaUploadForm = ({ photos, videos, setPhotos, setVideos }: MediaUploadFormProps) => {
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || photos.length >= 10) return;

    const maxFiles = Math.min(files.length, 10 - photos.length);
    const fileArray = Array.from(files).slice(0, maxFiles);
    
    try {
      // Process files in batches to avoid memory issues
      const batchSize = 3;
      for (let i = 0; i < fileArray.length; i += batchSize) {
        const batch = fileArray.slice(i, i + batchSize);
        
        const batchPromises = batch.map(file => {
          return new Promise<string>((resolve, reject) => {
            // Limit file size to 2MB
            if (file.size > 2 * 1024 * 1024) {
              console.warn(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Skipping.`);
              resolve('');
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              } else {
                resolve('');
              }
            };
            reader.onerror = () => {
              console.error(`Error reading file ${file.name}`);
              resolve('');
            };
            reader.readAsDataURL(file);
          });
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(result => result !== '');
        
        if (validResults.length > 0) {
          setPhotos(prev => {
            const newPhotos = [...prev, ...validResults];
            return newPhotos.slice(0, 10); // Ensure max 10 photos
          });
        }
      }
    } catch (error) {
      console.error('Error processing photos:', error);
    }
    
    // Clear the input
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || videos.length >= 2) return;

    const maxFiles = Math.min(files.length, 2 - videos.length);
    const fileArray = Array.from(files).slice(0, maxFiles);

    fileArray.forEach(file => {
      // Limit video file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        console.warn('Video file is too large. Maximum size is 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setVideos(prev => [...prev, e.target.result as string]);
        }
      };
      reader.onerror = () => {
        console.error('Error reading video file');
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input
    event.target.value = '';
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Upload de Fotos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Fotos ({photos.length}/10)</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {photos.length < 10 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-revenshop-primary">
              <Plus className="h-6 w-6 text-gray-400" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        {photos.length >= 8 && (
          <p className="text-sm text-amber-600">
            Atenção: Muitas fotos podem tornar o salvamento mais lento
          </p>
        )}
      </div>

      {/* Upload de Vídeos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Video className="h-5 w-5" />
          <span>Vídeos ({videos.length}/2)</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {videos.map((video, index) => (
            <div key={index} className="relative group">
              <video
                src={video}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {videos.length < 2 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-revenshop-primary">
              <Plus className="h-6 w-6 text-gray-400" />
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </>
  );
};

export default MediaUploadForm;
