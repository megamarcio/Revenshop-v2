
import React from 'react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';
import OptimizedLazyImage from './OptimizedLazyImage';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehicleMainPhotoProps {
  vehicleId?: string;
  fallbackPhotos?: string[];
  vehicleName: string;
  className?: string;
  showLoader?: boolean;
  useLazyLoading?: boolean;
}

const VehicleMainPhoto: React.FC<VehicleMainPhotoProps> = ({
  vehicleId,
  fallbackPhotos = [],
  vehicleName,
  className = '',
  showLoader = false,
  useLazyLoading = true
}) => {
  const { photos: vehiclePhotos, loading: vehicleLoading } = useVehiclePhotos(vehicleId);
  const { photos: newPhotos, uploading: newPhotosUploading } = useNewVehiclePhotos(vehicleId);
  const { cardPhoto, loading: cardPhotoLoading } = useVehicleCardPhotos(vehicleId);
  
  console.log('🎯 VEHICLE MAIN PHOTO DEBUG');
  console.log('vehicleId:', vehicleId);
  console.log('vehiclePhotos:', vehiclePhotos);
  console.log('newPhotos:', newPhotos);
  console.log('cardPhoto:', cardPhoto);
  console.log('fallbackPhotos:', fallbackPhotos);
  
  // Determinar qual foto usar com prioridade
  let mainPhoto: string | undefined;
  
  if (vehicleId) {
    // PRIORIDADE 1: Foto principal da tabela vehicle_photos
    const mainVehiclePhoto = vehiclePhotos.find(p => p.is_main) || vehiclePhotos[0];
    if (mainVehiclePhoto?.url) {
      mainPhoto = mainVehiclePhoto.url;
      console.log('✅ USANDO FOTO PRINCIPAL DO VEÍCULO:', mainPhoto);
    }
    // PRIORIDADE 2: Foto do card (se não houver foto principal)
    else if (cardPhoto?.photo_url) {
      mainPhoto = cardPhoto.photo_url;
      console.log('✅ USANDO FOTO DO CARD:', mainPhoto);
    }
    // PRIORIDADE 3: Fotos novas
    else if (newPhotos.length > 0) {
      const mainNewPhoto = newPhotos.find(p => p.is_main) || newPhotos[0];
      mainPhoto = mainNewPhoto.url;
      console.log('✅ USANDO NOVA FOTO:', mainPhoto);
    }
  } 
  
  // PRIORIDADE 4: Fotos fallback
  if (!mainPhoto && fallbackPhotos.length > 0) {
    mainPhoto = fallbackPhotos[0];
    console.log('✅ USANDO FOTO FALLBACK:', mainPhoto);
  }
  
  const isLoading = vehicleId ? (vehicleLoading || newPhotosUploading || cardPhotoLoading) : false;
  
  console.log('🏁 FOTO FINAL SELECIONADA:', mainPhoto);
  console.log('⏳ CARREGANDO:', isLoading);
  
  // Use lazy loading for better performance when enabled
  if (useLazyLoading && vehicleId && (vehiclePhotos.length > 0 || cardPhoto || newPhotos.length > 0)) {
    return (
      <OptimizedLazyImage
        vehicleId={vehicleId}
        alt={`${vehicleName} - Foto principal`}
        className={className}
        showZoom={false}
      />
    );
  }
  
  // Fallback to regular photo display
  return (
    <VehiclePhotoDisplay
      photoUrl={mainPhoto}
      alt={`${vehicleName} - Foto principal`}
      className={className}
      showLoader={showLoader || isLoading}
    />
  );
};

export default VehicleMainPhoto;
