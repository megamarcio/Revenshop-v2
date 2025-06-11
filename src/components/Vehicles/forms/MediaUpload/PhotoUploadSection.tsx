
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Star, Loader2, Image } from 'lucide-react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { toast } from '@/hooks/use-toast';
import VehiclePhotoDisplay from '../../VehiclePhotoDisplay';

interface PhotoUploadSectionProps {
  vehicleId?: string;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
}

const PhotoUploadSection = ({ 
  vehicleId, 
  photos, 
  setPhotos,
  readOnly = false 
}: PhotoUploadSectionProps) => {
  const { photos: vehiclePhotos, uploading, uploadPhoto, removePhoto, setMainPhoto } = useVehiclePhotos(vehicleId);

  console.log('PhotoUploadSection - vehicleId:', vehicleId);
  console.log('PhotoUploadSection - vehiclePhotos:', vehiclePhotos);
  console.log('PhotoUploadSection - local photos:', photos);

  // Use vehicle_photos if vehicleId is provided, otherwise use local state
  const displayPhotos = vehicleId ? vehiclePhotos : photos;
  const canEdit = !readOnly;

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    
    const files = event.target.files;
    if (!files || displayPhotos.length >= 10) return;

    const maxFiles = Math.min(files.length, 10 - displayPhotos.length);
    const fileArray = Array.from(files).slice(0, maxFiles);
    
    console.log(`Processing ${fileArray.length} files for upload`);
    
    try {
      if (vehicleId) {
        // Upload para Supabase Storage via useVehiclePhotos hook
        for (const file of fileArray) {
          console.log('Uploading file via useVehiclePhotos:', file.name);
          await uploadPhoto(file);
        }
      } else {
        // Upload local para base64 (para novos veículos)
        console.log('Processing photos for new vehicle (base64)');
        
        for (const file of fileArray) {
          if (file.size > 5 * 1024 * 1024) {
            console.warn(`File ${file.name} is too large. Skipping.`);
            toast({
              title: 'Arquivo muito grande',
              description: `${file.name} tem mais de 5MB e foi ignorado.`,
              variant: 'destructive',
            });
            continue;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              console.log(`File ${file.name} converted to base64`);
              setPhotos(prev => {
                const newPhotos = [...prev, e.target!.result as string];
                console.log('Added photo to local state:', newPhotos.length, 'total photos');
                return newPhotos.slice(0, 10);
              });
            }
          };
          reader.onerror = () => {
            console.error(`Error reading file ${file.name}`);
          };
          reader.readAsDataURL(file);
        }

        if (fileArray.length > 0) {
          toast({
            title: 'Fotos adicionadas',
            description: `${fileArray.length} foto(s) adicionada(s). Salve o veículo para confirmar.`,
          });
        }
      }
    } catch (error) {
      console.error('Error processing photos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar fotos. Tente novamente.',
        variant: 'destructive',
      });
    }
    
    event.target.value = '';
  };

  const removePhotoHandler = async (index: number) => {
    if (!canEdit) return;
    
    if (vehicleId && vehiclePhotos[index]) {
      await removePhoto(vehiclePhotos[index].id);
    } else {
      setPhotos(prev => {
        const updated = prev.filter((_, i) => i !== index);
        console.log('Removed photo from local state, remaining:', updated.length);
        return updated;
      });
    }
  };

  const setMainPhotoHandler = async (index: number) => {
    if (!canEdit || !vehicleId || !vehiclePhotos[index]) return;
    
    await setMainPhoto(vehiclePhotos[index].id);
  };

  const getPhotoUrl = (index: number): string => {
    if (vehicleId) {
      return vehiclePhotos[index]?.url || '';
    }
    return photos[index] || '';
  };

  const getPhotoCount = (): number => {
    return vehicleId ? vehiclePhotos.length : photos.length;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Image className="h-5 w-5" />
        <span>Fotos ({getPhotoCount()}/10)</span>
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: getPhotoCount() }).map((_, index) => {
          const photoUrl = getPhotoUrl(index);
          const isMain = vehicleId ? vehiclePhotos[index]?.is_main : index === 0;
          
          return (
            <div key={index} className="relative group">
              <VehiclePhotoDisplay
                photoUrl={photoUrl}
                alt={`Foto ${index + 1}`}
                className="w-full h-24 rounded-lg"
              />
              
              {isMain && (
                <Star className="absolute top-1 left-1 h-4 w-4 text-yellow-500 fill-current" />
              )}
              
              {canEdit && !uploading && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {vehicleId && !isMain && (
                    <button
                      type="button"
                      onClick={() => setMainPhotoHandler(index)}
                      className="bg-blue-500 text-white rounded-full p-1"
                      title="Definir como foto principal"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhotoHandler(index)}
                    className="bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {canEdit && getPhotoCount() < 10 && !uploading && (
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
      
      {getPhotoCount() >= 8 && (
        <p className="text-sm text-amber-600">
          Atenção: Muitas fotos podem tornar o salvamento mais lento
        </p>
      )}
    </div>
  );
};

export default PhotoUploadSection;
