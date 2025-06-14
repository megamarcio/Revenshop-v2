
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Info } from 'lucide-react';
import type { VehicleVideo } from '@/hooks/useVehicleVideos';

interface VideoItemProps {
  video: VehicleVideo;
  readOnly?: boolean;
  onRemove: (videoId: string) => void;
}

const VideoItem = ({ video, readOnly = false, onRemove }: VideoItemProps) => {
  return (
    <div className="relative group border rounded-lg overflow-hidden">
      <video
        src={video.video_url}
        className="w-full h-24 object-cover"
        controls
        preload="metadata"
      >
        <source src={video.video_url} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
      
      <div className="absolute top-1 left-1 flex gap-1">
        {video.prompt_used && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                <Info className="h-3 w-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs"><strong>Prompt usado:</strong></p>
              <p className="text-xs mt-1">{video.prompt_used}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {!readOnly && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(video.id)}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {video.is_main && (
        <div className="absolute bottom-1 left-1">
          <span className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
            Principal
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoItem;
