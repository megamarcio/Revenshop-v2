
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Loader2, Image, Star } from 'lucide-react';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { toast } from '@/hooks/use-toast';
import VehiclePhotoDisplay from '../../VehiclePhotoDisplay';

interface NewPhotosSectionProps {
  vehicleId?: string;
  readOnly?: boolean;
}

const NewPhotosSection = ({ 
  vehicleId, 
  readOnly = false 
}: NewPhotosSectionProps) => {
  const { photos: newPhotos, uploading, uploadPhoto, removePhoto, setMainPhoto: setMainNewPhoto } = useNewVehiclePhotos(vehicleId);
  const { setMainPhoto: setMainVehiclePhoto } = useVehiclePhotos(vehicleId);

  console.log('NewPhotosSection - vehicleId:', vehicleId);
  console.log('NewPhotosSection - newPhotos:', newPhotos);

  const canEdit = !readOnly;

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit || !vehicleId) return;
    
    const files = event.target.files;
    if (!files || newPhotos.length >= 20) return;

    const maxFiles = Math.min(files.length, 20 - newPhotos.length);
    const fileArray = Array.from(files).slice(0, maxFiles);
    
    console.log(`Processing ${fileArray.length} new photos for upload`);
    
    try {
      for (const file of fileArray) {
        if (file.size > 1048576) { // 1MB
          console.warn(`File ${file.name} is too large. Skipping.`);
          toast({
            title: 'Arquivo muito grande',
            description: `${file.name} tem mais de 1MB e foi ignorado.`,
            variant: 'destructive',
          });
          continue;
        }

        console.log('Uploading new photo:', file.name);
        await uploadPhoto(file);
      }

      if (fileArray.length > 0) {
        toast({
          title: 'Fotos adicionadas',
          description: `${fileArray.length} foto(s) nova(s) adicionada(s).`,
        });
      }
    } catch (error) {
      console.error('Error processing new photos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar fotos novas. Tente novamente.',
        variant: 'destructive',
      });
    }
    
    event.target.value = '';
  };

  const removePhotoHandler = async (photoName: string) => {
    if (!canEdit) return;
    await removePhoto(photoName);
  };

  const handleSetMainPhoto = async (photoName: string) => {
    if (!canEdit) return;
    
    console.log('Setting main photo in NewPhotosSection:', photoName);
    
    try {
      // Primeiro, definir como principal nas fotos novas
      await setMainNewPhoto(photoName);
      
      // Depois, garantir que seja a principal também nas fotos do veículo
      // Isso irá forçar uma atualização na interface principal
      if (vehicleId) {
        // Disparar evento customizado para atualizar outras partes da interface
        window.dispatchEvent(new CustomEvent('mainPhotoChanged', { 
          detail: { vehicleId, photoName } 
        }));
      }
      
      toast({
        title: 'Sucesso',
        description: 'Foto principal definida com sucesso.',
      });
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir foto principal.',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Image className="h-5 w-5" />
        <span>Fotos Novas ({newPhotos.length}/20) - Máx. 1MB cada</span>
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {newPhotos.map((photo, index) => (
          <div key={photo.id} className="relative group">
            <VehiclePhotoDisplay
              photoUrl={photo.url}
              alt={`Foto nova ${index + 1}`}
              className="w-full h-24 rounded-lg"
            />
            
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
              {formatFileSize(photo.size)}
            </div>
            
            {/* Star button for main photo */}
            {canEdit && !uploading && (
              <div className="absolute top-1 left-1">
                <button
                  type="button"
                  onClick={() => handleSetMainPhoto(photo.name)}
                  className={`rounded-full p-1 transition-all ${
                    photo.is_main 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-black/50 text-white hover:bg-yellow-500'
                  }`}
                  title={photo.is_main ? 'Foto principal' : 'Marcar como principal'}
                >
                  <Star className={`h-3 w-3 ${photo.is_main ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
            
            {/* Delete button */}
            {canEdit && !uploading && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removePhotoHandler(photo.name)}
                  className="bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
        
        {canEdit && newPhotos.length < 20 && !uploading && vehicleId && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-revenshop-primary">
            <Plus className="h-6 w-6 text-gray-400" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        )}
        
        {uploading && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      
      {!vehicleId && (
        <p className="text-sm text-amber-600">
          Salve o veículo primeiro para poder adicionar fotos novas
        </p>
      )}
      
      {newPhotos.length >= 15 && (
        <p className="text-sm text-amber-600">
          Atenção: Muitas fotos podem tornar o carregamento mais lento
        </p>
      )}
    </div>
  );
};

export default NewPhotosSection;
