
import React from 'react';
import { Video } from 'lucide-react';
import VideoItem from './VideoItem';
import type { VehicleVideo } from '@/hooks/useVehicleVideos';

interface VideoListProps {
  videos: VehicleVideo[];
  readOnly?: boolean;
  onRemoveVideo: (videoId: string) => void;
}

const VideoList = ({ videos, readOnly = false, onRemoveVideo }: VideoListProps) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Video className="h-8 w-8 mx-auto mb-1 opacity-50" />
        <p className="text-xs">Nenhum vídeo adicionado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          video={video}
          readOnly={readOnly}
          onRemove={onRemoveVideo}
        />
      ))}
    </div>
  );
};

export default VideoList;
