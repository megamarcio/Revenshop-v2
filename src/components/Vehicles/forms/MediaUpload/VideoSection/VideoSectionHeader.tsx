
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Video, ChevronDown } from 'lucide-react';

interface VideoSectionHeaderProps {
  videoCount: number;
  isOpen: boolean;
}

const VideoSectionHeader = ({ videoCount, isOpen }: VideoSectionHeaderProps) => {
  return (
    <CollapsibleTrigger asChild>
      <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vídeos do Veículo ({videoCount})
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CardTitle>
      </CardHeader>
    </CollapsibleTrigger>
  );
};

export default VideoSectionHeader;
