
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Wand2, X, Loader2, Image } from 'lucide-react';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';
import VehiclePhotoDisplay from '../../VehiclePhotoDisplay';

interface CardPhotoSectionProps {
  vehicleId?: string;
  vehicleData?: any;
  readOnly?: boolean;
}

const CardPhotoSection = ({ 
  vehicleId, 
  vehicleData,
  readOnly = false 
}: CardPhotoSectionProps) => {
  const { 
    cardPhoto, 
    loading, 
    uploading, 
    generating, 
    uploadCardPhoto, 
    generateCardPhoto, 
    removeCardPhoto 
  } = useVehicleCardPhotos(vehicleId);

  const canEdit = !readOnly && vehicleId;

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadCardPhoto(file);
    event.target.value = '';
  };

  const handleGeneratePhoto = async () => {
    if (!canEdit || !vehicleData) return;
    await generateCardPhoto(vehicleData);
  };

  const handleRemovePhoto = async () => {
    if (!canEdit) return;
    await removeCardPhoto();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Image className="h-5 w-5" />
        <span>Foto Principal do Card - Máx. 3MB</span>
        {(uploading || generating) && <Loader2 className="h-4 w-4 animate-spin" />}
      </h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {cardPhoto ? (
          <div className="space-y-4">
            <VehiclePhotoDisplay
              photoUrl={cardPhoto.photo_url}
              alt="Foto do card do veículo"
              className="w-full h-48 rounded-lg mx-auto max-w-sm"
            />
            
            {cardPhoto.prompt_used && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Prompt usado:</strong> {cardPhoto.prompt_used}
              </div>
            )}
            
            {canEdit && (
              <div className="flex space-x-2 justify-center">
                <label className="cursor-pointer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    disabled={uploading || generating}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePhoto}
                  disabled={uploading || generating || !vehicleData}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {generating ? 'Gerando...' : 'Gerar com IA'}
                </Button>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemovePhoto}
                  disabled={uploading || generating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Nenhuma foto do card definida</p>
            </div>
            
            {canEdit && (
              <div className="flex space-x-2 justify-center">
                <label className="cursor-pointer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploading || generating}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Foto
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                
                <Button
                  type="button"
                  variant="default"
                  onClick={handleGeneratePhoto}
                  disabled={uploading || generating || !vehicleData}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {generating ? 'Gerando...' : 'Gerar com IA'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!vehicleId && (
        <p className="text-sm text-amber-600">
          Salve o veículo primeiro para poder definir a foto do card
        </p>
      )}
      
      {!vehicleData && vehicleId && (
        <p className="text-sm text-amber-600">
          Complete as informações do veículo para gerar foto com IA
        </p>
      )}
    </div>
  );
};

export default CardPhotoSection;
