
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
  
  let mainPhoto: string | undefined;
  
  console.log('=== VEHICLE MAIN PHOTO DEBUG ===');
  console.log('vehicleId:', vehicleId);
  console.log('cardPhoto objeto completo:', cardPhoto);
  
  if (vehicleId) {
    // Priority 1: Card photo (SEMPRE tem prioridade máxima)
    if (cardPhoto?.photo_url) {
      console.log('🎯 USANDO CARD PHOTO - URL original:', cardPhoto.photo_url);
      mainPhoto = cardPhoto.photo_url;
      console.log('✅ FOTO PRINCIPAL DEFINIDA (CARD):', mainPhoto);
    }
    // Priority 2: Check for main photo in new photos
    else if (newPhotos.length > 0) {
      const mainNewPhoto = newPhotos.find(p => p.is_main);
      if (mainNewPhoto) {
        console.log('✅ USANDO NOVA FOTO PRINCIPAL:', mainNewPhoto.url);
        mainPhoto = mainNewPhoto.url;
      } else {
        console.log('✅ USANDO PRIMEIRA NOVA FOTO:', newPhotos[0].url);
        mainPhoto = newPhotos[0].url;
      }
    }
    // Priority 3: Fallback to vehicle photos
    else if (vehiclePhotos.length > 0) {
      const mainPhotoObj = vehiclePhotos.find(p => p.is_main);
      mainPhoto = mainPhotoObj?.url || vehiclePhotos[0]?.url;
      console.log('✅ USANDO FOTO DO VEÍCULO:', mainPhoto);
    }
  } else if (fallbackPhotos.length > 0) {
    // Use fallback photos (strings)
    mainPhoto = fallbackPhotos[0];
    console.log('✅ USANDO FOTO FALLBACK:', mainPhoto);
  }
  
  const isLoading = vehicleId ? (vehicleLoading || newPhotosUploading || cardPhotoLoading) : false;
  
  console.log('🏁 RESULTADO FINAL:');
  console.log('mainPhoto para VehiclePhotoDisplay:', mainPhoto);
  console.log('isLoading:', isLoading);
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
