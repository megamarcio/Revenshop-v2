
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Video, Upload, Sparkles, Trash2, ChevronDown, Info } from 'lucide-react';
import { useVehicleVideos } from '@/hooks/useVehicleVideos';

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
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeos do Veículo ({videos.length})
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
                    disabled={generating || !vehicleData || !vehicleId}
                    className="flex items-center gap-2 text-xs"
                    title={!vehicleData ? 'Preencha os dados básicos do veículo primeiro' : !vehicleId ? 'Salve o veículo primeiro' : 'Gerar vídeo com IA'}
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
    </TooltipProvider>
  );
};

export default VideoSection;
