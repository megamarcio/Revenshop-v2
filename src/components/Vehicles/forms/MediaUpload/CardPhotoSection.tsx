
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ImageIcon, Upload, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';

interface CardPhotoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const CardPhotoSection = ({ vehicleId, vehicleData, readOnly = false }: CardPhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { cardPhoto, uploading, generating, uploadCardPhoto, generateCardPhoto, removeCardPhoto } = useVehicleCardPhotos(vehicleId);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !readOnly) {
      // Verificar limite de 3MB
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
    if (vehicleData && !readOnly) {
      await generateCardPhoto(vehicleData);
    }
  };

  if (readOnly && !cardPhoto) {
    return null;
  }

  return (
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
                  onClick={handleGeneratePhoto}
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
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {cardPhoto ? (
              <div className="relative group border rounded-lg overflow-hidden">
                <img
                  src={cardPhoto.photo_url}
                  alt="Foto do Card"
                  className="w-full h-32 object-cover"
                />
                
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                <p className="text-gray-500 text-xs">Nenhuma foto do card</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CardPhotoSection;
