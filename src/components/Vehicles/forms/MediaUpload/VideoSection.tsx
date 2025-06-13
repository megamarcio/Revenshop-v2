
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Upload, Sparkles, Trash2, Play } from 'lucide-react';
import { useVehicleVideos } from '@/hooks/useVehicleVideos';

interface VideoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const VideoSection = ({ vehicleId, vehicleData, readOnly = false }: VideoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { videos, uploading, generating, uploadVideo, generateVideo, removeVideo } = useVehicleVideos(vehicleId);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !readOnly) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-5 w-5" />
          Vídeos do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Enviando...' : 'Upload Vídeo'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateVideo}
              disabled={generating || !vehicleData}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? 'Gerando...' : 'Gerar com IA'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative group border rounded-lg overflow-hidden">
                <video
                  src={video.video_url}
                  className="w-full h-40 object-cover"
                  controls
                  preload="metadata"
                >
                  <source src={video.video_url} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
                
                {!readOnly && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVideo(video.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {video.is_main && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {videos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum vídeo adicionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoSection;
