
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles } from 'lucide-react';

interface VideoSectionActionsProps {
  uploading: boolean;
  generating: boolean;
  vehicleData?: any;
  vehicleId?: string;
  onUploadClick: () => void;
  onGenerateClick: () => void;
}

const VideoSectionActions = ({
  uploading,
  generating,
  vehicleData,
  vehicleId,
  onUploadClick,
  onGenerateClick
}: VideoSectionActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        disabled={uploading}
        className="flex items-center gap-2 text-xs"
      >
        <Upload className="h-3 w-3" />
        {uploading ? 'Enviando...' : 'Upload'}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onGenerateClick}
        disabled={generating || !vehicleData || !vehicleId}
        className="flex items-center gap-2 text-xs"
        title={!vehicleData ? 'Preencha os dados básicos do veículo primeiro' : !vehicleId ? 'Salve o veículo primeiro' : 'Gerar vídeo com IA'}
      >
        <Sparkles className="h-3 w-3" />
        {generating ? 'Gerando...' : 'Gerar IA'}
      </Button>
    </div>
  );
};

export default VideoSectionActions;
