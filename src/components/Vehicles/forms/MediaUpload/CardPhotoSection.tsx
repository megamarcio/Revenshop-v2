
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Upload, Sparkles, Trash2 } from 'lucide-react';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';

interface CardPhotoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const CardPhotoSection = ({ vehicleId, vehicleData, readOnly = false }: CardPhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cardPhoto, uploading, generating, uploadCardPhoto, generateCardPhoto, removeCardPhoto } = useVehicleCardPhotos(vehicleId);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !readOnly) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-5 w-5" />
          Foto do Card
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
              {uploading ? 'Enviando...' : 'Upload Foto'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGeneratePhoto}
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
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {cardPhoto ? (
          <div className="relative group border rounded-lg overflow-hidden max-w-sm">
            <img
              src={cardPhoto.photo_url}
              alt="Foto do Card"
              className="w-full h-48 object-cover"
            />
            
            {!readOnly && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeCardPhoto}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-sm">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 text-sm">Nenhuma foto do card</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardPhotoSection;
