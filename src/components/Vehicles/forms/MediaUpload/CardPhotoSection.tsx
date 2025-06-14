
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageIcon, Upload, Sparkles, Trash2, ChevronDown, Info } from 'lucide-react';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';

const IMAGE_MODELS = [
  { value: 'gpt-image-1', label: 'GPT-Image-1 (OpenAI)' },
  { value: 'dall-e-3', label: 'DALL-E 3 (OpenAI)' },
];

interface CardPhotoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const CardPhotoSection = ({ vehicleId, vehicleData, readOnly = false }: CardPhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [aiModel, setAiModel] = useState<'gpt-image-1' | 'dall-e-3'>('gpt-image-1');
  const [seedInput, setSeedInput] = useState<string>('');
  const { cardPhoto, uploading, generating, uploadCardPhoto, generateCardPhoto, removeCardPhoto } = useVehicleCardPhotos(vehicleId);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !readOnly) {
      if (file.size > 3 * 1024 * 1024) {
        alert('A foto deve ter no máximo 3MB.');
        return;
      }
      await uploadCardPhoto(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGeneratePhoto = async () => {
    if (!vehicleData) {
      alert('Dados do veículo são necessários para gerar a imagem. Preencha os campos básicos primeiro.');
      return;
    }

    if (!vehicleId) {
      alert('ID do veículo é necessário. Salve o veículo primeiro.');
      return;
    }

    if (readOnly) {
      return;
    }

    await generateCardPhoto(vehicleData, { aiModel, seed: seedInput });
  };

  if (readOnly && !cardPhoto) {
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
                  <ImageIcon className="h-4 w-4" />
                  Foto do Card
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              {!readOnly && (
                <div className="flex flex-wrap gap-2 items-center">
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
                  
                  {/* Modelo IA */}
                  <select
                    className="rounded-md border px-2 py-1 text-xs"
                    style={{ minWidth: 120 }}
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as any)}
                    disabled={generating}
                    title="Escolha o modelo de IA para gerar a imagem"
                  >
                    {IMAGE_MODELS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  {/* Seed/Referencia visual (texto) */}
                  <input
                    type="text"
                    placeholder="Texto referência/seed (opcional)"
                    className="border rounded-md px-2 py-1 text-xs"
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    maxLength={96}
                    style={{ width: 180 }}
                    disabled={generating}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePhoto}
                    disabled={generating || !vehicleData || !vehicleId}
                    className="flex items-center gap-2 text-xs"
                    title={!vehicleData ? 'Preencha os dados básicos do veículo primeiro' : !vehicleId ? 'Salve o veículo primeiro' : 'Gerar foto com IA'}
                  >
                    <Sparkles className="h-3 w-3" />
                    {generating ? 'Gerando...' : 'Gerar IA'}
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {cardPhoto ? (
                <div className="relative group border rounded-lg overflow-hidden w-[228px] h-[228px] mx-auto">
                  <img
                    src={cardPhoto.photo_url}
                    alt="Foto do Card"
                    className="w-full h-full object-cover"
                    style={{ width: "6cm", height: "6cm" }}
                  />
                  
                  <div className="absolute top-1 left-1 flex gap-1">
                    {cardPhoto.prompt_used && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                            <Info className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs"><strong>Prompt usado:</strong></p>
                          <p className="text-xs mt-1">{cardPhoto.prompt_used}</p>
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
                        onClick={removeCardPhoto}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center w-[228px] h-[228px] mx-auto flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                  <p className="text-gray-500 text-xs">Nenhuma foto do card</p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </TooltipProvider>
  );
};

export default CardPhotoSection;
