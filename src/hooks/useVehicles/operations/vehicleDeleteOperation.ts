
import { supabase } from '@/integrations/supabase/client';

export const deleteVehicle = async (id: string): Promise<void> => {
  console.log('Deleting vehicle:', id);
  
  try {
    // First, get all photos for this vehicle to delete from storage
    const { data: photos } = await supabase
      .from('vehicle_photos')
      .select('url')
      .eq('vehicle_id', id);

    // Delete photos from Storage
    if (photos && photos.length > 0) {
      const filePaths: string[] = [];
      
      photos.forEach(photo => {
        try {
          const url = new URL(photo.url);
          const pathSegments = url.pathname.split('/');
          const bucketIndex = pathSegments.findIndex(segment => segment === 'vehicle-photos');
          if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
            const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
            filePaths.push(storagePath);
          }
        } catch (error) {
          console.warn('Error parsing photo URL for deletion:', error);
        }
      });

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('vehicle-photos')
          .remove(filePaths);

        if (storageError) {
          console.warn('Error removing photos from storage:', storageError);
        }
      }
    }

    // Delete vehicle (photos will be deleted automatically due to ON DELETE CASCADE)
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting vehicle:', error);
      throw error;
    }
    
    console.log('Vehicle deleted successfully');
  } catch (error) {
    console.error('Error during vehicle deletion:', error);
    throw error;
  }
};
