import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Image, Video, FileText, Download } from 'lucide-react';
import NewPhotosSection from './MediaUpload/NewPhotosSection';
import CardPhotoSection from './MediaUpload/CardPhotoSection';
import VideoSection from './MediaUpload/VideoSection';
import DescriptionForm from './DescriptionForm';
import { toast } from '@/hooks/use-toast';
import { downloadAllPhotos } from '../../../utils/photoDownloader';

interface AnuncioContainerProps {
  vehicleId?: string;
  photos: string[];
  videos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  description: string;
  onDescriptionChange: (value: string) => void;
  generateDescription: () => Promise<void>;
  isGeneratingDescription: boolean;
  vehicleData?: any;
  readOnly?: boolean;
}

const AnuncioContainer = ({
  vehicleId,
  photos,
  videos,
  setPhotos,
  setVideos,
  description,
  onDescriptionChange,
  generateDescription,
  isGeneratingDescription,
  vehicleData,
  readOnly = false
}: AnuncioContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCardPhotos, setShowCardPhotos] = useState(false);
  const [showNewPhotos, setShowNewPhotos] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAllPhotos = async () => {
    if (photos.length === 0) {
      toast({
        title: 'Nenhuma foto disponível',
        description: 'Não há fotos para baixar.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);
    try {
      const vehicleName = vehicleData?.name || 'veiculo';
      await downloadAllPhotos(photos, vehicleName);
      
      toast({
        title: 'Download concluído!',
        description: `Todas as ${photos.length} fotos foram baixadas com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar as fotos. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Anúncio</h3>
        <p className="text-sm text-gray-600">Fotos, vídeos e descrição para o anúncio do veículo</p>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Anúncio
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-4">
          {/* Botão de Download de Todas as Fotos */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadAllPhotos}
              disabled={isDownloading || photos.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Baixando...' : `Download Todas as Fotos (${photos.length})`}
            </Button>
          </div>

          {/* Fotos do Card */}
          <Collapsible open={showCardPhotos} onOpenChange={setShowCardPhotos}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Fotos do Card
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showCardPhotos ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <CardPhotoSection
                vehicleId={vehicleId}
                vehicleData={vehicleData}
                readOnly={readOnly}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Fotos para Anúncio */}
          <Collapsible open={showNewPhotos} onOpenChange={setShowNewPhotos}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Fotos para Anúncio
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showNewPhotos ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <NewPhotosSection
                vehicleId={vehicleId}
                readOnly={readOnly}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Vídeo */}
          <Collapsible open={showVideos} onOpenChange={setShowVideos}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeo
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showVideos ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <VideoSection
                vehicleId={vehicleId}
                vehicleData={vehicleData}
                readOnly={readOnly}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Descrição para Anúncio */}
          <Collapsible open={showDescription} onOpenChange={setShowDescription}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descrição para Anúncio
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showDescription ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <DescriptionForm
                description={description}
                onDescriptionChange={onDescriptionChange}
                generateDescription={generateDescription}
                isGenerating={isGeneratingDescription}
              />
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AnuncioContainer; 