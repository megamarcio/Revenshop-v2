
import { VehiclePhoto } from '../../useVehiclePhotos';

// Utility to convert vehicle_photos to legacy photos array format for backward compatibility
export const mapVehiclePhotosToArray = (vehiclePhotos: VehiclePhoto[]): string[] => {
  return vehiclePhotos
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(photo => photo.url);
};

// Get main photo URL from vehicle_photos
export const getMainPhotoUrl = (vehiclePhotos: VehiclePhoto[]): string | undefined => {
  const mainPhoto = vehiclePhotos.find(photo => photo.is_main);
  return mainPhoto?.url || vehiclePhotos[0]?.url;
};

// Convert photos array to vehicle_photos format for inserts
export const mapPhotosArrayToVehiclePhotos = (
  vehicleId: string, 
  photos: string[]
): Array<{
  vehicle_id: string;
  url: string;
  position: number;
  is_main: boolean;
}> => {
  return photos.map((url, index) => ({
    vehicle_id: vehicleId,
    url,
    position: index + 1,
    is_main: index === 0
  }));
};
