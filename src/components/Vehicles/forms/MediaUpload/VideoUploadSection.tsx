
import React from 'react';
import { Plus, X, Video } from 'lucide-react';

interface VideoUploadSectionProps {
  videos: string[];
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
}

const VideoUploadSection = ({ 
  videos, 
  setVideos,
  readOnly = false 
}: VideoUploadSectionProps) => {
  const canEdit = !readOnly;

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    
    const files = event.target.files;
    if (!files || videos.length >= 2) return;

    const maxFiles = Math.min(files.length, 2 - videos.length);
    const fileArray = Array.from(files).slice(0, maxFiles);

    fileArray.forEach(file => {
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
    
    event.target.value = '';
  };

  const removeVideo = (index: number) => {
    if (!canEdit) return;
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
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
            {canEdit && (
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        
        {canEdit && videos.length < 2 && (
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
  );
};

export default VideoUploadSection;
