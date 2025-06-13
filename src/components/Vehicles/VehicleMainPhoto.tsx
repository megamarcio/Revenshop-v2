
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
  
  // PRIORIDADE MÁXIMA: Foto do card sempre será a foto principal nos cards
  let mainPhoto: string | undefined;
  
  console.log('=== VEHICLE MAIN PHOTO DEBUG ===');
  console.log('vehicleId:', vehicleId);
  console.log('vehicleName:', vehicleName);
  console.log('cardPhoto RAW:', cardPhoto);
  console.log('cardPhoto?.photo_url:', cardPhoto?.photo_url);
  console.log('newPhotos:', newPhotos);
  console.log('vehiclePhotos:', vehiclePhotos);
  console.log('fallbackPhotos:', fallbackPhotos);
  
  if (vehicleId) {
    // Priority 1: Card photo (SEMPRE tem prioridade máxima)
    if (cardPhoto?.photo_url) {
      console.log('🎯 USANDO CARD PHOTO:', cardPhoto.photo_url);
      
      let photoUrl = cardPhoto.photo_url;
      
      // Debug da URL original
      console.log('URL original:', photoUrl);
      console.log('URL includes supabase?', photoUrl.includes('supabase'));
      console.log('URL starts with http?', photoUrl.startsWith('http'));
      
      // Se a URL não começa com http, vamos construir a URL completa
      if (!photoUrl.startsWith('http')) {
        console.log('🔧 Construindo URL completa...');
        
        // Remover prefixos desnecessários se existirem
        let cleanPath = photoUrl;
        if (cleanPath.startsWith('vehicles-photos-new/')) {
          cleanPath = cleanPath.replace('vehicles-photos-new/', '');
        }
        if (cleanPath.startsWith('vehicle-cards/')) {
          cleanPath = cleanPath.replace('vehicle-cards/', '');
        }
        
        // Construir URL completa
        photoUrl = `https://ctdajbfmgmkhqueskjvk.supabase.co/storage/v1/object/public/vehicles-photos-new/${cleanPath}`;
        console.log('🔧 URL construída:', photoUrl);
      }
      
      mainPhoto = photoUrl;
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
  console.log('mainPhoto:', mainPhoto);
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
