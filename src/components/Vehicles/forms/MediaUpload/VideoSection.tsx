
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Video, Upload, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { useVehicleVideos } from '@/hooks/useVehicleVideos';

interface VideoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const VideoSection = ({ vehicleId, vehicleData, readOnly = false }: VideoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { videos, uploading, generating, uploadVideo, generateVideo, removeVideo } = useVehicleVideos(vehicleId);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !readOnly) {
      // Verificar limite de 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('O vídeo deve ter no máximo 5MB.');
        return;
      }
      await uploadVideo(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerateVideo = async () => {
    if (vehicleData && !readOnly) {
      await generateVideo(vehicleData);
    }
  };

  if (readOnly && videos.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Vídeos do Veículo
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-3 pt-0">
            {!readOnly && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
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
                  onClick={handleGenerateVideo}
                  disabled={generating || !vehicleData}
                  className="flex items-center gap-2 text-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  {generating ? 'Gerando...' : 'Gerar IA'}
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((video) => (
                  <div key={video.id} className="relative group border rounded-lg overflow-hidden">
                    <video
                      src={video.video_url}
                      className="w-full h-24 object-cover"
                      controls
                      preload="metadata"
                    >
                      <source src={video.video_url} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>
                    
                    {!readOnly && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVideo(video.id)}
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
                ))}
              </div>
            )}

            {videos.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Video className="h-8 w-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Nenhum vídeo adicionado</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default VideoSection;
