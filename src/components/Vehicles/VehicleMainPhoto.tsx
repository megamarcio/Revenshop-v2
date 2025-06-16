
import React from 'react';
import { useVehiclePhotos } from '@/hooks/useVehiclePhotos';
import { useNewVehiclePhotos } from '@/hooks/useNewVehiclePhotos';
import { useVehicleCardPhotos } from '@/hooks/useVehicleCardPhotos';
import VehiclePhotoDisplay from './VehiclePhotoDisplay';

interface VehicleMainPhotoProps {
  vehicleId?: string;
  fallbackPhotos?: string[];
  vehicleName: string;
  className?: string;
  showLoader?: boolean;
}

const VehicleMainPhoto: React.FC<VehicleMainPhotoProps> = ({
  vehicleId,
  fallbackPhotos = [],
  vehicleName,
  className = '',
  showLoader = false
}) => {
  const { photos: vehiclePhotos, loading: vehicleLoading } = useVehiclePhotos(vehicleId);
  const { photos: newPhotos, uploading: newPhotosUploading } = useNewVehiclePhotos(vehicleId);
  const { cardPhoto, loading: cardPhotoLoading } = useVehicleCardPhotos(vehicleId);
  
  console.log('=== VEHICLE MAIN PHOTO DEBUG ===');
  console.log('vehicleId:', vehicleId);
  console.log('cardPhoto:', cardPhoto);
  console.log('cardPhoto?.photo_url:', cardPhoto?.photo_url);
  
  // Determinar qual foto usar com prioridade simples
  let mainPhoto: string | undefined;
  
  if (vehicleId) {
    // PRIORIDADE 1: Foto do card (se existir)
    if (cardPhoto?.photo_url) {
      mainPhoto = cardPhoto.photo_url;
      console.log('🎯 USANDO FOTO DO CARD:', mainPhoto);
    }
    // PRIORIDADE 2: Fotos novas
    else if (newPhotos.length > 0) {
      const mainNewPhoto = newPhotos.find(p => p.is_main) || newPhotos[0];
      mainPhoto = mainNewPhoto.url;
      console.log('📷 USANDO NOVA FOTO:', mainPhoto);
    }
    // PRIORIDADE 3: Fotos do veículo
    else if (vehiclePhotos.length > 0) {
      const mainPhotoObj = vehiclePhotos.find(p => p.is_main) || vehiclePhotos[0];
      mainPhoto = mainPhotoObj.url;
      console.log('📸 USANDO FOTO DO VEÍCULO:', mainPhoto);
    }
  } else if (fallbackPhotos.length > 0) {
    mainPhoto = fallbackPhotos[0];
    console.log('🔄 USANDO FOTO FALLBACK:', mainPhoto);
  }
  
  const isLoading = vehicleId ? (vehicleLoading || newPhotosUploading || cardPhotoLoading) : false;
  
  console.log('🏁 FOTO FINAL SELECIONADA:', mainPhoto);
  console.log('=== FIM DEBUG ===');
  
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
