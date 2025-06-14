
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useVehicleVideos } from '@/hooks/useVehicleVideos';
import VideoSectionHeader from './VideoSection/VideoSectionHeader';
import VideoSectionActions from './VideoSection/VideoSectionActions';
import VideoList from './VideoSection/VideoList';

interface VideoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const VideoSection = ({ vehicleId, vehicleData, readOnly = false }: VideoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { videos, uploading, generating, uploadVideo, generateVideo, removeVideo, refetch } = useVehicleVideos(vehicleId);

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
    console.log('🎯 VideoSection - handleGenerateVideo called');
    console.log('🔍 vehicleData:', vehicleData);
    console.log('🆔 vehicleId:', vehicleId);
    console.log('🚫 readOnly:', readOnly);
    
    if (!vehicleData) {
      console.warn('⚠️ vehicleData não está disponível');
      alert('Dados do veículo são necessários para gerar o vídeo. Preencha os campos básicos primeiro.');
      return;
    }

    if (!vehicleId) {
      console.warn('⚠️ vehicleId não está disponível');
      alert('ID do veículo é necessário. Salve o veículo primeiro.');
      return;
    }

    if (readOnly) {
      console.warn('⚠️ Componente está em modo readOnly');
      return;
    }

    console.log('🚀 Iniciando geração de vídeo...');
    try {
      const result = await generateVideo(vehicleData);
      if (result) {
        // Recarregar a lista de vídeos para mostrar o novo vídeo
        await refetch();
        console.log('✅ Geração de vídeo concluída e lista atualizada');
      }
    } catch (error) {
      console.error('❌ Erro na geração:', error);
    }
  };

  // Log para debug
  console.log('🔍 VideoSection render - vehicleId:', vehicleId);
  console.log('🔍 VideoSection render - vehicleData:', vehicleData);
  console.log('🔍 VideoSection render - readOnly:', readOnly);

  if (readOnly && videos.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <VideoSectionHeader videoCount={videos.length} isOpen={isOpen} />
          
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              {!readOnly && (
                <VideoSectionActions
                  uploading={uploading}
                  generating={generating}
                  vehicleData={vehicleData}
                  vehicleId={vehicleId}
                  onUploadClick={() => fileInputRef.current?.click()}
                  onGenerateClick={handleGenerateVideo}
                />
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <VideoList
                videos={videos}
                readOnly={readOnly}
                onRemoveVideo={removeVideo}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </TooltipProvider>
  );
};

export default VideoSection;
